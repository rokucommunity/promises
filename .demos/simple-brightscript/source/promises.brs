' @rokucommunity/promises v0.1.0
' Create a new promise
function promises_create() as dynamic
    'create a unique ID for this promise
    id = "promise-" + promises_internal_createUuid()
    node = createObject("roSGNode", "promises_Promise")
    node.id = id
    return node
end function

' TODO rename this to `then` once BrighterScript supports using keywords as namespaced function names
function promises_onThen(promise as dynamic, callback as Function, context = "__INVALID__" as object) as dynamic
    return promises_internal_on("then", promise, callback, context)
end function

' TODO rename this to `catch` once BrighterScript supports using keywords as namespaced function names
function promises_onCatch(promise as dynamic, callback as Function, context = "__INVALID__" as object) as dynamic
    return promises_internal_on("catch", promise, callback, context)
end function

' TODO rename this to `finally` once BrighterScript supports using keywords as namespaced function names
function promises_onFinally(promise as dynamic, callback as Function, context = "__INVALID__" as object) as dynamic
    return promises_internal_on("finally", promise, callback, context)
end function

' Allows multiple promise operations to be resolved as a single promise.
function promises_all(promiseArray as dynamic) as dynamic
    ' Create a deferred to be resolved later
    deferred = promises_create()
    if type(promiseArray) = "roArray" and not promiseArray.isEmpty() then
        ' Track the state and results of all the promises
        state = {
            deferred: deferred
            results: []
            resolvedCount: 0
            total: promiseArray.count()
            done: false
        }
        for i = 0 to promiseArray.count() - 1
            promise = promiseArray[i]
            if promises_isPromise(promise) then
                ' Watch for both resolved or rejected promises
                promises_onThen(promise, sub(result as dynamic, context as dynamic)
                    ' Do not process any promises that come in late
                    ' This can happen if any of the other promises reject
                    if not context.state.done then
                        ' Always assign the result to the origin index so results are in the same
                        ' order as the supplied promiseArray
                        context.state.results[context.index] = result
                        context.state.resolvedCount++
                        if context.state.resolvedCount = context.state.total then
                            ' All the promises are resolved.
                            ' Resolve the deferred and make the state as complete
                            context.state.done = true
                            promises_resolve(context.state.results, context.state.deferred)
                        end if
                    end if
                end sub, {
                    state: state
                    index: i
                })
                promises_onCatch(promise, sub(error as dynamic, state as dynamic)
                    ' This shouldn't happen but if we somehow get a rejected promise after
                    ' the state is marked as done we should ignore this callback
                    if not state.done then
                        ' Immediately mark the state as done and reject the deferred
                        ' with the error from the rejected promise the first time any
                        ' promise rejects regardless where in the promise array it was
                        ' located.
                        state.done = true
                        promises_reject(error, state.deferred)
                    end if
                end sub, state)
            else
                ' The value in the promise array is not a promise.
                ' Immediately set the result.
                state.results[i] = promise
                state.resolvedCount++
                if state.resolvedCount = state.total then
                    ' All the promises are resolved.
                    ' Resolve the deferred and make the state as complete
                    state.done = true
                    promises_resolve(state.results, state.deferred)
                end if
            end if
        end for
    else
        if type(promiseArray) = "roArray" then
            ' Resolve when the array is empty
            promises_resolve(promiseArray, deferred)
        else
            ' Reject if the supplied list is not an array
            promises_reject("Promises.all: did not supply an array")
        end if
    end if
    return deferred
end function

function promises_resolve(result as dynamic, promise = invalid as dynamic) as object
    if not promises_isPromise(promise) then
        promise = promises_create()
    end if
    if not promises_isComplete(promise) then
        ' console.trace("[promises.resolve]", promise.id)
        promise.update({
            promiseResult: result
        }, true)
        promise.promiseState = "resolved"
    end if
    return promise
end function

function promises_reject(error as dynamic, promise = invalid as dynamic) as object
    if not promises_isPromise(promise) then
        promise = promises_create()
    end if
    if not promises_isComplete(promise) then
        ' console.trace("[promises.reject]", promise.id)
        promise.update({
            promiseResult: error
        }, true)
        promise.promiseState = "rejected"
    end if
    return promise
end function

function promises_isComplete(promise as object) as boolean
    return promises_isPromise(promise) and (promise.promiseState = "resolved" or promise.promiseState = "rejected")
end function

' Determines if the given item is a promise.
'
' Will return true if at least one of the following conditions are true:
' - the SubType exactly equals "Promise"
' - the subtype ends with "_promise" case insensitive
' - the node has a field called "promiseState"
function promises_isPromise(promise as dynamic) as boolean
    if not type(promise) = "roSGNode" then
        return false
    end if
    subType = lCase(promise.subType())
    if subType.endsWith("_promise") then
        return true
    end if
    if subType = "promise" then
        return true
    end if
    while true
        subType = promise.parentSubtype(subType)
        if lCase(subType).endsWith("_promise") then
            return true
        end if
        if subType = "" then
            exit while
        end if
    end while
    return promise.hasField("promiseState")
end function

' Remove all promise storage from the current m
sub promises_clean()
    for each key in m
        if key.startsWith("__promises__") then
            m.delete(key)
        end if
    end for
end sub

'Allows chaining multiple promise operations in a row in a clean syntax
function promises_chain(initialPromise as object, context = "__INVALID__" as object) as object
    return {
        _lastPromise: initialPromise
        _context: context
        then: function(callback as Function) as object
            m._lastPromise = promises_onThen(m._lastPromise, callback, m._context)
            return m
        end function
        "catch": function(callback as Function) as object
            m._lastPromise = promises_onCatch(m._lastPromise, callback, m._context)
            return m
        end function
        finally: function(callback as Function) as object
            m._lastPromise = promises_onFinally(m._lastPromise, callback, m._context)
            return m
        end function
        toPromise: function() as object
            return m._lastPromise
        end function
    }
end function

' Makes sure the value supplied is a promise
function promises_ensurePromise(value as object) as object
    return (function(__bsCondition, promises, value)
            if __bsCondition then
                return value
            else
                return promises_resolve(value)
            end if
        end function)(promises_isPromise(value), promises, value)
end function



' Clear storage for a given promise
sub promises_internal_clearPromiseStorage(promise as object)
    m.delete("__promises__" + promise.id)
end sub

' Get the storage for a promise on `m`
function promises_internal_getPromiseStorage(promise as object) as object
    id = "__promises__" + promise.id
    storage = m[id]
    if storage = invalid then
        ' unregister any observers on the promise to prevent multiple callbacks
        promises_internal_unobserveFieldScoped(promise, "promiseState")
        promises_internal_observeFieldScoped(promise, "promiseState", promises_internal_notifyListeners)
        storage = {
            promise: promise
            thenListeners: []
            catchListeners: []
            finallyListeners: []
        }
        m[id] = storage
    end if
    return storage
end function

'
' Registers a listener for a promise for the then, catch, or finally events
' @param eventName - should be "then", "catch", or "finally"
'
function promises_internal_on(eventName as string, promise as dynamic, callback as Function, context = {} as object) as dynamic
    if promises_isPromise(promise) then
        newPromise = promises_create()
        storage = promises_internal_getPromiseStorage(promise)
        storage[eventName + "Listeners"].push({
            callback: callback
            context: context
            promise: newPromise
        })
        promiseState = promise.promiseState
        'trigger a change if the promise is already resolved
        if promiseState = "resolved" or promiseState = "rejected" then
            promises_internal_delay(sub(details as object)
                details.promise.promiseState = details.promiseState
            end sub, {
                promise: promise
                promiseState: promiseState
            })
        end if
        return newPromise
    end if
    errorMessage = "Cannot register promises." + eventName + " for non-promise"
    throw errorMessage
    return invalid
end function

'
' Notify all the listeners of a promise that it has been completed
'
sub promises_internal_notifyListeners(event as object)
    originalPromise = event.getRoSgNode()
    if promises_isComplete(originalPromise) then
        ' unregister any observers once the promise is completed
        promises_internal_unobserveFieldScoped(originalPromise, "promiseState")
        promiseStorage = promises_internal_getPromiseStorage(originalPromise)
        promiseState = originalPromise.promiseState
        promiseResult = originalPromise.promiseResult
        'handle .then() listeners
        for each listener in promiseStorage.thenListeners
            promises_internal_processPromiseListener(originalPromise, listener, promiseState = "resolved", promiseResult)
        end for
        'handle .catch() listeners
        for each listener in promiseStorage.catchListeners
            promises_internal_processPromiseListener(originalPromise, listener, promiseState = "rejected", promiseResult)
        end for
        'handle .finally() listeners
        for each listener in promiseStorage.finallyListeners
            promises_internal_processPromiseListener(originalPromise, listener, true)
        end for
        'delete the storage for this promise since we've handled all of the listeners
        promises_internal_clearPromiseStorage(originalPromise)
    end if
end sub

' We use an internal value to represent unset. Check if the parameter is that value
function promises_internal_isSet(value as dynamic) as boolean
    return not (promises_internal_isNonEmptyString(value) and value = "__INVALID__")
end function

' Is the supplied value a valid String type and is not empty
' @param value - The variable to be checked
' @return true if value is a non-empty string, false otherwise
function promises_internal_isNonEmptyString(value as dynamic) as boolean
    return (type(value) = "String" or type(value) = "roString") and value <> ""
end function

' Handle an individual promise listener
sub promises_internal_processPromiseListener(originalPromise as object, storageItem as object, callCallback as boolean, promiseValue = "__INVALID__" as dynamic)
    newPromise = storageItem.promise
    callback = storageItem.callback
    context = storageItem.context
    hasContext = promises_internal_isSet(context)
    hasPromiseValue = promises_internal_isSet(promiseValue)
    'only call the callback if configured to do so
    if callCallback then
        try
            '.then and .catch take one or two parameters (`promiseValue` and optional `context`)
            if hasPromiseValue then
                if hasContext then
                    callbackResult = callback(promiseValue, context)
                else
                    callbackResult = callback(promiseValue)
                end if
                '.finally callback takes 1 optional parameter (`context`)
            else
                if hasContext then
                    callbackResult = callback(context)
                else
                    callbackResult = callback()
                end if
            end if
        catch e
            'the result is a rejected promise
            callbackResult = promises_reject(e)
        end try
    else
        'use the current promise value to pass to the next promise (this is a .catch handler)
        if originalPromise.promiseState = "rejected" then
            callbackResult = promises_reject(promiseValue)
        else
            callbackResult = promiseValue
        end if
    end if
    'if the .then() callback returned a promise. wait for it to resolve and THEN resolve the newPromise
    if promises_isPromise(callbackResult) then
        callbackPromise = callbackResult
        'wait for the callback promise to complete
        promises_onFinally(callbackPromise, sub(context as object)
            promiseState = context.callbackPromise.promiseState
            promiseResult = context.callbackPromise.promiseResult
            if promiseState = "resolved" then
                'the callback promise is complete. resolve the newPromise
                promises_resolve(promiseResult, context.newPromise)
                return
            end if
            if promiseState = "rejected" then
                promises_reject(promiseResult, context.newPromise)
                return
            end if
        end sub, {
            newPromise: newPromise
            callbackPromise: callbackPromise
        })
        'the .then() callback returned a non-promise. Resolve the newPromise immediately with this value
    else
        promises_resolve(callbackResult, newPromise)
    end if
end sub

'
' Generates a new UUID
'
function promises_internal_createUuid() as string
    if m.__promises__deviceInfo = invalid then
        m.__promises__deviceInfo = createObject("roDeviceInfo")
    end if
    return m.__promises__deviceInfo.getRandomUUID()
end function

' Makes a delayed call to the supplied function. Default behavior is essentially next tick.
' @param {Function} callback - The function to be called after a set delay
' @param {Dynamic} context - a single item of data to be passed into the callback when invoked
' @param {Float} [duration] - the amount of delay before invoking the callback
sub promises_internal_delay(callback as Function, context as dynamic, duration = 0.0001 as float)
    timer = createObject("roSGNode", "Timer")
    timer.update({
        duration: duration
        repeat: false
        id: "__delay_" + promises_internal_createUuid()
    }, true)
    m[timer.id] = {
        timer: timer
        callback: callback
        context: context
    }
    promises_internal_observeFieldScoped(timer, "fire", sub(event as object)
        promises_internal_unobserveFieldScoped(event.getRosgNode(), "fire")
        delayId = event.getNode()
        options = m[delayId]
        callback = options.callback
        try
            callback(options.context)
        catch e
        end try
        m[delayId] = invalid
    end sub)
    timer.control = "start"
end sub

' Observes a node field using observeFieldScoped
' @param {roSGNode} node - The node to apply the observer
' @param {String} field - The name of the field to be monitored.
' @param {Dynamic} callback - The name or message port to be executed when the value of the field changes.
' @return true if field could be observed, false if not
function promises_internal_observeFieldScoped(node as object, field as string, callback as dynamic, infoFields = [] as object)
    if not type(node) = "roSGNode" then
        return false
    else
        if type(callback) = "roFunction" or type(callback) = "Function" then
            callback = callback.toStr().tokenize(" ").peek()
        end if
        if not node.observeFieldScoped(field, callback, infoFields) then
            return false
        end if
    end if
    return true
end function

' Unobserve a node field using unobserveFieldScoped
' @param {roSGNode} node - The node to remove the observer from
' @param {String} field - The name of the field to no longer be monitored.
' @return true if field could be unobserved, false if not
function promises_internal_unobserveFieldScoped(node as object, field as string)
    if not type(node) = "roSGNode" then
        return false
    else
        if not node.unobserveFieldScoped(field) then
            return false
        end if
    end if
    return true
end function'//# sourceMappingURL=./promises.bs.map
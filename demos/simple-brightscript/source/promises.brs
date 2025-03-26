' @rokucommunity/promises 0.6.3
' Create a new promise
function promises_create() as dynamic
    'create a unique ID for this promise
    id = "promise-" + promises_internal_createUuid()
    node = createObject("roSGNode", "promises_Promise")
    node.id = id
    return node
end function

' TODO rename this to `then` once BrighterScript supports using keywords as namespaced function names
function promises_onThen(promise as dynamic, callback = promises_internal_defaultThenCallback as Function, context = "__INVALID__" as object) as dynamic
    return promises_internal_on("then", promise, callback, context)
end function

' TODO rename this to `catch` once BrighterScript supports using keywords as namespaced function names
function promises_onCatch(promise as dynamic, callback = promises_internal_defaultCatchCallback as Function, context = "__INVALID__" as object) as dynamic
    return promises_internal_on("catch", promise, callback, context)
end function

' TODO rename this to `finally` once BrighterScript supports using keywords as namespaced function names
function promises_onFinally(promise as dynamic, callback = promises_internal_defaultFinallyCallback as Function, context = "__INVALID__" as object) as dynamic
    return promises_internal_on("finally", promise, callback, context)
end function

' The Promise.try() method takes a callback of any kind (returns or throws, synchronously or asynchronously) and wraps its result in a Promise.
' @param {function} callback - The callback to wrap in a promise
' @param {dynamic} args - The arguments to pass to the callback. Max 32 arguments.
function promises_try(callback as Function, args = invalid as dynamic) as dynamic
    try
        result = promises_internal_callWithArgs(callback, args)
        return promises_ensurePromise(result)
    catch e
        return promises_reject(e)
    end try
end function

' Takes an array of promises as input and returns a single Promise.
' This returned promise fulfills when all of the input's promises fulfill (including when an empty array is passed), with an array of the fulfillment values.
' It rejects when any of the input's promises rejects, with this first rejection reason.
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
            try
                throw "Did not supply an array"
            catch e
                promises_reject(e, deferred)
            end try
        end if
    end if
    return deferred
end function

' Takes an array of promises as input and returns a single Promise.
' This returned promise fulfills when all of the input's promises settle (including when an empty array is passed),
' with an array of objects that describe the outcome of each promise.
function promises_allSettled(promiseArray as dynamic) as dynamic
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
                        context.state.results[context.index] = {
                            status: "resolved"
                            value: result
                        }
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
                promises_onCatch(promise, sub(error as dynamic, context as dynamic)
                    ' Do not process any promises that come in late
                    ' This can happen if any of the other promises reject
                    if not context.state.done then
                        ' Always assign the result to the origin index so results are in the same
                        ' order as the supplied promiseArray
                        context.state.results[context.index] = {
                            status: "rejected"
                            reason: error
                        }
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
            else
                ' The value in the promise array is not a promise.
                ' Immediately set the result.
                state.results[i] = {
                    status: "resolved"
                    value: promise
                }
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
            try
                throw "Did not supply an array"
            catch e
                promises_reject(e, deferred)
            end try
        end if
    end if
    return deferred
end function

' Takes an array of promises as input and returns a single Promise.
' This returned promise fulfills when any of the input's promises fulfills, with this first fulfillment value.
' It rejects when all of the input's promises reject (including when an empty array is passed), with an AggregateError containing an array of rejection reasons.
function promises_any(promiseArray as dynamic) as dynamic
    ' Create a deferred to be resolved later
    deferred = promises_create()
    if type(promiseArray) = "roArray" and not promiseArray.isEmpty() then
        ' Track the state and results of all the promises
        state = {
            deferred: deferred
            errors: []
            resolvedCount: 0
            total: promiseArray.count()
            done: false
        }
        for i = 0 to promiseArray.count() - 1
            promise = promiseArray[i]
            if promises_isPromise(promise) then
                if promise.promiseState = "resolved" then
                    ' Do not process any promises that come in after the first resolved one
                    if not state.done then
                        state.done = true
                        promises_resolve(promise.promiseResult, state.deferred)
                    end if
                else
                    ' Watch for both resolved or rejected promises
                    promises_onThen(promise, sub(result as dynamic, state as dynamic)
                        ' Do not process any promises that come in after the first resolved one
                        if not state.done then
                            state.done = true
                            promises_resolve(result, state.deferred)
                        end if
                    end sub, state)
                    promises_onCatch(promise, sub(error as dynamic, context as dynamic)
                        ' Do not process any promises that come in late
                        ' This can happen if any of the other promises reject
                        if not context.state.done then
                            ' Always assign the result to the origin index so results are in the same
                            ' order as the supplied promiseArray
                            context.state.errors[context.index] = error
                            context.state.resolvedCount++
                            if context.state.resolvedCount = context.state.total then
                                ' All the promises are resolved.
                                ' Resolve the deferred and make the state as complete
                                context.state.done = true
                                try
                                    throw {
                                        message: "All promises were rejected"
                                        errors: context.state.errors
                                    }
                                catch e
                                    promises_reject(e, context.state.deferred)
                                end try
                            end if
                        end if
                    end sub, {
                        state: state
                        index: i
                    })
                end if
            else
                ' The value in the promise array is not a promise.
                ' Immediately set the result.
                if not state.done then
                    state.done = true
                    promises_resolve(promise, state.deferred)
                end if
            end if
        end for
    else
        ' We can't resolve with a promise if there are no promises to resolve
        try
            throw {
                message: "All promises were rejected"
                errors: []
            }
        catch e
            promises_reject(e, deferred)
        end try
    end if
    return deferred
end function

' Takes an array of promises as input and returns a single Promise.
' This returned promise settles with the eventual state of the first promise that settles.
function promises_race(promiseArray as dynamic) as dynamic
    ' Create a deferred to be resolved later
    deferred = promises_create()
    if type(promiseArray) = "roArray" and not promiseArray.isEmpty() then
        ' Track the state and results of all the promises
        state = {
            deferred: deferred
            done: false
        }
        for i = 0 to promiseArray.count() - 1
            promise = promiseArray[i]
            if promises_isPromise(promise) then
                if promise.promiseState = "resolved" then
                    ' Do not process any promises that come in after the first resolved one
                    if not state.done then
                        state.done = true
                        promises_resolve(promise.promiseResult, state.deferred)
                    end if
                else if promise.promiseState = "rejected" then
                    ' Do not process any promises that come in after the first resolved one
                    if not state.done then
                        state.done = true
                        promises_reject(promise.promiseResult, state.deferred)
                    end if
                else
                    ' Watch for both resolved or rejected promises
                    promises_onThen(promise, sub(result as dynamic, state as dynamic)
                        ' Do not process any promises that come in after the first resolved one
                        if not state.done then
                            state.done = true
                            promises_resolve(result, state.deferred)
                        end if
                    end sub, state)
                    promises_onCatch(promise, sub(error as dynamic, state as dynamic)
                        ' Do not process any promises that come in after the first resolved one
                        if not state.done then
                            state.done = true
                            promises_reject(error, state.deferred)
                        end if
                    end sub, state)
                end if
            else
                ' The value in the promise array is not a promise.
                ' Immediately set the result.
                if not state.done then
                    state.done = true
                    promises_resolve(promise, state.deferred)
                end if
            end if
        end for
    else
        ' We can't resolve with a promise if there are no promises to resolve
        try
            throw {
                message: "All promises were rejected"
                errors: []
            }
        catch e
            promises_reject(e, deferred)
        end try
    end if
    return deferred
end function

function promises_resolve(result as dynamic, promise = invalid as dynamic) as object
    if not promises_isPromise(promise) then
        promise = promises_create()
    end if
    if not promises_isComplete(promise) then
        ' console.trace("[promises.resolve]", promise.id)
        if type(result) = "roAssociativeArray" then
            promise.removeField("promiseResult")
            promise.addFields({
                promiseResult: result
            })
        else
            promise.update({
                promiseResult: result
            }, true)
        end if
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
        if type(error) = "roAssociativeArray" then
            promise.removeField("promiseResult")
            promise.addFields({
                promiseResult: error
            })
        else
            promise.update({
                promiseResult: error
            }, true)
        end if
        promise.promiseState = "rejected"
    end if
    return promise
end function

function promises_isComplete(promise as object) as boolean
    if not promises_isPromise(promise) then
        return false
    end if
    state = promise.promiseState
    return state = "resolved" or state = "rejected"
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
        then: function(callback = promises_internal_defaultThenCallback as Function) as object
            m._lastPromise = promises_onThen(m._lastPromise, callback, m._context)
            return m
        end function
        "catch": function(callback = promises_internal_defaultCatchCallback as Function) as object
            m._lastPromise = promises_onCatch(m._lastPromise, callback, m._context)
            return m
        end function
        finally: function(callback = promises_internal_defaultFinallyCallback as Function) as object
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
    if promises_isPromise(value) then
        return value
    end if
    return promises_resolve(value)
end function


' Sets a global flag to enable or disable logging of crashes when calling callback functions
function promises_configuration_enableCrashLogging(enabled as boolean) as boolean
    globalNode = m.global
    if type(globalNode) = "roSGNode" then
        if enabled then
            globalNode.update({
                __promises__crashLoggingEnabled: enabled
            }, true)
        else
            globalNode.removeField("__promises__crashLoggingEnabled")
        end if
        return true
    end if
    return false
end function



' Clear storage for a given promise
sub promises_internal_clearPromiseStorage(promise as object)
    m.delete("__promises__" + promise.id)
end sub

function promises_internal_getLibPath() as string
    path = m.__promises__LibPath
    if type(path) = "String" then
        return path
    end if
    try
        throw "Generating path to the promises library"
    catch error
        path = error.backtrace.peek().filename
    end try
    m.__promises__LibPath = path
    return path
end function

' Get the storage for a promise on `m`
function promises_internal_getPromiseStorage(promise as object) as object
    id = "__promises__" + promise.id
    storage = m[id]
    if storage = invalid then
        ' unregister any observers on the promise to prevent multiple callbacks
        promises_internal_unobserveFieldScoped(promise, "promiseState")
        promises_internal_observeFieldScoped(promise, "promiseState", sub(event)
            'run the notification nexttick to prevent stackoverflow due to cascading promises all resolving in sequence
            promises_internal_delay(sub(context)
                promises_internal_notifyListeners(context.event)
            end sub, {
                event: event
            })
        end sub)
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
        ' Delete the storage for this promise since we are going to handled all of the current listeners.
        ' Any new listeners created as a result of the logic in the callbacks will
        ' register a new instance of the promise storage item. If a new storage item is created
        ' we will notify the new listeners when we are done with the current ones.
        promises_internal_clearPromiseStorage(originalPromise)
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
        if promises_internal_hasStorage(originalPromise) then
            ' There were listeners added as a result of some of the callback notifications
            ' Re-trigger the notification process for the new listeners
            promises_internal_delay(sub(event as object)
                promises_internal_notifyListeners(event)
            end sub, event)
        end if
    end if
end sub

' Used to check if there is a storage item of listeners for the supplied promise
function promises_internal_hasStorage(promise as dynamic) as boolean
    return m.doesExist("__promises__" + promise.id)
end function

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
    isThenOrCatch = promises_internal_isSet(promiseValue)
    'only call the callback if configured to do so
    if callCallback then
        try
            '.then and .catch take one or two parameters (`promiseValue` and optional `context`)
            if isThenOrCatch then
                if hasContext then
                    lineNumber = - 1
                    try
                        lineNumber = LINE_NUM + 1
                        callbackResult = callback(promiseValue, context)
                    catch error
                        file = error.backtrace.peek()
                        if error.number = 241 and file.filename = promises_internal_getLibPath() and file.line_number = lineNumber then
                            print "[promises.error]: " promises_internal_formatStackTrace(error, "Wrong number of parameters in promise callback. We have recovered, but this should be fixed as performance will suffer.")
                            callbackResult = callback(promiseValue)
                        else
                            promises_internal_logCrashIfEnabled(error)
                            callbackResult = promises_reject(error)
                        end if
                    end try
                else
                    callbackResult = callback(promiseValue)
                end if
                '.finally callback takes 1 optional parameter (`context`)
            else
                if hasContext then
                    lineNumber = - 1
                    try
                        lineNumber = LINE_NUM + 1
                        callbackResult = callback(context)
                    catch error
                        file = error.backtrace.peek()
                        if error.number = 241 and file.filename = promises_internal_getLibPath() and file.line_number = lineNumber then
                            print "[promises.error]: " promises_internal_formatStackTrace(error, "Wrong number of parameters in promise callback. We have recovered, but this should be fixed as performance will suffer.")
                            callbackResult = callback()
                        else
                            promises_internal_logCrashIfEnabled(error)
                            callbackResult = promises_reject(error)
                        end if
                    end try
                else
                    callbackResult = callback()
                end if
            end if
        catch e
            promises_internal_logCrashIfEnabled(e)
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
    if isThenOrCatch then
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
    else
        ' This is a .finally() block
        if promises_isPromise(callbackResult) then
            callbackPromise = callbackResult
            context = {
                newPromise: newPromise
                originalPromise: originalPromise
            }
            promises_onThen(callbackPromise, sub(result as dynamic, context as dynamic)
                if context.originalPromise.promiseState = "resolved" then
                    promises_resolve(context.originalPromise.promiseResult, context.newPromise)
                else
                    promises_reject(context.originalPromise.promiseResult, context.newPromise)
                end if
            end sub, context)
            promises_onCatch(callbackPromise, sub(error as dynamic, context as dynamic)
                promises_reject(error, context.newPromise)
            end sub, context)
        else
            if originalPromise.promiseState = "resolved" then
                promises_resolve(originalPromise.promiseResult, newPromise)
            else
                promises_reject(originalPromise.promiseResult, newPromise)
            end if
        end if
    end if
end sub

function promises_internal_defaultThenCallback(value = invalid, _ = invalid) as dynamic
    return value
end function

function promises_internal_defaultCatchCallback(value = invalid, _ = invalid) as dynamic
    return promises_reject(value)
end function

sub promises_internal_defaultFinallyCallback(_ = invalid)
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
            promises_internal_logCrashIfEnabled(e)
        end try
        m.delete(delayId)
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
end function

' Calls the supplied function with the supplied arguments
' @param {Function} callback - The function to be called
' @param {dynamic} args - The arguments to pass to the callback. Max 32 arguments.
' @return {dynamic} The result of the callback
function promises_internal_callWithArgs(callback as Function, args = invalid as dynamic) as dynamic
    if type(args) = "roArray" then
        argsCount = args.count()
        if argsCount < 16 then ' 0-15 args
            if argsCount < 8 then ' 0-7 args
                if argsCount < 4 then ' 0-3 args
                    if argsCount < 2 then ' 0-1 args
                        if argsCount = 0 then ' 0 args
                            result = callback()
                        else ' 1 arg
                            result = callback(args[0])
                        end if
                    else ' 2-3 args
                        if argsCount = 2 then ' 2 args
                            result = callback(args[0], args[1])
                        else ' 3 args
                            result = callback(args[0], args[1], args[2])
                        end if
                    end if
                else ' 4-7 args
                    if argsCount < 6 then
                        if argsCount = 4 then ' 4 args
                            result = callback(args[0], args[1], args[2], args[3])
                        else ' 5 args
                            result = callback(args[0], args[1], args[2], args[3], args[4])
                        end if
                    else ' 6-7 args
                        if argsCount = 6 then ' 6 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5])
                        else ' 7 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6])
                        end if
                    end if
                end if
            else ' 8-15 args
                if argsCount < 12 then ' 8-11 args
                    if argsCount < 10 then ' 8-9 args
                        if argsCount = 8 then ' 8 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
                        else ' 9 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])
                        end if
                    else ' 10-11 args
                        if argsCount = 10 then ' 10 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9])
                        else ' 11 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10])
                        end if
                    end if
                else ' 12-15 args
                    if argsCount < 14 then ' 12-13 args
                        if argsCount = 12 then ' 12 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11])
                        else ' 13 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12])
                        end if
                    else ' 14-15 args
                        if argsCount = 14 then ' 14 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13])
                        else ' 15 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14])
                        end if
                    end if
                end if
            end if
        else ' 16-32 args
            if argsCount < 24 then ' 16-23 args
                if argsCount < 20 then ' 16-19 args
                    if argsCount < 18 then ' 16-17 args
                        if argsCount = 16 then ' 16 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15])
                        else ' 17 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16])
                        end if
                    else ' 18-19 args
                        if argsCount = 18 then ' 18 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17])
                        else ' 19 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18])
                        end if
                    end if
                else ' 20-23 args
                    if argsCount < 22 then ' 20-21 args
                        if argsCount = 20 then ' 20 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19])
                        else ' 21 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20])
                        end if
                    else ' 22-23 args
                        if argsCount = 22 then ' 22 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21])
                        else ' 23 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22])
                        end if
                    end if
                end if
            else ' 24-32 args
                if argsCount < 28 then ' 24-27 args
                    if argsCount < 26 then ' 24-25 args
                        if argsCount = 24 then ' 24 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23])
                        else ' 25 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24])
                        end if
                    else ' 26-27 args
                        if argsCount = 26 then ' 26 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25])
                        else ' 27 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25], args[26])
                        end if
                    end if
                else ' 28-32 args
                    if argsCount < 30 then ' 28-29 args
                        if argsCount = 28 then ' 28 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25], args[26], args[27])
                        else ' 29 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25], args[26], args[27], args[28])
                        end if
                    else ' 30-32 args
                        if (argsCount = 30) then ' 30 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25], args[26], args[27], args[28], args[29])
                        else if argsCount = 31 then ' 31 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25], args[26], args[27], args[28], args[29], args[30])
                        else ' 32 args
                            result = callback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14], args[15], args[16], args[17], args[18], args[19], args[20], args[21], args[22], args[23], args[24], args[25], args[26], args[27], args[28], args[29], args[30], args[31])
                        end if
                    end if
                end if
            end if
        end if
    else
        result = callback()
    end if
    return result
end function


' Returns a string representation of the stack trace
' example:
'    Error: some error
'        $anon_6c() As Dynamic (pkg:/source/FailedAssertion.spec.brs:11)
'        $anon_303() As Dynamic (pkg:/source/rooibos/Test.brs:45)
'        $anon_1f2(test As Object) As Dynamic (pkg:/source/rooibos/BaseTestSuite.brs:243)
'        $anon_30a() As Dynamic (pkg:/source/rooibos/TestGroup.brs:88)
'        $anon_309() As Dynamic (pkg:/source/rooibos/TestGroup.brs:68)
'        $anon_1ec() As Dynamic (pkg:/source/rooibos/BaseTestSuite.brs:131)
'        $anon_1eb() As Dynamic (pkg:/source/rooibos/BaseTestSuite.brs:121)
'        $anon_325(testsuite As Dynamic) As Void (pkg:/source/rooibos/TestRunner.brs:191)
'        $anon_322() As Dynamic (pkg:/source/rooibos/TestRunner.brs:72)
'        rooibos_init(testscenename As Dynamic) As Void (pkg:/source/rooibos/Rooibos.brs:27)
'        main(args As Dynamic) As Dynamic (pkg:/source/Main.brs:2)
function promises_internal_formatStackTrace(error as dynamic, message as string) as string
    output = error.message + chr(10)
    indent = string(6, " ")
    for i = error.backTrace.count() - 1 to 0 step - 1
        e = error.backTrace[i]
        output += indent + e["function"] + " (" + e.filename.trim() + ":" + e.line_number.toStr() + ")" + chr(10)
    end for
    return output
end function

' Log the error if crash logging is enabled
sub promises_internal_logCrashIfEnabled(error as dynamic)
    ' Filter out user defined errors
    if error.number = 40 then
        return
    end if
    logCrashes = m.global?.__promises__crashLoggingEnabled
    if type(logCrashes) <> "roBoolean" then
        logCrashes = false
    end if
    if logCrashes then
        print "[promises.error]: " promises_internal_formatStackTrace(error, error.message)
    end if
end sub'//# sourceMappingURL=./promises.bs.map
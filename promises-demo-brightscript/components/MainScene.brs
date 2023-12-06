sub init()
    initOnScreenImage()
    m.top.observeFieldScoped("simpleResult", "onSimpleResultChange")
    m.top.observeFieldScoped("chainResult", "onChainResultChange")
    m.top.observeFieldScoped("parallelResult", "onParallelResultChange")

    'Uncomment the example below to run...
    ' networkCall("http://ip-api.com/json/")

    'Simple single request
    ' simpleExample("http://ip-api.com/json/")

    'Chain requests
    ' chainExample()

    'Parallel requests
    parallelExample()

    'Simple single request with error response
    ' simpleExample("http://invalid--url.com")
end sub

function networkRequest(url as string, method = "GET" as string, body = {} as object) as object
    promise = promises_create()
    task = createObject("roSGNode", "NetworkTask")
    task.url = url
    task.method = method
    task.body = body
    task.promise = promise
    task.control = "RUN"
    return promise
end function

sub simpleExample(url as string, method = "GET" as string)
    context = {
        result: invalid
    }

    promise = networkRequest(url, method)

    promises_onThen(promise, sub(response as object, context = {} as dynamic)
        if (response.error = invalid)
            context.result = "Your timezone is " + response.timezone
        else
            'See: https://developer.roku.com/en-gb/docs/references/brightscript/events/rourlevent.md#getresponsecode-as-integer
            print "Got a network error response!!!", response.responseCode
        end if

        m.top.simpleResult = context

    end sub, context)

    promises_onCatch(promise, sub(response as object, context = {} as dynamic)
        print "Caught a Simple promise error!!!", response
    end sub, context)

    promises_onFinally(promise, sub(response as object, context = {} as dynamic)
        print "Simple promise completed!!!"
    end sub, context)
end sub

sub chainExample()
    context = {
        result: invalid
    }

    promise = networkRequest("http://ip-api.com/json/")

    promises_chain(promise, context).then(function(response, context)
        if (response.error = invalid)
            return getTimeApiTimeToFiji(response.timezone)
        end if

    end function).then(function(response, context)
        if (response.error = invalid)
            context.result = getChainResultString(response)
        end if

        m.top.chainResult = context

    end function).catch(function(error, context)
        print "Caught an error with the chain promise!!!", error

    end function).finally(function(error, context)
        print "Chain promise completed!!!", error
    end function)
end sub

sub parallelExample()
    promises = promises_all([
        getIpApiTimeZoneByDomain("google.com")
        getIpApiTimeZoneByDomain("netflix.com")
        getIpApiTimeZoneByDomain("chatgpt.com")
    ])
    promises_chain(promises).then(function(results)
        m.top.parallelResult = {
            result: [
                "Google.com's timezone is " + results[0].timezone,
                "Netflix.com's timezone is " + results[1].timezone,
                "ChatGPT.com's timezone is " + results[2].timezone
            ]
        }

    end function).catch(function(error)
        print "Caught an error with the parallel promise!!!", error

    end function)
end sub

'****************************************************************
'#region *** CALLBACKS
'****************************************************************

sub onSimpleResultChange(event as object)
    print "onSimpleResultChange:"
    print event.getData().result
end sub

sub onChainResultChange(event as object)
    print event.getData().result
end sub

sub onParallelResultChange(event as object)
    for each resultStr in event.getData().result
        print resultStr
    end for
end sub

'****************************************************************
'#endregion *** CALLBACKS
'****************************************************************

'****************************************************************
'#region *** HELPER FUNCTIONS
'****************************************************************

function getIpApiTimeZoneByDomain(domain as string) as object
    url = "http://ip-api.com/json/" + domain
    return networkRequest(url)
end function

function getTimeApiTimeToFiji(fromTimeZone as object) as object
    print "Your timezone is " + fromTimeZone
    url = "https://timeapi.io/api/Conversion/ConvertTimeZone"
    method = "POST"
    date = CreateObject("roDateTime")

    body = {
        "fromTimeZone": fromTimeZone
        "dateTime": getFullDate() + " 00:00:00"
        "toTimeZone": "Pacific/Fiji"
        "dstAmbiguity": ""
    }
    return networkRequest(url, method, body)
end function

function getFullDate() as string
    date = CreateObject("roDateTime")
    fullDate = date.getYear().toStr() + "-"

    if date.getMonth() < 10
        fullDate += "0"
    end if
    fullDate += date.getMonth().toStr() + "-"

    if date.getDayOfMonth() < 10
        fullDate += "0"
    end if
    fullDate += date.getDayOfMonth().toStr()

    return fullDate
end function

function getChainResultString(data as object) as object
    currentDay = 25
    fijiDay = data.conversionResult.day
    fijiHour = data.conversionResult.hour
    aheadOrBehind = "ahead"
    if (fijiDay > currentDay) then aheadOrBehind = "behind"
    return "Fiji is " + fijiHour.toStr() + " hours " + aheadOrBehind + " of your timezone!"
end function

sub initOnscreenImage()
    'Setting the image size based on the Roku device UI resolution
    resolutionName = LCase(createObject("roDeviceInfo").getUIResolution().name)
    backgroundImage = m.top.findNode("backgroundImage")
    backgroundImage.uri = backgroundImage.uri.replace("{size}", resolutionName)
end sub

'****************************************************************
'#endregion *** HELPER FUNCTIONS
'****************************************************************
sub init()
    m.port = CreateObject("roMessagePort")
    m.REQUEST_TIMEOUT = 5
    m.top.functionName = "makeRequest"
end sub

sub makeRequest()
    try
        result = getNetworkResult(m.top.url, m.top.method, m.top.body)
        data = ParseJson(result.data)
        promises_resolve(data, m.top.promise)
    catch e
        promises_reject(e, m.top.promise)
    end try
end sub

function getNetworkResult(url as string, method as string, body as object) as object
    urlTransfer = CreateObject("roUrlTransfer")
    urlTransfer.setUrl(url)
    urlTransfer.setRequest(method)
    urlTransfer.setCertificatesFile("common:/certs/ca-bundle.crt")
    urlTransfer.initClientCertificates()
    urlTransfer.setMessagePort(m.port)
    urlTransfer.setPort(m.port)
    urlTransfer.setMinimumTransferRate(1, m.REQUEST_TIMEOUT)
    if (method = "GET")
        urlTransfer.asyncGetToString()
    else
        urlTransfer.addHeader("Accept", "application/json")
        urlTransfer.addHeader("Content-Type", "application/json")
        body = FormatJSON(body)
        urlTransfer.asyncPostFromString(body)
    end if

    msg = wait(0, m.port)
    if type(msg) = "roUrlEvent"

        responseCode = msg.getResponseCode()
        responseString = msg.getString()

        if responseCode = 200
            return {
                data: responseString
            }
        else
            return {
                error: true
                responseCode: responseCode
                data: responseString
            }
        end if
    end if
end function

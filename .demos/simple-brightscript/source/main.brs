sub Main(args as object)
    screen = createObject("roSGScreen")
    m.port = createObject("roMessagePort")
    screen.setMessagePort(m.port)
    screen.createScene("MainScene")
    screen.show()

    while(true)
        msg = wait(0, m.port)
        msgType = type(msg)
        if (msgType = "roSGScreenEvent")
            if msg.isScreenClosed() then return
        end if
    end while
end sub

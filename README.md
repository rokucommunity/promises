# Promises

A Promise-like implementation for BrightScript/Roku. This is the core functionality for BrighterScript's async/await functionality. Not to be confused with [roku-promises](https://github.com/rokucommunity/roku-promises).

[![build status](https://img.shields.io/github/actions/workflow/status/rokucommunity/promises/build.yml?branch=master&logo=github)](https://github.com/rokucommunity/promises/actions?query=branch%3Amaster+workflow%3Abuild)
[![coverage status](https://img.shields.io/coveralls/github/rokucommunity/promises?logo=coveralls)](https://coveralls.io/github/rokucommunity/promises?branch=master)
[![monthly downloads](https://img.shields.io/npm/dm/@rokucommunity/promises.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/@rokucommunity/promises?minimal=true)
[![npm version](https://img.shields.io/npm/v/@rokucommunity/promises.svg?logo=npm)](https://www.npmjs.com/package/@rokucommunity/promises)
[![license](https://img.shields.io/github/license/rokucommunity/promises.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)

> [!CAUTION]
> The behavior of `.finally()` and `.onFinally()` has changed as of `v0.6.0`. When upgrading from prior versions please be aware that `finally` will no longer suppress rejections in your promise flows. See [#3254](https://github.com/fubotv/rokukor/pull/3254) for details on the fix.

## Installation
### ropm
The preferred installation method is via [ropm](https://www.npmjs.com/package/ropm)
```bash
npx ropm install promises@npm:@rokucommunity/promises
```

**NOTE:** if your project lives in a subdirectory, make sure you've configured your ropm `rootDir` folder properly. ([instructions](https://github.com/rokucommunity/ropm#rootdir))

### Manual install
1. Download the latest `promises.zip` release from [releases](https://github.com/rokucommunity/promises/releases) and extract the zip.
2. Copy the files into your `pkg:/source` and `pkg:/components` folders. Your project structure should look something like this if you've done it correctly:

    ```graphql
    pkg:/
    ├─ components/
    | ├─ Promise.xml <-- new file
    │ └─ MainScene.xml
    ├─ source/
    | ├─ Promises.bs <-- new file
    │ └─ main.brs
    └─ manifest
    ```

## Demos
You can check out a few demos in the [demos/](./demos) folder to see some good examples of how to use this library in practice.

## Anatomy of the `Promise` node
The heart of this library is the `Promise` SGNode type. Here's its contents:

```xml
<component name="Promise" extends="Node">
    <interface>
        <field id="promiseState" type="string" value="pending" alwaysNotify="true" />
    </interface>
</component>
```

`promiseState` represents the current status of the promise. Promises can have one of three states:
- `"resolved"` - the operation this promise represents has completed successfully. Often times a resolved promise will contain data.
- `"rejected"` - the asynchronous operation this promise represents has completed unsuccessfully. Often times this promise will include an error explaining what caused the rejection.
- `"pending"` - the promise has not yet been completed (i.e. the promise is _not_ resolved and _not_ rejected).

`promiseResult` is the "value" of the promise when resolved, or an [error](https://developer.roku.com/docs/references/brightscript/language/error-handling.md#the-exception-object) when rejected.

You'll notice there is no `<field id="promiseResult">` defined on the `Promise` node above. That's because, in order to support all possible return types, we cannot define the `promiseResult` field ahead of time because the BrightScript runtime will throw type mismatch errors when using a different field type than defined. The internal promise logic will automatically add the field when the promise is resolved or rejected.

If you're creating promises without using this library, you can resolve or reject a promise with the following logic. Be sure to set `promiseState` last to ensure that `promiseResult` is avaiable when the observers of `promiseState` are notified.

```brightscript
sub setPromiseResolved(promise, result)
    promise.update({ promiseResult: result }, true)
    promise.promiseState = "resolved"
end sub

sub setPromiseRejected(promise, error)
    promise.update({ promiseResult: error }, true)
    promise.promiseState = "rejected"
end sub
```
### Similarities to JavaScript promises

Much of this design is based on JavaScript [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). However, there are some differences.

1. BrightScript does not have closures, so we couldn't implement the standard `then` function on the `Promise` SGNode because it would strip out the callback function and lose all context.
2. Our promises are also [deferred](https://dev.to/webduvet/deferred-promise-pattern-2j59) objects. Due to the nature of scenegraph nodes, we have no way of separating the promise instance from its resolution. In practice this isn't a big deal, but just keep in mind, there's no way to prevent a consumer of your promise instance from resolving it themselves, even though they shouldn't do that.

### Cross-library compatibility
This design has been written up as a specification. That meaning, it shouldn't matter which library creates the promise. Your own application code could write custom logic to make your own promises, and they should be interoperable with any other. The core way that promises are interoperable is that they have a field called `promiseState` for checking its state, and then getting the result from `promiseResult`.

## Differences from [roku-promise](https://github.com/rokucommunity/roku-promise)
[roku-promise](https://github.com/rokucommunity/roku-promise) is a popular promise-like library that was created by [@briandunnington](https://github.com/briandunnington) back in 2018. roku-promise creates tasks for you, executes the work, then returns some type of response to your code in the form of a callback.

The big difference is, @rokucommunity/promises does not manage tasks at all. The puropose of a promise is to create an object that represents the future completion of an asynchronous operation. It's not supposed to initiate or execute that operation, just represent its status.

So by using @rokucommunity/promises, you'll need to create `Task` nodes yourself, create the promises yourself (using our helper library), then mark the promise as "completed" when the task has finished its work.

## Usage
Typically you'll be creating promises from inside [Task](https://developer.roku.com/docs/references/scenegraph/control-nodes/task.md) nodes. Then, you'll return those promises immediately, but keep them around for when you are finished with the async task.

Here's a small example
To create a promise:
```brighterscript
promise = promises.create()
```

### No closures (but close enough)
The BrightScript runtime has no support for closures. However, we've found a creative way to pass state throughout an async flow to emulate most of the benefits of closures. Most of the `promises` observer functions accept an optional parameter, called `context`. This is an AA that is passed into every callback function. Here's the signature of `promises.onThen()`:

```brighterscript
function onThen(promise as dynamic, callback as function, context = "__INVALID__" as object) as dynamic
```

Consider this example:

```brighterscript
function logIn()
    context = {
        username: getUsernameFromRegistry(),
        authToken: invalid
    }
    ' assume this function returns a promise
    promise = getAuthTokenFromServer()
    promises.onThen(promise, function(response, context)
        context.authToken = response.authToken
        print context.username, context.authToken
    end function, context)
end function
```

Notice how the context is made avaiable inside your callback? Under the hood, we store the promise, the callback, and context all in a secret `m` variable, so they never pass through any node boundaries. That means you can store literally any variable you want on there, without worrying about the data getting stripped away by SceneGraph's data sanitization process. (don't worry, we clean all that stuff up when the promise resolves so there's no memory leaks)

### Chaining
Building on the previous example, there are situations where you may want to run several async operations in a row, waiting for each to complete before moving on to the next. That's where `promises.chain()` comes in. It handles chaining multiple async operations, and handling errors in the flow as well.

Here's the flow, written out in words:

- (async) fetch the username from the registry
- (async) fetch an auth token from the server using the username
- (async) fetch the user's profileImageUrl using the authToken
- we have all the user data. set it on scene and move on
- if anything fails in this flow, print an error message

 Here's an example of how you can do that:

```brighterscript
function logIn()
    context = {
        username: invalid,
        authToken: invalid,
        profileImageUrl: invalid
    }
    ' assume this function returns a promise
    usernamePromise = getUsernameFromRegistryAsync()
    promises.chain(usernamePromise, context).then(function(response, context)
        context.username = response.username
        'return a promise that forces the next callback to wait for it
        return getAuthToken(context.username)

    end function).then(function(response, context)
        context.authToken = response.authToken
        return getProfileImageUrl(context.authToken)

    end function).then(function(response, context)
        context.profileImageUrl = response.profileImageUrl

        'yay, we signed in. Set the user data on our scene so we can start watching stuff!
        m.top.userData = context

        'this catch function is called if any runtime exception or promise rejection happened during the async flows above
    end function).catch(function(error, context)
        print "Something went wrong logging the user in", error, context
    end function)
end function
```
### Parallel promises
Sometimes you want to run multiple network requests at the same time. You can use `promises.all()` for that. Here's a quick example

```brighterscript
function loadProfilePage(authToken as string)
    promise = promises.all([
        getProfileImageUrl(authToken),
        getUserData(authToken),
        getUpgradeOptions(authToken)
    ])
    promises.chain(promise).then(function(results)
        print results[0] ' profileImageUrl result
        print results[1] ' userData result
        print results[2] ' upgradeOptions result
    end function)
end function

```

## How it works
While the promise spec is interoperable with any other promise node created by other libraries, the `promises` namespace is the true magic of the @rokucommunity/promises library. We have several helper functions that enable you to chain multiple promises together, very much in the same way as javascript promises.


## Limitations
### no support for roMessagePort
Promises do not currently work with [message ports](https://developer.roku.com/docs/references/brightscript/components/romessageport.md). So this means you'll only be able to _observe_ promises and get callbacks from the render thread. In practice, this probably isn't much of a limitation, but still something to keep in mind.

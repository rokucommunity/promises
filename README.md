# Promises

A Promise-like implementation for BrightScript/Roku. This is the core functionality for BrighterScript's async/await functionality. Not to be confused with [roku-promises](https://github.com/rokucommunity/roku-promises).

[![build status](https://img.shields.io/github/actions/workflow/status/rokucommunity/promises/build.yml?branch=master&logo=github)](https://github.com/rokucommunity/promises/actions?query=branch%3Amaster+workflow%3Abuild)
[![coverage status](https://img.shields.io/coveralls/github/rokucommunity/promises?logo=coveralls)](https://coveralls.io/github/rokucommunity/promises?branch=master)
[![monthly downloads](https://img.shields.io/npm/dm/@rokucommunity/promises.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/@rokucommunity/promises?minimal=true)
[![npm version](https://img.shields.io/npm/v/@rokucommunity/promises.svg?logo=npm)](https://www.npmjs.com/package/@rokucommunity/promises)
[![license](https://img.shields.io/github/license/rokucommunity/promises.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)

## Installation
### ropm
The preferred installation method is via [ropm](https://www.npmjs.com/package/ropm);
```bash
ropm install @rokucommunity/promises
```
### Manual install
1. Download the latest release from [releases](https://github.com/rokucommunity/promises/releases) and extract the zip.
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

## The `Promise` node
The heart of this library is the `Promise` SGNode type. Here's its contents:

```xml
<component name="Promise" extends="Node">
    <interface>
        <field id="promiseState" type="string" value="pending" alwaysNotify="true" />
    </interface>
</component>
```

`promiseState` represents the current status of the promise. Promises can have one of three states: 
- `"pending"` - the promise has not yet been completed (i.e. resolved or rejected). 
- `"resolved"` - the operation this promise represents has completed successfully. Often times a resolved promise will contain data.
- `"rejected"` - the asynchronous operation this promise represents has completed unsuccessfully. Often times this promise will include an error explaining what caused the rejection.

`promiseResult` is the "value" of the promise when resolved, or an [error](https://developer.roku.com/docs/references/brightscript/language/error-handling.md#the-exception-object) when rejected. 

You'll notice there is no `<field id="promiseResult">` defined on the `Promise` node above. That's because, in order to support all possible return types, we cannot define the `promiseResult` field ahead of time otherwise the BrightScript runtime will throw type mismatch errors when using a different field type than defined. The internal promise logic will automatically add the field when the promise is resolved or rejected. 

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
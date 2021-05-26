


# monday.com Apps framework SDK for JavaScript
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mondaycom/monday-sdk-js/blob/master/LICENSE) &nbsp; [![npm version](https://img.shields.io/npm/v/monday-sdk-js.svg?style=flat)](https://www.npmjs.com/package/monday-sdk-js) &nbsp; [![npm](https://img.shields.io/npm/dm/monday-sdk-js)](https://www.npmjs.com/package/monday-sdk-js) &nbsp; [![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/monday-sdk-js)](https://www.jsdelivr.com/package/npm/monday-sdk-js)


The monday.com SDK provides a toolset for application developers to build features and solutions on top of the monday.com Work OS platform. You'll find this SDK useful if you want to:

- Access monday.com account data from your application, by utilizing the GraphQL client
- Build Board Views & Dashboard Widgets that extend the monday.com UI
- Build Integrations & Automations using your own external services and business logic

The SDK contains methods for server-side and client-side application development. Client-side capabilities assume a valid user session is present (and can seamlessly act on behalf of that user), while server-side methods can be used to access monday.com features using explicit credentials but without any client-side code.

## Table of contents
- [Usage](#usage)
- [Seamless authentication](#seamless-authentication)
- [SDK capabilities](#sdk-capabilities)
  - [`monday.api`](#mondayapiquery-options--)
  - [`monday.get`](#mondaygettype-params--)
  - [`monday.listen`](#mondaylistentypeortypes-callback-params--)
  - [`monday.execute`](#mondayexecutetype-params)
  - [`monday.oauth`](#mondayoauthoptions--)
  - [`monday.storage`](#mondaystorage)
- [Storage API](#storage-api-mondaystorage)

## Usage

### Using as an `npm` module
Install the SDK as a module:

`npm install monday-sdk-js --save`

Then import into your project:
```js
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
```


### As a `<script>` tag directly in your HTML code
You can also load the SDK directly into your HTML code by adding:
```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/monday-sdk-js/dist/main.js"></script>
</head>
```
and then initialize the SDK anywhere in the page by declaring:

```js
const monday = window.mondaySdk()
```

## Seamless authentication
When used for client-side development, SDK methods that require to act on behalf of the connected user will work out-of-the-box by communicating with the parent monday.com running application. You're not required to initialize the SDK client with any explicit credentials.

Methods that use seamless authentication (including `monday.api` and `monday.storage`) offer capabilities that are scoped based on the permissions of the logged in user and the scopes you have configured in your app.

## SDK capabilities

The SDK exposes the following capabilities:

| SDK Object | Capability |
|--|--|
| `monday.api` | Performing queries against the monday.com API on behalf of the connected user |
| `monday.listen` | Listen to client-side events on the monday.com client running this app |
| `monday.get` | Retrieve information from the monday.com client running this app |
| `monday.execute` | Call an action on the monday.com client running this app |
| `monday.storage` | Read/write to the Storage API, a key-value storage service for apps |
| `monday.oauth` | Redirecting the client to the OAuth authorization server, with your client ID included |

<br/>

### **`monday.api(query, options = {})`**
Used for querying the monday.com GraphQL API seamlessly on behalf of the connected user, or using a provided API token. 

**Parameters:**

- `query`: A [GraphQL](https://graphql.org/) query, can be either a *query* (retrieval operation) or a *mutation* (creation/update/deletion operation). Placeholders may be used, which will be substituted by the `variables` object passed within the options.
- `options`:

| Option | Description| Required       | Default                                                                                        |
| --------- | ----------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `token`     | Access token for the API | Only on server | If not set, will use the credentials of the current user (client only) |
| `variables` | An object containing GraphQL query variables                  | No             |        |

Instead of passing the API token to the `api()` method on each request, you can set the API token once using:
```js
monday.setToken('mytoken')
```

**Returns:**

A `Promise` that will be `resolved` to the API response.
<br>If there was an unhandled GraphQL error in the API, a `Promise` will be `rejected` with an Error.
In case of handled errors from GraphQL API (response with the 200 status), a `Promise` will be `resolved` with the API response.
<br>You can check the list of GraphQL API errors [here](https://monday.com/developers/v2#errors-section).


**Examples:**

A **client-side** query that fetch the ID and name of all the users within the account that the connected user is allowed to view:
```javascript
monday.api(`query { users { id, name } }`).then(res => {
  console.log(res);
  /* { data: { users: [{id: 12312, name: "Bart Simpson"}, {id: 423423, name: "Homer Simpson"}] } } */
});
```
A **server-side** query that fetches all the names of users in the account:
```js
monday.setToken('ac5eb492f8c...');
monday.api('query { users { name } }').then(res => {...})
```

A mutation that sends an in-app notification to user `user_id`, which upon clicking will take the user to item `item_id`:
```javascript
monday.api(`
  mutation {
    create_notification(
      text: "I've got a notification for you!",
      user_id: ${user_id},
      target_id: ${item_id},
      target_type: Project,
      internal: true
    ) { 
      id 
    }
  }
`);
```

For more information about the GraphQL API and all queries and mutations possible, read the [API Documentation](https://monday.com/developers/v2)

<br/>

### **`monday.get(type, params = {})`**

Used for retrieving data from the parent monday.com application where your app is currently running. This object can only be used  when your app is running inside an `iframe`. This can only be used in client-side apps.


**Parameters:**

- `type`: The type of requested information (available values below)
- `params`: Reserved for future use

The available types that can be requested are:
| Type | Description |
|--|--|
| `'context'` | Information about where this app is currently displayed, depending on the type of feature |
| `'settings'` | The application settings as configured by the user that installed the app |
| `'itemIds'` | The list of item IDs that are filtered in the current board (or all items if no filters are applied) |
| `'sessionToken'` | A JWT token which is decoded with your app's secret and can be used as a session token between your app's frontend & backend |

**Returns:** 

A `Promise` that will be resolved with the requested data.

**Examples:**

Requesting context and settings data:
```js
monday.get("settings").then(res => ...);
monday.get("context").then(res => ...);
```

Example context objects that return for a board view and a dashboard widget:
```js
// Board view context
{
  "boardViewId": 19324,
  "boardId": 3423243,
  "mode": "fullScreen", // or "split"
  "theme": "light"  // or "dark"
}

// Dashboard widget context
{
  "widgetId": 54236,
  "boardIds": [3423243, 943728],
  "theme": "light"  // or "dark"
}
```

Requesting the list of items currently in view in the board:

```js
monday.get("itemIds").then(res => console.log(res));
// => [234234, 4564, 234234, 67675, 576567]
```
<br/>

### **`monday.listen(typeOrTypes, callback, params = {})`**

Creates a listener which allows subscribing to certain types of client-side events.

**Parameters:**

- `typeOrTypes`: The type, or array of types, of events to subscribe to
- `callback`: A callback function that is fired when the listener is triggered by a client-side event
- `params`: Reserved for future use

You can subscribe to the following types of events:
| Type | Description |
|--|--|
| `'context'` | Fired when one of the parameters in the context changes |
| `'settings'` | Fired when a setting value is changed by the user |
| `'itemIds'` | Fired when the board filter changes, which impacts the list of items currently in view |
| `'events'` | Fired when an interaction takes place with the board/dashboard |

**Returns:**

This method does not have a return value.

**Examples:**

Subscribe to changes in settings and context:
```js
const callback = res => console.log(res);
monday.listen(['settings', 'context'], callback);
```

Subscribe to interaction-based events on the board:
```js
const callback = res => console.log(res);
const unsubscribe = monday.listen("events", callback);

// When an item/s are created on the board:
// => { type: "new_items", itemIds: [5543, 5544, 5545], boardId: 3425 }

// When a column value changes for one of the items:
// => { type: "change_column_value", itemId: 12342, value: {...} }
```
<br/>

### **`monday.execute(type, params)`**
Invokes an action on the parent monday client.

**Parameters:**

- `type`: Which action to perform
- `params`: Optional parameters for the action

**Returns:**

A `Promise` that will optionally  be resolved to the return value from the action executed


**Action types:**

#### Open item card
Opens a modal with information from the selected item

**type**
`'openItemCard'`

**params**

| Parameter|Type | Description | Required | Default Value |
| --- | --- | --- | --- | --- |
| itemId| Integer | The ID of the item to open | Yes | |
|kind | String | On which view to open the item card. <br>Can be "updates" / "columns" | No |"columns" |

**Example**
```javascript
monday.execute('openItemCard', { itemId: item.id });
```

#### Confirmation dialog
Opens a confirmation dialog to the user
**type**
`'confirm'`

**params**

| Parameter|Type | Description | Required | Default Value |
| --- |---|--- | --- | --- |
| message|String | The message to display in the dialog| Yes | |
|confirmButton|String| The text for the confirmation button | No |"OK" |
|cancelButton|String| The text for the cancel button | No |"Cancel" |
|excludeCancelButton|Boolean| Either to exclude the cancel button | No |false|

**Example**
```js
monday.execute("confirm", {
   message: "Are you sure?", 
   confirmButton: "Let's go!", 
   cancelButton: "No way", 
   excludeCancelButton: false
}).then((res) => {
    console.log(res.data);
    // {"confirm": true}
});
```

#### Notice message 
Display a message at the top of the user's page. Usefull for success, error & general messages.

**type**
`'notice'`

**params**

| Parameter|Type | Description | Required | Default Value |
| --- |---|--- | --- | --- |
| message|String | The message to display| Yes | |
|type|String| The type of message to display . Can be "success" (green), "error" (red) or "info" (blue) | No |"info" |
|timeout|Integer| The number of milliseconds to show the message until it closes | No | 5000 |

**Example**
```js
monday.execute("notice", { 
   message: "I'm a success message",
   type: "success", // or "error" (red), or "info" (blue)
   timeout: 10000,
});
```

#### Open files preview dialog
Opens a modal with the preview of an asset

**type**
`'openFilesDialog'`

**params**

| Parameter|Type | Description | Required | Default Value |
| --- | --- | --- | --- | --- |
| boardId| Integer | The ID of the board | Yes | |
| itemId| Integer | The ID of the item, which contains an asset | Yes | |
| columnId| String | The ID of the column, which contains an asset | Yes | |
| assetId| Integer | The ID of the asset to open | Yes | |

**Example**
```javascript
monday.execute('openFilesDialog', {
  boardId: 12345,
  itemId: 23456,
  columnId: 'files',
  assetId: 34567
})
```


#### Trigger file upload process
Opens a modal to let the current user upload a file to a specific file column. 

Returns a promise. In case of error, the promise is rejected

After the file is successfully uploaded, the "change_column_value" event will be triggered. 
See the [`monday.listen`](#mondaylistentypeortypes-callback-params--)('events', callback) method to subscribe to these events.

*Requires boards:write scope*

**type**
`'triggerFilesUpload'`

**params**

| Parameter|Type | Description | Required | Default Value |
| --- | --- | --- | --- | --- |
| boardId| Integer | The ID of the board | Yes | |
| itemId| Integer | The ID of the item, which contains an asset | Yes | |
| columnId| String | The ID of the file column, where file should be uploaded | Yes | |

**Example**
```javascript
monday.execute('triggerFilesUpload', {
  boardId: 12345,
  itemId: 23456,
  columnId: 'files'
})
```

### **`monday.oauth(options = {})`**
Performs a client-side redirection of the user to the monday OAuth screen with your client ID embedded in the URL, in order to get their approval to generate a temporary OAuth token based on your requested permission scopes.

**Parameters:**

- `options`: An object with options as specified below

| Option | Required |Description |
|--|--|--|
| `clientId` | No, defaults to your client ID | The OAuth client ID of the requesting application |
| `mondayOauthUrl`| No | The URL of the monday OAuth endpoint |

**Returns:**

This method does not have a return value.

<br/>

### **`monday.storage`**
Provides access to the Storage API. See below for methods and explanation.

<br/>


## Storage API (`monday.storage`)
> The Storage API is in early beta stages, its API is likely to change

The monday apps infrastructure includes a persistent, key-value database storage that developers can leverage to store data without having to create their own backend and maintain their own database.

The database currently offers instance-level storage only, meaning that each application instance (i.e. a single board view or a dashboard widget) maintains its own storage. Apps cannot share storage across accounts or even across apps installed in the same location.

**Available methods:**

- `monday.storage.instance.getItem(key)` - Returns a stored value from the database under `key`
- `monday.storage.instance.setItem(key, value)` - Stores `value` under `key` in the database
<!-- - `monday.storage.instance.deleteItem(key)` - Deletes the value under `key` -->


**Returns:**

All methods return a `Promise` which will be resolved to the Storage API's response

**Versioning:**

You may face cases where multiple monday.com users will be working on the same app instance and writing to the same key in an unsynchronized fashion. If you're storing a compound data structure (like JSON) in that key, such operations may overwrite each other.

The `getItem()` and `setItem()` each return a *version identifier* which can be used to identify which value is currently stored in a key. Whenever a write that changes the value occurs, the version identifier in the database changes. This allows you to identify whether a value was already changed from another location and prevent that from being overwritten.

Example of using versioning:
```js
monday.storage.instance.getItem('serialKey').then(res => {
  const { value, version } = res.data;
  sleep(10000); // someone may overwrite serialKey during this time

  monday.storage.instance.setItem('serialKey', { previous_version: version }).then(res => {
    console.log(res);
  }
});
// => '{ "success": false, "reason": "version_conflict" }'
```

**Examples:**

Store a value in the database:
```js
monday.storage.instance.setItem('mykey', 'Lorem Ipsum').then(res => {
  console.log(res);
});
// => { "success": true }
```

Retrieve a previously stored value in the database:
```js
monday.storage.instance.getItem('mykey').then(res => {
   console.log(res.data.value);
});
// => 'Lorem Ipsum'
```

<!--
Delete a previously stored key in the database:
```js
monday.storage.instance.deleteItem('mykey').then(res => {
   console.log(res);
}
// => { "success": true }
```
-->

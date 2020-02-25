# monday.com App Marketplace SDK for Node.js and JavaScript

The monday SDK is a set of packages that allow your to talk with the monday API's and build apps on top of the monday work OS. You'll find this SDK useful if you want to:

- **Make API calls to monday:**
  a monday API v2 (graphql) client

- **Build Board Views & Dashboard Widgets:**
  The monday SDK client module will allow you to communicate with the monday OS while building client side features in your app
- **Build Integrations & Automations :**
  A set of utils that will make your life easier while building custom integrations to monday

## Installation

- **Using as an NPM package:**
  `npm i monday-sdk --save`
  `yarn add monday-sdk`

- **Using `<script>` tag from a CDN:**  
  `<script src="https://unpkg.com/monday-sdk@1.0.11/dist/main.js"></script>`

## API Calls

Use then `monday.api()` method both in the server and in the client in order to create api calls to the monday GraphQL API (v2). In the server you'll have to provide it with an access token to the API, and in the client you'll enjoy seamless authentication and you'll be able to create requests to the API in the name of the logged in user without providing a token.

### **api(query, options = {})**

Allow you to query monday Graphql API (v2). The first argument is a graphql query.

In case you need to pass variables to your query, you can pass an object instead of a string as the first param. This object needs to contain `query` and `variables` attributes.

Returns a promise that will be resolved with the API response on success.

#### **Queries**

```javascript
monday.api(`query { users { id, name } }`).then(res => {
  console.log(res);
  /* { data: { users: [{id: 12312, name: "Bart Simpson"}, {id: 423423, name: "Homer Simpson"}] } } */
});
```

#### **Mutations**

```javascript
monday.api(`
  mutation {
    create_notification(
      text: "Poke",
      user_id: ${user.id},
      target_id: ${item.id},
      target_type: Project,
      internal: true
    ) { 
      id 
    }
  }
`);
```

#### **Options**

| Option    | Description                                                 | Required       | Default                                                                                        |
| --------- | ----------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| token     | An access token to the monday API, granted by a monday user | Only on server | If not set, will make the call in the name of the logged in user (only on client side feature) |
| variables | An object contains GraphQL query variables                  | No             | -                                                                                              |

## OAuth

### **getToken(code, clientId, clientSecret)**

## Client Side SDK

```javascript
import monday from "monday-sdk";
```

### **get(type, params = {})**

Get data from the monday app client. Can be used only while working as an app feature inside an iframe.

Returns a promise that will be resolved with the data.

- #### settings

```javascript
monday.get("settings").then(res => console.log(res));
```

```javascript
{
  fieldName: fieldValue;
}
```

- #### context

```javascript
monday.get("context").then(res => console.log(res));
```

```javascript

// Board Views

{

boardId: 3423243,

boardViewId: 19324,

mode  "fullScreen", // or "split"

theme  "light"  // or "dark"

}



// Dashboard Widgets

{

boardIds: [3423243, 943728],

widgetId: 54236,

theme  "light"  // or "dark"

}

```

### **listen(type, callback)**

Subscribe to get notified on certain events.

- #### settings

Will call your callback with the updated settings when it changes

```javascript
const callback = res => console.log(res);

const unsubscribe = monday.listen("settings", callback);
```

- #### context

Will call your callback with the updated context when it changes

```javascript
const callback = res => console.log(res);

const unsubscribe = monday.listen("context", callback);
```

- #### events

Will call your callback with events occured in your board/s.

```javascript
const callback = res => console.log(res);

const unsubscribe = monday.listen("events", callback);

// Some item has been create in your board/s:

// { type: "new_items", itemIds: [5543, 5544, 5545], boardId: 3425 }

// Some column value has been changes:

// { type: "change_column_value", itemId: 12342, value: {...} }
```

### **execute(type, params)**

Call for action on the monday app

- #### openItemCard

Open a popup with all item info

```javascript
monday.execute("openItemCard", { itemId: item.id });
```

### License

monday.com sdk is [MIT licensed](./LICENSE).

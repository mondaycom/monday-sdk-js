# monday.com App Marketplace SDK for Node.js and JavaScript

> This project is still in early development stages and will
> wildly change in the near future. Given that, we're not accepting Pull
> Requests yet. Once the source code structure has stabilized, and we've published our **Contributing Guidelines**, **Code of Conduct** and **Pull Request template** we will begin reviewing and accepting PRs from the community.<br/><br/>You can star/watch the repository to be notified of relevant updates as they become available.

The monday.com SDK provides a toolset for application developers to build features and solutions on top of the monday.com Work OS platform. You'll find this SDK useful if you want to:

- Access monday.com account data from your application, by utilizing our GraphQL client

- Build Board Views & Dashboard Widgets that extend the monday.com UI
- Build Integrations & Automations using your own external services and business logic

## Installation

### Using as a `npm` package:

`npm install monday-sdk-js --save`
`yarn add monday-sdk-js`

and then:

```
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
```

### Loading using a `<script>` tag:

`<script src="https://unpkg.com/monday-sdk-js@0.0.8/dist/main.js"></script>`

This will expose the sdk on your window, and you can intialize it in your code when needed:

```
const monday = window.mondaySdk()
```


## API Calls

Use the `monday.api()` method both in the server and in the client in order to create API calls to the monday.com GraphQL API. In the server you'll have to provide it with an access token to the API, and in the client you'll enjoy seamless authentication and you'll be able to create requests to the API in the name of the logged in user without providing a token.

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

### **oauthToken(code, clientId, clientSecret)**

## Server Side SDK

```javascript
const mondayServerSdk = require("monday-sdk-js/server-sdk");

const token = "YOUR_API_TOKEN";
const monday = mondayServerSdk({ token });

monday
  .api(`query { boards { id, name }}`)
  .then(res => console.log(JSON.stringify(res)));
```

## Client Side SDK

```javascript
import mondaySdk from "monday-sdk";
const monday = mondaySdk();
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

- #### itemIds

Return the list of items that are curently filetered 

```javascript
monday.get("itemIds").then(res => console.log(res));
```

```javascript
[234234, 4564, 234234, 67675, 576567]
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

- #### itemIds

Will call your callback with the updated filtered item ids when filter changes

```javascript
const callback = res => console.log(res);

const unsubscribe = monday.listen("itemIds", callback);
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

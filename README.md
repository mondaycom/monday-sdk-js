



# Monday SDK
The monday SDK is....
* **P1:** bla bla bla
* **P2:** bla bla bla
* **p3:** bla bla bla


## Installation
* **Using as an NPM package:**  
  ```npm i monday-sdk --save```  
  ```yarn add monday-sdk```
  
* **Using `<script>` tag from a CDN:** `<script src="https://unpkg.com/monday-sdk@1.0.7/dist/main.js"></script>`


## Client Side SDK
```javascript
import monday from "monday-sdk";
```

### **init(clientId)**
Should be called before any othe call to the sdk. Get your public client ID as a sole argument.
```javascript
CLIENT_ID = "912";
monday.init(CLIENT_ID);
```

### **api(query, options = {})**
Allow you to query monday Graphql API (v2). The first argument is a graphql query.
In case you need to pass variables to your query, you can pass an object instead of a string as the first param. This object needs to contain `query` and `variables` attributes.  
Returns a promise that will be resolved with the API response on success.


#### **Queries**
```javascript
monday.api(`query { users { id, name } }`).then(res => {
  console.log(res)
  // { data: { users: [{id: 12312, name: "Bart Simpson"}, {id: 423423, name: "Homer Simpson"}] } }
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
`)
```

#### **Options**
|Option|type|required|description|Default|
|--|--|--|--|--|
|token|String|No|A user's token to authenticate with|If is not set, we'll make that call through the iframe parent (which is in most cases exactly what you want)

### **get(type, params = {})**
Get data from the monday app client. Can be used only while working as an app feature inside an iframe.
Returns a promise that will be resolved with the data.

* #### settings
```javascript
monday.get("settings").then(res => console.log(res));
```

```javascript
{
  fieldName: fieldValue
}
```

* #### context
```javascript
monday.get("context").then(res => console.log(res));
```

```javascript
// Board Views
{
  boardId: 3423243, 
  boardViewId: 19324,
  mode "fullScreen", // or "split"
  theme "light" // or "dark"
}

// Dashboard Widgets
{
  boardIds: [3423243, 943728], 
  widgetId: 54236,
  theme "light" // or "dark"
}
```


### **listen(type, callback)**
Subscribe to get notified on certain events.

* #### settings
Will call your callback with the updated settings when it changes
```javascript
const callback = (res => console.log(res));
const unsubscribe = monday.listen("settings", callback);
```

* #### context
Will call your callback with the updated context when it changes
```javascript
const callback = (res => console.log(res));
const unsubscribe = monday.listen("context", callback);
```


* #### events
Will call your callback with events occured in your board/s.
```javascript
const callback = (res => console.log(res));
const unsubscribe = monday.listen("events", callback);

// Some item has been create in your board/s:
// { type: "new_items", itemIds: [5543, 5544, 5545], boardId: 3425 } 

// Some column value has been changes:
// { type: "change_column_value", itemId: 12342, value: {...} } 
```

### **execute(type, params)**
Call for action on the monday app

* #### openItemCard
Open a popup with all item info

```javascript
monday.execute("openItemCard", { itemId: item.id });
```


### License
monday.com sdk is [MIT licensed](./LICENSE).

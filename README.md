


# monday.com Apps framework SDK for JavaScript
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mondaycom/monday-sdk-js/blob/master/LICENSE) &nbsp; [![npm version](https://img.shields.io/npm/v/monday-sdk-js.svg?style=flat)](https://www.npmjs.com/package/monday-sdk-js) &nbsp; [![npm](https://img.shields.io/npm/dm/monday-sdk-js)](https://www.npmjs.com/package/monday-sdk-js) &nbsp; [![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/monday-sdk-js)](https://www.jsdelivr.com/package/npm/monday-sdk-js)


The monday.com SDK provides a toolset for application developers to build features and solutions on top of the monday.com Work OS platform. You'll find this SDK useful if you want to:

- Access monday.com account data from your application, by utilizing the GraphQL client
- Build Board Views & Dashboard Widgets that extend the monday.com UI
- Build Integrations & Automations using your own external services and business logic

The SDK contains methods for server-side and client-side application development. Client-side capabilities assume a valid user session is present (and can seamlessly act on behalf of that user), while server-side methods can be used to access monday.com features using explicit credentials but without any client-side code.

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

## Docs

To get started, check out the [SDK Documentation](https://developer.monday.com/apps/docs/introduction-to-the-sdk)

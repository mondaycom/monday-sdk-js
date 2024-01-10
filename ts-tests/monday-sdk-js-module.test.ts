import mondaySdk from "../types";
const monday = mondaySdk();

monday.api("test"); // $ExpectType Promise<{ data: object; }>

monday.setApiVersion("2023-10"); // $ExpectType void
mondaySdk({ apiVersion: "2023-10" });
monday.api("test", { apiVersion: "2023-07" }); // $ExpectType Promise<{ data: object; }>

monday.setToken("test"); // $ExpectType void

monday.get("context", { appFeatureType: "AppFeatureBoardView" }).then(res => {
  const { data } = res;
  data.app.id; // $ExpectType number
  data.permissions.approvedScopes; // $ExpectType string[]
  data.theme; // $ExpectType string
  data.boardId; // $ExpectType number
  data.viewMode; // $ExpectType string
}); // $ExpectType Promise<{ data: string; }>

monday.get<{ text: string; level: number }>("settings").then(res => {
  const { data } = res;
  data.text; // $ExpectType string
  data.level; // $ExpectType number
}); // $ExpectType Promise<{ data: object; }>

monday.get("itemIds").then(res => {
  const { data } = res;
  data[0]; // $ExpectType number
}); // $ExpectType Promise<{ data: number[]; }>

monday.get("sessionToken").then(res => {
  const { data } = res;
  data; // $ExpectType string
}); // $ExpectType Promise<{ data: string; }>

monday.set("settings", { text: "this is a test", number: 23 }); // $ExpectType Promise<any>

monday.listen("context", res => res); // $ExpectType void

monday.execute("openItemCard", { itemId: 123 }); // $ExpectType Promise<any>
monday.execute("confirm", { message: "Hello" }); // $ExpectType Promise<{ data: { confirm: boolean; }; }>
monday.execute("notice", { message: "Hello" }); // $ExpectType Promise<any>
// $ExpectType Promise<any>
monday.execute("openFilesDialog", {
  boardId: 12345,
  itemId: 23456,
  columnId: "files",
  assetId: 34567
});
// $ExpectType Promise<any>
monday.execute("triggerFilesUpload", {
  boardId: 12345,
  itemId: 23456,
  columnId: "files"
});
monday.execute("openAppFeatureModal", { urlPath: "/path", urlParams: {}, width: "100px", height: "100px" }); // $ExpectType Promise<{ data: any; }>
monday.execute("closeAppFeatureModal"); // $ExpectType Promise<{ data: any; }>
monday.execute("valueCreatedForUser"); // $ExpectType Promise<any}>
// $ExpectType Promise<any>
monday.execute("addDocBlock", {
  type: "normal text",
  content: { deltaFormat: [{ insert: "test" }] }
});
// $ExpectType Promise<any>
monday.execute("updateDocBlock", {
  id: "1234-1234-23434dsf",
  content: { deltaFormat: [{ insert: "test" }] }
});
// $ExpectType Promise<any>
monday.execute("addMultiBlocks", {
  afterBlockId: "1234-1234-23434dsf",
  blocks: [
    {
      type: "normal text",
      content: { deltaFormat: [{ insert: "test" }] }
    }
  ]
});
monday.execute("closeDocModal"); // $ExpectType Promise<any>

monday.oauth({ clientId: "clientId" });

monday.storage.instance.getItem("test").then(res => {
  const { data } = res;
  data.success; // $ExpectType boolean
  data.value; // $ExpectType any
}); // $ExpectType Promise<GetResponse>

monday.storage.instance.setItem("test", "123").then(res => {
  const { data } = res;
  data.success; // $ExpectType boolean
}); // $ExpectType Promise<SetResponse>

monday.storage.instance.deleteItem("test").then(res => {
  const { data } = res;
  data.success; // $ExpectType boolean
}); // $ExpectType Promise<DeleteResponse>

monday.storage.getItem("test").then(res => {
  const { data } = res;
  data.success; // $ExpectType boolean
  data.value; // $ExpectType any
}); // $ExpectType Promise<GetResponse>

monday.storage.setItem("test", "123").then(res => {
  const { data } = res;
  data.success; // $ExpectType boolean
}); // $ExpectType Promise<SetResponse>

monday.storage.deleteItem("test").then(res => {
  const { data } = res;
  data.success; // $ExpectType boolean
}); // $ExpectType Promise<DeleteResponse>

const mondayServer = mondaySdk({ token: "123", apiVersion: "2023-10" });

mondayServer.setToken("123"); // $ExpectType void
mondayServer.setApiVersion("2023-10"); // $ExpectType void
mondayServer.api("test"); // $ExpectType Promise<any>
mondayServer.api("test", { token: "test" }); // $ExpectType Promise<any>
mondayServer.api("test", { variables: { variable1: "test" } }); // $ExpectType Promise<any>
mondayServer.api("test", { token: "test", variables: { variable1: "test" } }); // $ExpectType Promise<any>
mondayServer.api("test", { token: "test", apiVersion: "2023-07" }); // $ExpectType Promise<any>
mondayServer.oauthToken("test", "test", "test"); // $ExpectType Promise<any>

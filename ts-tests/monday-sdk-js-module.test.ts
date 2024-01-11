import mondaySdk from "../types";
const monday = mondaySdk();

monday.api("test");

monday.setApiVersion("2023-10");
mondaySdk({ apiVersion: "2023-10" });
monday.api("test", { apiVersion: "2023-07" });

monday.setToken("test");

monday.get("context", { appFeatureType: "AppFeatureBoardView" }).then(res => {
  const { data }: { data: { app: { id: number }; theme: string; boardId: number; viewMode: string } } = res;
});

monday.get<{ text: string; level: number }>("settings").then(res => {
  const { data }: { data: { text: string; level: number } } = res;
});

monday.get("itemIds").then(res => {
  const { data }: { data: number[] } = res;
});

monday.get("sessionToken").then(res => {
  const { data }: { data: string } = res;
});

monday.set("settings", { text: "this is a test", number: 23 });

monday.listen(
  "context",
  res => {
    const { data }: { data: { app: { id: number }; theme: string; itemId: number } } = res;
  },
  { appFeatureType: "AppFeatureItemView" }
);

monday.execute("openItemCard", { itemId: 123 });
monday.execute("confirm", { message: "Hello" });
monday.execute("notice", { message: "Hello" });

monday.execute("openFilesDialog", {
  boardId: 12345,
  itemId: 23456,
  columnId: "files",
  assetId: 34567
});

monday.execute("triggerFilesUpload", {
  boardId: 12345,
  itemId: 23456,
  columnId: "files"
});
monday.execute("openAppFeatureModal", { urlPath: "/path", urlParams: {}, width: "100px", height: "100px" });
monday.execute("closeAppFeatureModal");
monday.execute("valueCreatedForUser");

monday.execute("addDocBlock", {
  type: "normal text",
  content: { deltaFormat: [{ insert: "test" }] }
});

monday.execute("updateDocBlock", {
  id: "1234-1234-23434dsf",
  content: { deltaFormat: [{ insert: "test" }] }
});

monday.execute("addMultiBlocks", {
  afterBlockId: "1234-1234-23434dsf",
  blocks: [
    {
      type: "normal text",
      content: { deltaFormat: [{ insert: "test" }] }
    }
  ]
});
monday.execute("closeDocModal");

monday.oauth({ clientId: "clientId" });

monday.storage.instance.getItem("test").then(res => {
  const { data }: { data: { error?: string; success: boolean }; errorMessage?: string } = res;
});

monday.storage.instance.setItem("test", "123").then(res => {
  const { data }: { data: { error?: string; success: boolean }; errorMessage?: string } = res;
});

monday.storage.instance.deleteItem("test").then(res => {
  const { data }: { data: { error?: string; success: boolean }; errorMessage?: string } = res;
});

monday.storage.getItem("test").then(res => {
  const { data }: { data: { error?: string; success: boolean }; errorMessage?: string } = res;
});

monday.storage.setItem("test", "123").then(res => {
  const { data }: { data: { error?: string; success: boolean }; errorMessage?: string } = res;
});

monday.storage.deleteItem("test").then(res => {
  const { data }: { data: { error?: string; success: boolean }; errorMessage?: string } = res;
});

const mondayServer = mondaySdk({ token: "123", apiVersion: "2023-10" });

mondayServer.setToken("123");
mondayServer.setApiVersion("2023-10");
mondayServer.api("test");
mondayServer.api("test", { token: "test" });
mondayServer.api("test", { variables: { variable1: "test" } });
mondayServer.api("test", { token: "test", variables: { variable1: "test" } });
mondayServer.api("test", { token: "test", apiVersion: "2023-07" });
mondayServer.oauthToken("test", "test", "test");

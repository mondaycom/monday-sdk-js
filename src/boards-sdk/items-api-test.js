const { sinon, assert, expect } = require("../tests/helpers");
const fetch = require("../monday-api-client/fetch");
const createItemsApi = require("./items-api");

describe("items api", () => {
  let fetchStub;
  let items;

  beforeEach(() => {
    fetchStub = sinon.stub(fetch, "nodeFetch").resolves({
      json: async () => ({ data: { create_item: { id: 1, name: "it" } } }),
      headers: { get: () => "application/json" }
    });
    items = createItemsApi({ _token: "token" });
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it("createItem should send mutation", async () => {
    const res = await items.createItem({ boardId: 1, name: "it" });
    assert.calledOnce(fetchStub);
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "create_item");
    expect(res).to.deep.equal({ id: 1, name: "it" });
  });

  it("getItem should query item", async () => {
    fetchStub.resolves({
      json: async () => ({ data: { items: [{ id: 2, name: "it2" }] } }),
      headers: { get: () => "application/json" }
    });
    const res = await items.getItem({ itemId: 2 });
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "items");
    expect(res).to.deep.equal({ id: 2, name: "it2" });
  });

  it("listBoardItems should use items_page", async () => {
    fetchStub.resolves({
      json: async () => ({ data: { boards: [{ items_page: { cursor: "c1", items: [] } }] } }),
      headers: { get: () => "application/json" }
    });
    await items.listBoardItems({ boardId: 1, limit: 50, queryParams: { rules: [] } });
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "items_page");
    assert.include(body, "limit");
    assert.include(body, "query_params");
  });

  it("listBoardItems should use next_items_page", async () => {
    fetchStub.resolves({
      json: async () => ({ data: { boards: [{ next_items_page: { cursor: null, items: [] } }] } }),
      headers: { get: () => "application/json" }
    });
    await items.listBoardItems({ boardId: 1, cursor: "c1" });
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "next_items_page");
  });
});

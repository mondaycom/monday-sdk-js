const { expect, assert, sinon } = require("./../tests/helpers");
const fetch = require("./fetch");
const mondayApiClient = require("./monday-api-client");

describe("mondayApiClient", () => {
  let nodeFetchStub;
  let fetchMock;

  beforeEach(() => {
    fetchMock = sinon.stub(async () => {
      return { data: "some_data" };
    });
    nodeFetchStub = sinon.stub(fetch, "nodeFetch").resolves({ json: fetchMock });
  });

  afterEach(() => {
    nodeFetchStub.restore();
  });

  it("should be able to execute an api request", async () => {
    const result = await mondayApiClient.execute("query { boards { id, name }}", "api_token");
    expect(result).to.deep.equal({ data: "some_data" });
  });

  it("should call node fetch with the correct args", async () => {
    await mondayApiClient.execute("query { boards { id, name }}", "api_token");
    assert.calledOnce(nodeFetchStub);
    assert.calledWithExactly(nodeFetchStub, "https://api.monday.com/v2", {
      body: '"query { boards { id, name }}"',
      headers: { Authorization: "api_token", "Content-Type": "application/json" },
      method: "POST"
    });
  });

  it("should throw error if token is missing", async () => {
    let errorMessage;
    try {
      await mondayApiClient.execute("query { boards { id, name }}");
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).to.eq("Token is required");
  });

  it(`sould throw ${mondayApiClient.COULD_NOT_PARSE_JSON_RESPONSE_ERROR}`, async () => {
    nodeFetchStub.returns({ json: "not json" });
    let errorMessage;
    try {
      await mondayApiClient.execute("query { boards { id, name }}", "api_token");
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).to.eq(mondayApiClient.COULD_NOT_PARSE_JSON_RESPONSE_ERROR);
  });
});

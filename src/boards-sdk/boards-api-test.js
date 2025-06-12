const { sinon, assert, expect } = require("../tests/helpers");
const fetch = require("../monday-api-client/fetch");
const createBoardsApi = require("./boards-api");

describe("boards api", () => {
  let fetchStub;
  let boards;

  beforeEach(() => {
    fetchStub = sinon.stub(fetch, "nodeFetch").resolves({
      json: async () => ({ data: { create_board: { id: 1, name: "b", board_kind: "private" } } }),
      headers: { get: () => "application/json" }
    });
    boards = createBoardsApi({ _token: "token" });
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it("createBoard should send mutation", async () => {
    const res = await boards.createBoard({ name: "b", kind: "private" });
    assert.calledOnce(fetchStub);
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "create_board");
    assert.include(body, "board_name");
    expect(res).to.deep.equal({ id: 1, name: "b", board_kind: "private" });
  });

  it("getBoard should query board", async () => {
    fetchStub.resolves({
      json: async () => ({ data: { boards: [{ id: 2, name: "brd" }] } }),
      headers: { get: () => "application/json" }
    });
    const res = await boards.getBoard({ boardId: 2 });
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "boards");
    assert.include(body, "ids");
    expect(res).to.deep.equal({ id: 2, name: "brd" });
  });

  it("archiveBoard should send mutation", async () => {
    fetchStub.resolves({
      json: async () => ({ data: { archive_board: { id: 3, state: "archived" } } }),
      headers: { get: () => "application/json" }
    });
    const res = await boards.archiveBoard({ boardId: 3 });
    const body = fetchStub.firstCall.args[1].body;
    assert.include(body, "archive_board");
    expect(res).to.deep.equal({ id: 3, state: "archived" });
  });
});

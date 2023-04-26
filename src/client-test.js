const { sinon, expect } = require("./tests/helpers");
const initMondaySdk = require("./client");

describe("Monday Client Test", () => {
  const clientId = "clientId";
  const apiToken = "123456789";

  let mondayClient;
  let options = {
    clientId,
    apiToken
  };
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    mondayClient = initMondaySdk(options);
  });

  afterEach(() => {
    clock.restore();
    mondayClient._removeEventListener();
    mondayClient._clearListeners();
  });
  describe("init", () => {
    it("should set client id", () => {
      expect(mondayClient._clientId).to.equal(clientId);
    });

    it("should set the token id", () => {
      expect(mondayClient._apiToken).to.equal(apiToken);
    });
  });

  describe("setters", () => {
    it("should set client id correctly", () => {
      const newId = "newId";
      const { setClientId } = mondayClient;

      setClientId(newId);

      expect(mondayClient._clientId).to.equal(newId);
    });

    it("should set the api token correctly", () => {
      const newToken = "new toekn";
      const { setToken } = mondayClient;

      setToken(newToken);

      expect(mondayClient._apiToken).to.equal(newToken);
    });

    it("should set the version correctly", () => {
      const newVersion = "2023-01";
      const { setApiVersion } = mondayClient;

      setApiVersion(newVersion);

      expect(mondayClient._apiVersion).to.eq(newVersion);
    });
  });

  describe("post message", () => {
    let listenCallback;
    let methodCallback;

    const type = "fakeType";

    beforeEach(() => {
      listenCallback = sinon.stub();
      methodCallback = sinon.stub();
    });

    afterEach(() => {
      listenCallback.reset();
      methodCallback.reset();
    });

    it("callback should be call - type", () => {
      const data = {
        method: "method",
        type,
        requestId: "requestId"
      };
      mondayClient.listen(type, listenCallback);
      window.postMessage(data, "*");
      clock.tick(5);
      expect(listenCallback).to.be.calledWithExactly(data);
    });

    it("unsubscribe should prevent callback being called", () => {
      const data = {
        method: "method",
        type,
        requestId: "requestId"
      };
      const unsubscribe = mondayClient.listen(type, listenCallback);
      window.postMessage(data, "*");
      window.postMessage(data, "*");
      window.postMessage(data, "*");
      clock.tick(5);
      unsubscribe();
      window.postMessage(data, "*");
      expect(listenCallback).to.be.calledWithExactly(data).and.calledThrice;
    });
  });
  describe("api methods", () => {
    let postMessageStub;
    beforeEach(() => {
      mondayClient.setToken(null);
      postMessageStub = sinon.stub();
    });

    afterEach(() => {
      postMessageStub.reset();
    });
    it("should post message to window with requestId ", () => {
      window.addEventListener("message", postMessageStub, false);
      mondayClient.api("query");
      clock.tick(5);
      expect(postMessageStub).to.be.called;
      window.removeEventListener("message", postMessageStub, false);
    });

    it("get api post message", () => {
      window.addEventListener("message", postMessageStub, false);
      mondayClient.get({ type: "type", method: "method" });
      clock.tick(5);
      expect(postMessageStub).to.be.called;
      window.removeEventListener("message", postMessageStub, false);
    });

    it("get api post message", () => {
      window.addEventListener("message", postMessageStub, false);
      mondayClient.execute({ type: "type", method: "method" });
      clock.tick(5);
      expect(postMessageStub).to.be.called;
      window.removeEventListener("message", postMessageStub, false);
    });
  });
});

describe("Monday Client Test API - Returning data", () => {
  let clock;
  beforeEach(() => {
    //we are not initializing mondaySdk in beforeEach to have it's event listener being registered
    //AFTER the test's event listener to prevent SDK to react on it's messages before the test listener
    clock = sinon.useFakeTimers();
  });

  it("API should resolve the promise coming from the host app ", done => {
    const clientId = "clientId";
    const responseData = { accountId: 123, boards: [] };
    function onPostMessage(event) {
      const { requestId, method, type } = event.data;
      if (method === "api" && !event.data.data) {
        window.postMessage({ requestId, data: responseData, method, type }, "*");
        //because in tests we don't have 2 different window object (parent and iframe) they are exchanging in the same
        //events space, so here we need to stop the initial SDK event propogation to not allow SDK to react to it's own event
        event.stopImmediatePropagation();
      }
    }
    window.addEventListener("message", onPostMessage, false);

    const mondayClient = initMondaySdk({ clientId });
    mondayClient.api("query").then(res => {
      expect(res).to.be.ok;
      expect(res).to.be.equal(responseData);
      done();
    });
    clock.tick(5);
    window.removeEventListener("message", onPostMessage, false);
  });

  it("API should reject the promise, when host raises an event with errorMessage", done => {
    const clientId = "clientId";
    const errorMessage = "My custom error";
    const errorData = { errors: ["1", "2", "3"] };
    function onPostMessage(event) {
      const { requestId, method, type } = event.data;
      if (method === "api" && !event.data.errorMessage) {
        window.postMessage({ requestId, data: errorData, method, type, errorMessage: errorMessage }, "*");
        //because in tests we don't have 2 different window object (parent and iframe) they are exchanging in the same
        //events space, so here we need to stop the initial SDK event propogation to not allow SDK to react to it's own event
        event.stopImmediatePropagation();
      }
    }
    window.addEventListener("message", onPostMessage, false);

    const mondayClient = initMondaySdk({ clientId });
    mondayClient.api("query").catch(err => {
      expect(err).to.be.ok;
      expect(err.message).to.be.equal(errorMessage);
      expect(err.data).to.be.equal(errorData);
      done();
    });
    clock.tick(5);
    window.removeEventListener("message", onPostMessage, false);
  });
});

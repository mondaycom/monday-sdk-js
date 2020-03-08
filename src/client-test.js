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
      mondayClient.setClientId(newId);
      expect(mondayClient._clientId).to.equal(newId);
    });

    it("should set client id correctly (check biding)", () => {
      const newId = "newId";
      const { setClientId } = mondayClient;
      setClientId(newId);
      expect(mondayClient._clientId).to.equal(newId);
    });

    it("should set the api token correctly", () => {
      const newToken = "new toekn";
      mondayClient.setToken(newToken);
      expect(mondayClient._apiToken).to.equal(newToken);
    });

    it("should set the api token correctly (check bindings)", () => {
      const newToken = "new toekn";

      const { setToken } = mondayClient;
      setToken(newToken);
      expect(mondayClient._apiToken).to.equal(newToken);
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
    it("should add a listener to the listener array with the key of ", () => {
      let requestId;
      function onPostMessage(event) {
        requestId = event.data.requestId;
      }
      window.addEventListener("message", onPostMessage, false);
      mondayClient.api("query");
      clock.tick(5);
      expect(mondayClient.listeners[requestId]).to.be.ok;
      window.removeEventListener("message", onPostMessage, false);
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

const { sinon, expect } = require("./tests/helpers");
const initMondaySdk = require("./client");

describe("Monday Client Test", () => {
  const clientId = "clientId";

  let mondayClient;
  let options = {
    clientId
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
  });

  describe("setters", () => {
    it("should set client id correctly", () => {
      const newId = "newId";
      const { setClientId } = mondayClient;

      setClientId(newId);

      expect(mondayClient._clientId).to.equal(newId);
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

  describe("post message methods", () => {
    let postMessageStub;
    beforeEach(() => {
      postMessageStub = sinon.stub();
    });

    afterEach(() => {
      postMessageStub.reset();
    });

    it("get post message", () => {
      window.addEventListener("message", postMessageStub, false);
      mondayClient.get({ type: "type", method: "method" });
      clock.tick(5);
      expect(postMessageStub).to.be.called;
      window.removeEventListener("message", postMessageStub, false);
    });

    it("execute post message", () => {
      window.addEventListener("message", postMessageStub, false);
      mondayClient.execute({ type: "type", method: "method" });
      clock.tick(5);
      expect(postMessageStub).to.be.called;
      window.removeEventListener("message", postMessageStub, false);
    });
  });
});

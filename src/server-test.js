const { sinon, assert, expect } = require("./tests/helpers");
let initServerSdk = require("./server");
const mondayApiClient = require("./monday-api-client");

describe("server sdk", () => {
  describe("init", () => {
    it("should be able to init serverSdk", () => {
      initServerSdk();
    });

    it("should be able to init serverSdk without token", () => {
      const serverSdk = initServerSdk();
      expect(serverSdk._token).to.eq(undefined);
    });

    it("should be able to init serverSdk with token", () => {
      const serverSdk = initServerSdk({ token: "sometoken123" });
      expect(serverSdk._token).to.eq("sometoken123");
    });

    it("should be able to init serverSdk with API version", () => {
      const serverSdk = initServerSdk({ apiVersion: "2023-01" });
      expect(serverSdk._apiVersion).to.eq("2023-01");
    });
  });

  describe("setToken", () => {
    it("should be able to set token", () => {
      const serverSdk = initServerSdk();
      expect(serverSdk._token).to.eq(undefined);
      serverSdk.setToken("sometoken123");
      expect(serverSdk._token).to.eq("sometoken123");
    });

    it("should be binded", () => {
      const serverSdk = initServerSdk();
      expect(serverSdk._token).to.eq(undefined);
      const { setToken } = serverSdk;
      setToken("sometoken123");
      expect(serverSdk._token).to.eq("sometoken123");
    });
  });

  describe("setApiVersion", () => {
    it("should be able to set the version", () => {
      const serverSdk = initServerSdk();
      expect(serverSdk._apiVersion).to.eq(undefined);

      const { setApiVersion } = serverSdk;
      setApiVersion("2023-01");

      expect(serverSdk._apiVersion).to.eq("2023-01");
    });
  });

  describe("api", () => {
    let mondayApiClientExecuteStub;

    beforeEach(() => {
      mondayApiClientExecuteStub = sinon.stub(mondayApiClient, "execute").resolves("api-response");
    });

    afterEach(() => {
      mondayApiClientExecuteStub.restore();
    });

    it("should call to mondayApi if sdk was initialized with token", async () => {
      const serverSdk = initServerSdk({ token: "api_token" });
      const result = await serverSdk.api("query { boards { id, name }}");
      expect(result).to.eq("api-response");
    });

    it("should call mondayApiClient with the current args", async () => {
      const serverSdk = initServerSdk({ token: "api_token" });
      await serverSdk.api("query { boards { id, name }}");
      assert.calledOnce(mondayApiClientExecuteStub);
      assert.calledWithExactly(
        mondayApiClientExecuteStub,
        { query: "query { boards { id, name }}", variables: undefined },
        "api_token",
        { apiVersion: undefined }
      );
    });

    it("should be able to pass variables in options", async () => {
      const serverSdk = initServerSdk({ token: "api_token" });

      const query = `
        mutation create_pulse($pulseName: String!, $columnValues: JSON) {
          create_pulse(
            pulse_name: $pulseName, 
            board_id: 123, 
            group_id: my_group",
            column_values: $columnValues
          ) {
            id
          }
        }
      `;

      const variables = { pulseName: "new pulse", columnValues: { numbers: 3 } };

      await serverSdk.api(query, { variables });
      assert.calledOnce(mondayApiClientExecuteStub);
      assert.calledWithExactly(
        mondayApiClientExecuteStub,
        {
          query: `
        mutation create_pulse($pulseName: String!, $columnValues: JSON) {
          create_pulse(
            pulse_name: $pulseName, 
            board_id: 123, 
            group_id: my_group",
            column_values: $columnValues
          ) {
            id
          }
        }
      `,
          variables: { columnValues: { numbers: 3 }, pulseName: "new pulse" }
        },
        "api_token",
        { apiVersion: undefined }
      );
    });

    it("should call to mondayApi when token is passed from options", async () => {
      const serverSdk = initServerSdk();
      serverSdk.setToken("api_token");
      const result = await serverSdk.api("query { boards { id, name }}");
      expect(result).to.eq("api-response");
    });

    it("should call to mondayApi prefer token from options", async () => {
      const serverSdk = initServerSdk({ token: "api_token" });
      serverSdk.setToken("api_token_2");
      await serverSdk.api("query { boards { id, name }}");
      assert.calledOnce(mondayApiClientExecuteStub);
      assert.calledWithExactly(
        mondayApiClientExecuteStub,
        { query: "query { boards { id, name }}", variables: undefined },
        "api_token_2",
        { apiVersion: undefined }
      );
    });

    it("should provide version to mondayApi", async () => {
      const serverSdk = initServerSdk({ token: "api_token", apiVersion: "2023-01" });
      serverSdk.setApiVersion("2023-04");
      await serverSdk.api("query { boards { id, name }}");
      assert.calledOnce(mondayApiClientExecuteStub);
      assert.calledWithExactly(
        mondayApiClientExecuteStub,
        { query: "query { boards { id, name }}", variables: undefined },
        "api_token",
        { apiVersion: "2023-04" }
      );
    });

    it("should prefer version from method options when calling mondayApi", async () => {
      const serverSdk = initServerSdk({ token: "api_token", apiVersion: "2023-01" });
      serverSdk.setApiVersion("2023-04");
      await serverSdk.api("query { boards { id, name }}", { apiVersion: "2023-07" });
      assert.calledOnce(mondayApiClientExecuteStub);
      assert.calledWithExactly(
        mondayApiClientExecuteStub,
        { query: "query { boards { id, name }}", variables: undefined },
        "api_token",
        { apiVersion: "2023-07" }
      );
    });

    it("should call to mondayApi prefer version from options", async () => {
      const serverSdk = initServerSdk({ token: "api_token", apiVersion: "2023-01" });
      serverSdk.setApiVersion("2023-04");
      await serverSdk.api("query { boards { id, name }}", { apiVersion: "2023-07" });
      assert.calledOnce(mondayApiClientExecuteStub);
      assert.calledWithExactly(
        mondayApiClientExecuteStub,
        { query: "query { boards { id, name }}", variables: undefined },
        "api_token",
        { apiVersion: "2023-07" }
      );
    });

    it("should throw error if token is missing", async () => {
      let errorMessage;
      const serverSdk = initServerSdk();
      try {
        await serverSdk.api("query { boards { id, name }}");
      } catch (err) {
        errorMessage = err.message;
      }

      expect(errorMessage).to.equal("Should send 'token' as an option or call mondaySdk.setToken(TOKEN)");
    });
  });
});

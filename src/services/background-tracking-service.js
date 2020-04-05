const initBackgroundTracking = sdk => {
  const ping = () => {
    sdk.track("ping");
  };
  ping();
  setInterval(ping, 1000 * 60);
};

module.exports = {
  initBackgroundTracking
};

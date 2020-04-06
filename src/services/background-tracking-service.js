const _5_MINUTES_MS = 5 * 60 * 1000;

let initialized = false;
const initBackgroundTracking = sdk => {
  if (initialized) return;
  initialized = true;

  const ping = () => {
    sdk.track("ping");
  };
  ping();
  setInterval(ping, _5_MINUTES_MS);
};

module.exports = {
  initBackgroundTracking
};

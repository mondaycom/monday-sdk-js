let scrollHelperInitialized = false;

function initScrollHelperIfNeeded() {
  if (scrollHelperInitialized) return;
  // will prevent white flashes when scrolling using wheel events on laptops
  // with dual gpu when using the power saving gpu
  // it's reproduceable on macbook when not connected to an external display
  scrollHelperInitialized = true;

  // when an elemnt cover the scollable element, wheel events are synchronous on chromium based browsers
  const css =
    'body::before { content: ""; position: fixed; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; z-index: 2147483647; /* mondaySdk css - can be disabled with: mondaySdk({withoutScrollHelper: true }) */ }';
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));

  const head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(style);
}

module.exports = {
  initScrollHelperIfNeeded
};

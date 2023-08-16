const logWarnings = res => {
  const warnings = res && res.extensions && res.extensions.warnings;
  if (!warnings || !Array.isArray(warnings)) return res;

  warnings.forEach(warning => {
    if (!warning || !warning.message) return;

    try {
      const locations =
        warning.locations && warning.locations.map(loc => `line ${loc.line}, column ${loc.column}`).join("; ");
      const path = warning.path && warning.path.join(" → ");

      let message = warning.message;

      // remove the dot at the end of the message
      message = message.replace(/\.$/, "");
      // start the message with lower case letter
      message = message.charAt(0).toLowerCase() + message.slice(1);

      const messageParts = [
        "[monday API]",
        `${path}:`,
        message,
        locations && `@ ${locations}`,
        warning.extensions ? ["\n\nAdditional details:", warning.extensions] : undefined
      ]
        .flat()
        .filter(Boolean);

      console.warn(...messageParts);
    } catch (e) {
      if (warning) {
        console.warn("[monday API] Warning:", warning);
      }
    }
  });

  return res;
};

module.exports = {
  logWarnings
};

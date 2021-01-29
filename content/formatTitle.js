module.exports = formatTitle;

/**
 * @param {string} title
 */
function formatTitle(title) {
  switch (title) {
    case "getting started":
      return "Getting Started";
    case "cookbook":
      return "Cookbook";
    case "cli":
      return "CLI";
    case "dolthub":
      return "DoltHub";
    case "use cases":
      return "Use Cases";
    case "system tables":
      return "System Tables";
    case "configuration":
      return "Configuration";
    case "overview and examples":
      return "Overview and Examples"
    default:
      return title;
  }
}

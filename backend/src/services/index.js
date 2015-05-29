/**
 * Loads services
 */
[
    "loginStatus",
    "getTableForDate"
].
forEach(function (value, key) {
    exports[value] = require("./" + value + "-serviceImpl");
});
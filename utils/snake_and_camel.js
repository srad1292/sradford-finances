function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
  
function camelToSnake(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

module.exports = {snakeToCamel, camelToSnake};
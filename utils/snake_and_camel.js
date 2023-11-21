function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
  
function camelToSnake(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function snakeToTitle(str) {
    if(str === undefined || str === "") { return str; }
    str[0] = str[0].toUpperCase();
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

module.exports = {snakeToCamel, camelToSnake, snakeToTitle};
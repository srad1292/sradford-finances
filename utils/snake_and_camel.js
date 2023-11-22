function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
  
function camelToSnake(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function snakeToTitle(str) {
    if(str === undefined || str === "") { return str; }
    let first = str.charAt(0).toUpperCase();
    str = first + str.slice(1);

    return str.replace(/_([a-z])/g, (match, letter) => ` ${letter.toUpperCase()}`);
}

module.exports = {snakeToCamel, camelToSnake, snakeToTitle};
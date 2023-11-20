function moneyToCents(money) {
    return parseInt(body[key].toFixed(2).replace('.', ''));
}

function centsToMoney(cents) {
    let str = `${cents}`;
    if(cents === 0) {
        return 0;
    }
    else if(str.length === 1) {
        return parseFloat(`0.0${str}`);
    } else if(str.length === 2) {
        return parseFloat(`0.${str}`);
    } else {
        return parseFloat(str.slice(0, -2) + '.' + str.slice(-2));
    }
}

module.exports = {moneyToCents, centsToMoney};
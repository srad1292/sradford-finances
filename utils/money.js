function moneyToCents(money) {
    return parseInt(money.toFixed(2).replace('.', ''));
}

function centsToMoney(cents) {
    let isNegative = cents < 0;
    if(isNegative) {
        cents = Math.abs(cents);
    }
    let str = `${cents}`;
    let moneyStr = '';
    if(cents === 0) {
        return 0;
    }
    else if(str.length === 1) {
        moneyStr = `0.0${str}`;
    } else if(str.length === 2) {
        moneyStr = `0.${str}`;
    } else {
        moneyStr = str.slice(0, -2) + '.' + str.slice(-2);
    }

    return isNegative ? parseFloat(`-${moneyStr}`) : parseFloat(moneyStr);
}

module.exports = {moneyToCents, centsToMoney};
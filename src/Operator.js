var normal = {
    add: (x, y) => x + y,
    dec: (x, y) => x - y,
    divide: (x, y) => x / y,
    multiply: (x, y) => x * y,
    modulo: (x, y) => x % y,
    propIn: (key, obj) => key in obj,
    instanceOf: (b, a) => b instanceof a,
    lt: (a, b) => a < b,
    gt: (a, b) => a > b,
    lte: (a, b) => a <= b,
    gte: (a, b) => a >= b,
    eq: (a, b) => a == b,
    neq: (a, b) => a != b,
    eqs: (a, b) => a === b,
    neqs: (a, b) => a !== b,
    lShift: (num, count) => num << count,
    rShift: (num, count) => num >> count,
    rShiftNS: (num, count) => num >>> count,
    andB: (a, b) => a & b,
    orB: (a, b) => a | b,
    xorB: (a, b) => a ^ b,
    and: (a, b) => a && b,
    or: (a, b) => a || b,
};

var specail = {
    prop: (key, obj) => obj[key]
}

var operator = Object.assign({}, normal, specail);
export default operator
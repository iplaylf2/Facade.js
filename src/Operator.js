var normal = {
    add: (x, y) => x + y,
    dec: (x, y) => x - y,
    divide: (x, y) => x / y,
    multiply: (x, y) => x * y,
    modulo: (x, y) => x % y,
    propIn: (key, obj) => key in obj,
    instance: (b, a) => a instanceof b,
    lt: (a, b) => a < b,
    gt: (a, b) => a > b,
    lte: (a, b) => a <= b,
    gte: (a, b) => a >= b,
    eq: (a, b) => a == b,
    neq: (a, b) => a != b,
    eqs: (a, b) => Object.is(a, b),
    neqs: (a, b) => !Object.is(a, b),
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
    prop: (key, obj) => obj[key],
    type: (key, obj) => typeof obj === key
}

export default Object.assign({}, normal, specail);
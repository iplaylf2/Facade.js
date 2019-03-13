const normal = {
    add(x, y) {
        return x + y;
    },
    dec(x, y) {
        return x - y;
    },
    divide(x, y) {
        return x / y;
    },
    multiply(x, y) {
        return x * y;
    },
    modulo(x, y) {
        return x % y;
    },
    propIn(key, obj) {
        return key in obj;
    },
    instance(b, a) {
        return a instanceof b;
    },
    lt(a, b) {
        return a < b;
    },
    gt(a, b) {
        return a > b;
    },
    lte(a, b) {
        return a <= b;
    },
    gte(a, b) {
        return a >= b;
    },
    eq(a, b) {
        return a == b;
    },
    neq(a, b) {
        return a != b;
    },
    eqs(a, b) {
        return Object.is(a, b);
    },
    neqs(a, b) {
        return !Object.is(a, b);
    },
    lShift(num, count) {
        return num << count;
    },
    rShift(num, count) {
        return num >> count;
    },
    rShiftNS(num, count) {
        return num >>> count;
    },
    andB(a, b) {
        return a & b;
    },
    orB(a, b) {
        return a | b;
    },
    xorB(a, b) {
        return a ^ b;
    },
    and(a, b) {
        return a && b;
    },
    or(a, b) {
        return a || b;
    },
    not(a) {
        return !a;
    }
};

const specail = {
    prop(key, obj) {
        return obj[key];
    },
    type(key, obj) {
        return typeof obj === key;
    },
}

export default Object.assign({}, normal, specail);
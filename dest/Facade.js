(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.F = factory());
}(this, (function () { 'use strict';

var curring = (f, l) => (...args) => {
    if (l === args.length) return f(...args);
    if (l > args.length) return curring((...rest) => f(...args.concat(rest)), l - args.length);

    var result = f(...args.slice(0, l));
    return curring(result, result.length)(...args.slice(l));
};

var Facade$1 = f => curring(f, f.length);

var pipe = funcs => funcs.reduce((g, f) => arg => f(g(arg)));

Facade$1.pipe = Facade$1(pipe);

var FacadeGroup = obj => {
    var result = {};
    for (var key in obj) result[key] = Facade$1(obj[key]);
    return result;
};

var A = Array.prototype;

var prop = {
    length: enumerable => A.reduce.call(enumerable, count => count + 1, 0)
};

var prototype = {
    concat: (a, b) => A.concat.call(a, b),
    every: (predicate, enumerable) => {
        for (var item of enumerable)
            if (!predicate(item)) return false;
        return true;
    },
    full: (content, count) => Array(count).fill(content),
    filter: (predicate, enumerable) => {
        var result = [];
        for (var item of enumerable)
            if (predicate(item)) result.push(item);
        return result;
    },
    find: (predicate, enumerable) => {
        for (var item of enumerable)
            if (predicate(item)) return item;
    },
    findIndex: (predicate, enumerable) => {
        var i = -1;
        for (var item of enumerable) {
            i++;
            if (predicate(item)) return i;
        }
        return i;
    },
    forEach: (cb, enumerable) => {
        for (var item of enumerable) cb(item);
    },
    includes: (element, start, enumerable) => A.includes.call(enumerable, element, start),
    indexOf: (element, start, enumerable) => A.indexOf.call(enumerable, element, start),
    join: (separator, enumerable) => A.join.call(enumerable, separator),
    lastIndexOf: (element, start, enumerable) => A.lastIndexOf.call(enumerable, element, start),
    map: (cb, enumerable) => {
        var result = [];
        for (var item of enumerable) result.push(cb(item));
        return result;
    },
    reduce: (cb, enumerable) => {
        var iterator = enumerable[Symbol.iterator](), first = iterator.next();
        if (first.done) return;

        var result = first.value;
        for (var item of iterator) result = cb(result, item);
        return result;
    },
    reduceI: (cb, init, enumerable) => {
        var result = init;
        for (var item of enumerable) result = cb(result, item);
        return result;
    },
    reduceRight: (cb, enumerable) => {
        var source = [];
        for (var item of enumerable) source.push(item);

        var iterator = source[Symbol.iterator](), first = iterator.next();
        if (first.done) return;

        var result = first.value;
        for (var item of iterator) result = cb(result, item);
        return result;
    },
    reduceRightI: (cb, init, enumerable) => {
        var source = [];
        for (var item of enumerable) source.push(item);

        var result = init;
        for (var item of source) result = cb(result, item);
        return result;
    },
    reverse: enumerable => {
        var result = [];
        for (var item of enumerable) result.push(item);
        return result;
    },
    slice: (start, end, enumerable) => A.slice.call(enumerable, start, end),
    some: (predicate, enumerable) => {
        for (var item of enumerable)
            if (predicate(item)) return true;
        return false;
    },
    sort: function sort(enumerable) {
        var l = [], r = [], iterator = enumerable[Symbol.iterator](), first = iterator.next();
        if (first.done) return [];

        for (var item of iterator) {
            if (item < first.value) l.push(item);
            else r.push(item);
        }
        return [...sort(l), first.value, ...sort(r)];
    },
    sortC: function sort(comparer, enumerable) {
        var l = [], r = [], iterator = enumerable[Symbol.iterator](), first = iterator.next();
        if (first.done) return [];

        for (var item of iterator) {
            if (comparer(item, first.value) < 0) l.push(item);
            else r.push(item);
        }
        return [...sort(comparer, l), first.value, ...sort(comparer, r)];
    }
};

var ArrayS = Object.assign({}, prop, prototype);

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
};

var operator = Object.assign({}, normal, specail);

Object.assign(Facade$1, { Array: FacadeGroup(ArrayS) }, FacadeGroup(operator));

return Facade$1;

})));

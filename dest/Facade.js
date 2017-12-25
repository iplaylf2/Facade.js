(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.F = factory());
}(this, (function () { 'use strict';

var { hasFlag, putFlag } = (() => {
    var flag = Symbol('curring');
    return {
        hasFlag: f => f[flag] !== undefined,
        putFlag: f => {
            f[flag] = true;
            return f;
        }
    };
})();

var curring = (f, l) => putFlag((...args) => {
    if (l > args.length) return curring((...rest) => f(...args.concat(rest)), l - args.length);

    var nextFunc;
    if (l === args.length) {
        nextFunc = f(...args);
        if (nextFunc instanceof Function && !hasFlag(nextFunc)) return curring(nextFunc, nextFunc.length);
        else return nextFunc;
    }

    nextFunc = f(...args.slice(0, l));
    if (hasFlag(nextFunc)) return nextFunc(...args.slice(l));
    else return curring(nextFunc, nextFunc.length)(...args.slice(l));
});

var Facade$1 = f => curring(f, f.length);

var filp = f => (b, a) => f(a, b);

var pipe = funcs => funcs.reduce((g, f) => arg => f(g(arg)));

//obj.func(...arg) to func(...arg)(obj)
var forcall = func => curring((...args) => func.call(args[func.length], ...args.slice(0, func.length)), func.length + 1);

Object.assign(Facade$1, {
    isF: hasFlag,
    filp: Facade$1(filp),
    pipe: Facade$1(pipe),
    forcall: Facade$1(forcall)
});

var FacadeGroup = obj => {
    var result = {};
    for (var key in obj) result[key] = Facade$1(obj[key]);
    return result;
};

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
    prop: (key, obj) => obj[key]
};

var operator = Object.assign({}, normal, specail);

var TooL = {
    argLimit: (f, count) => (...arg) => f(...arg.slice(0, count))
}

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

Object.assign(Facade$1, FacadeGroup(operator), {
    TooL,
    Array: FacadeGroup(ArrayS)
});

return Facade$1;

})));

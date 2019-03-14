(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.F = factory());
}(this, function () { 'use strict';

    class CurringProxy {
        constructor(func, length, argument) {
            Object.assign(this, {
                func,
                boundArgument: argument,
                length
            });
        }
        call(...args) {
            var { func, length } = this;
            var argumentSP = this.boundArgument.merge(args).compress(length);

            while (argumentSP.length >= length) {
                const [real, restArgumentSP] = argumentSP.splice(length);
                const result = func(...real);

                if (result instanceof Function) {
                    func = result;
                    length = result[curring];
                    if (length === undefined) {
                        length = result.length;
                    }
                    argumentSP = restArgumentSP.compress(length);
                } else {
                    return result;
                }
            }
            return new CurringProxy(func, length, argumentSP).makeFunction();
        }
        makeFunction() {
            const call = this.call.bind(this);
            call[curring] = this.length;
            return call;
        }
    }
    const curring = Symbol('curring');

    const [ArgumentSP, placeholder] = (() => {
        class ArgumentSP {
            static make(property) {
                return Object.create(ArgumentSP.prototype, Object.getOwnPropertyDescriptors(property));
            }
            constructor(argumentList) {
                const slotList = [];
                for (var [index, arg] of argumentList.entries()) {
                    if (arg === placeholder) {
                        slotList.push(index);
                    }
                }

                Object.assign(this, {
                    argumentList,
                    slotList,
                });
            }
            merge(restArgument) {
                const argumentList = this.argumentList.concat();
                const slotList = this.slotList;
                var newSlotList = [];

                for (var i = 0; i !== slotList.length && i !== restArgument.length; i++) {
                    let index = slotList[i];
                    let arg = restArgument[i];
                    if (arg === placeholder) {
                        newSlotList.push(index);
                    } else {
                        argumentList[index] = arg;
                    }
                }
                newSlotList = newSlotList.concat(slotList.slice(i));

                const offset = argumentList.length;
                for (; i < restArgument.length; i++) {
                    let arg = restArgument[i];
                    if (arg === placeholder) {
                        newSlotList.push(i + offset);
                    }
                    argumentList.push(arg);
                }

                return ArgumentSP.make({
                    argumentList,
                    slotList: newSlotList,
                });
            }
            compress(length) {
                const restArgument = this.argumentList.concat();
                var newArgumentList = restArgument.splice(0, length);
                var newSlotList = this.slotList.filter(index => index < length);

                var slotIndex = 0;
                for (var [index, arg] of restArgument.entries()) {
                    if (newSlotList.length === 0) {
                        break;
                    }
                    if (arg === placeholder) {
                        slotIndex++;
                    } else {
                        newArgumentList[newSlotList.splice(slotIndex, slotIndex + 1)[0]] = arg;
                    }
                    if (slotIndex >= newSlotList.length) {
                        slotIndex = 0;
                    }
                }

                newArgumentList = newArgumentList.concat(restArgument.slice(index, restArgument.length));

                return new ArgumentSP(newArgumentList);
            }
            splice(length) {
                const argumentList = this.argumentList.concat();
                const leftArgument = argumentList.splice(0, length);
                const slotList = this.slotList.map(index => index - length);

                const rest = ArgumentSP.make({
                    argumentList,
                    slotList,
                });
                return [leftArgument, rest];
            }
            get length() {
                return this.slotList.length === 0 ? this.argumentList.length : this.slotList[0];
            }
        }
        const placeholder = {};
        return [ArgumentSP, placeholder];
    })();

    var facade = function (func) {
        return new CurringProxy(func, func.length, new ArgumentSP([])).makeFunction();
    };

    var flip = function (func) {
        return function (a, b) {
            return func(b, a);
        };
    };

    var pipe = function (funcs) {
        return funcs.reduce((g, f) => arg => f(g(arg)));
    };

    //obj.func(...arg) to func(...arg)(obj)
    var forcall = function (func) {
        const length = func.length;
        const call = function (...args) {
            return func.call(args[length], ...args.slice(0, length));
        };
        return new CurringProxy(call, length + 1, new ArgumentSP([])).makeFunction();
    };

    var Facade = Object.assign(facade, {
        flip: facade(flip),
        pipe: facade(pipe),
        _: placeholder,
        forcall: facade(forcall)
    });

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
    };

    var operator = Object.assign({}, normal, specail);

    const A = Array.prototype;

    const prop = {
        length(enumerable) {
            return A.reduce.call(enumerable, count => count + 1, 0);
        }
    };

    const prototype = {
        concat(a, b) {
            return A.concat.call(a, b);
        },
        every(predicate, enumerable) {
            for (var item of enumerable)
                if (!predicate(item)) return false;
            return true;
        },
        full(content, count) { return Array(count).fill(content); },
        filter(predicate, enumerable) {
            const result = [];
            for (var item of enumerable)
                if (predicate(item)) result.push(item);
            return result;
        },
        find(predicate, enumerable) {
            for (var item of enumerable)
                if (predicate(item)) return item;
        },
        findIndex(predicate, enumerable) {
            var i = -1;
            for (var item of enumerable) {
                i++;
                if (predicate(item)) return i;
            }
            return i;
        },
        forEach(cb, enumerable) {
            for (var item of enumerable) cb(item);
        },
        includes(element, start, enumerable) {
            return A.includes.call(enumerable, element, start);
        },
        indexOf(element, start, enumerable) {
            return A.indexOf.call(enumerable, element, start);
        },
        join(separator, enumerable) {
            return A.join.call(enumerable, separator);
        },
        lastIndexOf(element, start, enumerable) {
            return A.lastIndexOf.call(enumerable, element, start);
        },
        map(cb, enumerable) {
            const result = [];
            for (var item of enumerable) result.push(cb(item));
            return result;
        },
        reduce(cb, enumerable) {
            const iterator = enumerable[Symbol.iterator](), first = iterator.next();
            if (first.done) return;

            var result = first.value;
            for (var item of iterator) result = cb(result, item);
            return result;
        },
        reduceI(cb, init, enumerable) {
            var result = init;
            for (var item of enumerable) result = cb(result, item);
            return result;
        },
        reduceRight(cb, enumerable) {
            const source = [];
            for (var item of enumerable) source.push(item);

            const iterator = source[Symbol.iterator](), first = iterator.next();
            if (first.done) return;

            var result = first.value;
            for (var item of iterator) result = cb(result, item);
            return result;
        },
        reduceRightI(cb, init, enumerable) {
            const source = [];
            for (var item of enumerable) source.push(item);

            var result = init;
            for (var item of source) result = cb(result, item);
            return result;
        },
        reverse(enumerable) {
            const result = [];
            for (var item of enumerable) result.push(item);
            return result;
        },
        slice(start, end, enumerable) {
            return A.slice.call(enumerable, start, end);
        },
        some(predicate, enumerable) {
            for (var item of enumerable)
                if (predicate(item)) return true;
            return false;
        },
        sort: function sort(enumerable) {
            const l = [], r = [], iterator = enumerable[Symbol.iterator](), first = iterator.next();
            if (first.done) return [];

            for (var item of iterator) {
                if (item < first.value) l.push(item);
                else r.push(item);
            }
            return [...sort(l), first.value, ...sort(r)];
        },
        sortC: function sort(comparer, enumerable) {
            const l = [], r = [], iterator = enumerable[Symbol.iterator](), first = iterator.next();
            if (first.done) return [];

            for (var item of iterator) {
                if (comparer(item, first.value) < 0) l.push(item);
                else r.push(item);
            }
            return [...sort(comparer, l), first.value, ...sort(comparer, r)];
        }
    };

    var ArrayS = Object.assign({}, prop, prototype);

    const FacadeGroup = function (obj) {
        const result = {};
        for (var key in obj) result[key] = Facade(obj[key]);
        return result;
    };

    var index = Object.assign(Facade,
        FacadeGroup(operator),
        {
            Array: FacadeGroup(ArrayS)
        }
    );

    return index;

}));
//# sourceMappingURL=facade.js.map

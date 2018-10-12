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

//default
var _ = {};

//具有传染性
var curring = (f, length) => putFlag((...args) => {
    var defaultSet = new Set();
    var partialArgs = [];
    for (var i = 0; i !== args.length; i++) {
        if (args[i] === _) {
            defaultSet.add(i);
        } else {
            partialArgs.push(args[i]);
        }
    }
    if (defaultSet.size !== 0) {
        if (partialArgs.length === 0) {
            return f;
        }
        var nextFunc = curring((...rest) => {
            var right = [];
            var left = [];
            for (var i = 0; i !== length; i++) {
                if (i > length - defaultSet.size - 1) {
                    right.push(rest[i]);
                }
                else {
                    left.push(rest[i]);
                }
            }
            var realArgs = [];
            for (var i = 0; i !== length; i++) {
                if (defaultSet.has(i)) {
                    realArgs.push(right.shift());
                } else {
                    realArgs.push(left.shift());
                }
            }
            return f(...realArgs);
        }, length);
        return nextFunc(...partialArgs);
    }

    if (length > args.length) {
        return curring(f.bind(undefined, ...args), length - args.length);
    }

    var firstResult = f(...args.slice(0, length));
    if (firstResult instanceof Function) {
        var nextFunc = firstResult;
        if (!hasFlag(nextFunc)) {
            nextFunc = curring(nextFunc, nextFunc.length);
        }
        var rest = args.slice(length);
        if (rest.length === 0) {
            return nextFunc;
        } else {
            return nextFunc(...rest);
        }
    } else {
        return firstResult;
    }
});

var Facade = f => curring(f, f.length);

var flip = f => (b, a) => f(a, b);

var pipe = funcs => funcs.reduce((g, f) => arg => f(g(arg)));

//obj.func(...arg) to func(...arg)(obj)
var forcall = f => curring((...args) => f.call(args[f.length], ...args.slice(0, f.length)), f.length + 1);

export default Object.assign(Facade, {
    isF: hasFlag,
    flip: Facade(flip),
    pipe: Facade(pipe),
    _,
    forcall: Facade(forcall)
});
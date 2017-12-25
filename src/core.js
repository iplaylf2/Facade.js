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
    };

    nextFunc = f(...args.slice(0, l));
    if (hasFlag(nextFunc)) return nextFunc(...args.slice(l));
    else return curring(nextFunc, nextFunc.length)(...args.slice(l));
});

var Facade = f => curring(f, f.length);

var filp = f => (b, a) => f(a, b);

var pipe = funcs => funcs.reduce((g, f) => arg => f(g(arg)));

//obj.func(...arg) to func(...arg)(obj)
var forcall = func => curring((...args) => func.call(args[func.length], ...args.slice(0, func.length)), func.length + 1);

Object.assign(Facade, {
    isF: hasFlag,
    filp: Facade(filp),
    pipe: Facade(pipe),
    forcall: Facade(forcall)
});

export default Facade
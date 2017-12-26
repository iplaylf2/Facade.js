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
var forcall = f => curring((...args) => f.call(args[f.length], ...args.slice(0, f.length)), f.length + 1);

var _ = {};
//F.optional(f,_,_,arg,_,_)
var optional = (f, ...args) => curring((...rest) => {
    var i = 0, real = [];
    for (var arg of args) real.push(arg === _ ? rest[i++] : arg);
    return f(...real);
}, args.filter(arg => arg === _).length);

var argLimit = (f, count) => (...arg) => f(...arg.slice(0, count));

Object.assign(Facade, {
    isF: hasFlag,
    filp: Facade(filp),
    pipe: Facade(pipe),
    forcall: Facade(forcall),
    _,
    optional,
    argLimit
});

export default Facade
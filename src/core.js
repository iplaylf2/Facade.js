var curring = (f, l) => (...args) => {
    if (l === args.length) return f(...args);
    if (l > args.length) return curring((...rest) => f(...args.concat(rest)), l - args.length);

    var result = f(...args.slice(0, l));
    return curring(result, result.length)(...args.slice(l));
};

var Facade = f => curring(f, f.length);

var pipe = funcs => funcs.reduce((g, f) => arg => f(g(arg)));

Facade.pipe = Facade(pipe);

export { Facade, pipe }
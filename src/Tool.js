export default {
    argLimit: (f, count) => (...arg) => f(...arg.slice(0, count))
}
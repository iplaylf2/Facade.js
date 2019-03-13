export default class CurringProxy {
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
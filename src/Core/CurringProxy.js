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
                length = result.length;
                argumentSP = restArgumentSP.compress(length);
            } else {
                return result;
            }
        }
        return new CurringProxy(func, length, argumentSP).makeFunction();
    }
    makeFunction() {
        const call = this.call.bind(this);
        Object.defineProperty(call, 'length', {
            value: this.length - this.boundArgument.length
        });
        return call;
    }
}
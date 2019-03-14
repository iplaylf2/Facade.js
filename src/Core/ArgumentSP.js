export const [ArgumentSP, placeholder] = (() => {
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
            const argumentList = this.argumentList.concat(restArgument);
            const slotList = this.slotList.concat();

            const offset = this.argumentList.length;
            for (var [index, arg] of restArgument.entries()) {
                if (arg === placeholder) {
                    slotList.push(index + offset);
                }
            }

            return ArgumentSP.make({
                argumentList,
                slotList
            });
        }
        compress(expect) {
            const restArgument = this.argumentList.concat();
            const argumentList = restArgument.splice(0, expect);
            const slotList = this.slotList.filter(index => index < expect);

            var slotIndex = 0;
            for (var i = 0; i !== restArgument.length && slotList.length !== 0; i++) {
                let arg = restArgument[i];
                if (arg === placeholder) {
                    slotIndex++;
                } else {
                    argumentList[slotList.splice(slotIndex, slotIndex + 1)[0]] = arg;
                }
                if (slotIndex >= slotList.length) {
                    slotIndex = 0;
                }
            }

            const offset = argumentList.length;
            for (var [index, arg] of restArgument.slice(i, restArgument.length).entries()) {
                if (arg === placeholder) {
                    slotList.push(index + offset);
                }
                argumentList.push(arg);
            }

            return ArgumentSP.make({
                argumentList,
                slotList
            });
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
        readyLength(expect) {
            if (expect > this.argumentList.length) {
                return this.argumentList.length - this.slotList.length;
            }
            else {
                var hole = 0;
                for (var index of this.slotList) {
                    if (expect > index) {
                        hole++;
                    }
                    else {
                        break;
                    }
                }
                return expect - hole;
            }
        }
        get left() {
            return this.slotList.length === 0 ? this.argumentList.length : this.slotList[0];
        }
    }
    const placeholder = {};
    return [ArgumentSP, placeholder];
})();
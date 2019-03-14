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
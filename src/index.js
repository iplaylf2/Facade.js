import Facade from './core.js'
import operator from './Operator.js';
import ArrayS from './Array.js'

var FacadeGroup = function (obj) {
    var result = {};
    for (var key in obj) result[key] = Facade(obj[key]);
    return result;
};

export default Object.assign(Facade,
    FacadeGroup(operator),
    {
        Array: FacadeGroup(ArrayS)
    }
);
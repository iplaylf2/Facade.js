import Facade from './core'
import operator from './Operator';
import ArrayS from './Array'

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
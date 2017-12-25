import Facade from './core'

export var FacadeGroup = obj => {
    var result = {};
    for (var key in obj) result[key] = Facade(obj[key]);
    return result;
};
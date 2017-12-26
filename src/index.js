import Facade from './core'
import { FacadeGroup } from './utility'
import operator from './operator';
import ArrayS from './Array'

export default Object.assign(Facade, FacadeGroup(operator), {
    Array: FacadeGroup(ArrayS)
});
import Facade from './core'
import { FacadeGroup } from './utility'
import operator from './Operator';
import TooL from './Tool'
import ArrayS from './Array'

Object.assign(Facade, FacadeGroup(operator), {
    TooL,
    Array: FacadeGroup(ArrayS)
});
export default Facade
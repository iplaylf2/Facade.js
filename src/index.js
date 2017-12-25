import { Facade } from './core'
import { FacadeGroup } from './utility'
import ArrayS from './Array'
import operator from './Operator';
Object.assign(Facade, { Array: FacadeGroup(ArrayS) }, FacadeGroup(operator));
export default Facade
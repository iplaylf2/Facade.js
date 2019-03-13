var F = require("./facade.js");

var func1 = (a, b) => a + b;
var func2 = a => b => a + b;
var cF1 = F(func1);
var cF2 = F(func2);
console.log(cF1(1)(2) === cF2(1, 2));

var test = (a, b) => `${a},${b}`;
console.log(F.flip(test)("first", "second"));//"second,first" 

//实际上Facade提供的函数绝大多数都经过可柯里化处理↓
console.log(F.flip(test, "first", "second"));//"second,first" 
console.log(F.flip(test)("first")("second"));//"second,first" 

var test = (a, b, c) => `${a},${b},${c}`;
var { _ } = F;
console.log(F(test)(_, "mid", _)("first", "second"));//"first,mid,second"
//同样的curring↓
console.log(F(test)(_, "mid", _, "first")("second"));//"first,mid,second"
console.log(F(test)(_, "mid", _, "first", "second"));//"first,mid,second"

var test1 = a => a + 1;
var test2 = a => a * 10;
console.log(F.pipe([test1, test2])(5));//60
//同样的curring↓
console.log(F.pipe([test1, test2], 5));//60

var sub = F((a, b) => a - b);
var div = F((a, b) => a / b);
var func = F.pipe([sub(_, 1), div(100, _)]);
console.log(func(5));//25

console.log(F.forcall(String.prototype.repeat, 3)("233"))//"233233233"
//同样的curring
console.log(F.forcall(String.prototype.repeat)(3)("233"))//"233233233"
//......
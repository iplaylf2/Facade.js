# Facade.js
创作契机源自[Ramda](https://github.com/ramda/ramda) 
  
# 核心函数
  
F 对函数进行可柯里化的处理
  
``` javascript
var func1 = (a, b) => a + b;
var func2 = a => b => a + b;
var cF1 = F(func1);
var cF2 = F(func2);
cF1(1)(2) === cF2(1, 2);//true
//函数cF1和cF2在使用上会变得一样，如果是纯函数，结果也将一样。
```
  
F.flip 交换两个参数的位置 `f(a,b) → F.flip(f)(b,a)`
  
``` javascript
var test = (a, b) => `${a},${b}`;
F.flip(test)("first", "second");//"second,first" 

//实际上Facade提供的函数绝大多数都经过可柯里化处理↓
F.flip(test, "first", "second");//"second,first" 
F.flip(test)("first")("second");//"second,first" 
```

F._ 可选参数 `f(_,mid,_) → F(f)(_,mid,_)`
  
``` javascript
var test = (a, b, c) => `${a},${b},${c}`;
var { _ } = F;
F(test)(_, "mid", _)("first", "second");//"first,mid,second"
//同样的curring↓
F(test)(_, "mid", _, "first")("second");//"first,mid,second"
F(test)(_, "mid", _, "first", "second");//"first,mid,second"
//......
```
  
F.pipe 组合函数 `f(g(x)) → F.pipe([g,f])(x)`
  
``` javascript
var test1 = a => a + 1;
var test2 = a => a * 10;
F.pipe([test1, test2])(5);//60
//同样的curring↓
F.pipe([test1, test2], 5);//60
```

very cool

``` javascript
var { _ } = F;
var sub = F((a, b) => a - b);
var div = F((a, b) => a / b);
var func = F.pipe([sub(_, 1), div(100, _)]);
func(5);//25
```
  
F.forcall 对象调用函数 `obj.f(arg) → F.forcall(f,arg)(obj)`

``` javascript
F.forcall(String.prototype.repeat, 3)("233")//"233233233"
//同样的curring
F.forcall(String.prototype.repeat)(3)("233")//"233233233"
//......
```

# 其他函数
  
Facade还内置了一些可柯里化处理的函数，他们一般是JS的操作符转变过来的。  
还有的就是Array属性里的关于可枚举(Enumerable)对象的操作函数，遵循了不可变值(Immutable)的做法，操作结果将返回一个新的值而不改变原来的值。  
最后，Facade内置函数的种类和命名都尽量以JS原来内置的函数为准。
  
# 使用忠告
  
也许用这个库你可以做出很Pointfree的操作，组合出各种没有显式声明的函数。  
但我还是觉得，适当的函数声明会带来更好的效果。  
  
**本库的初衷是让我们使用JS时再增加点FP的风格，并不打算也不可能做到把JS改造成FP范式的语言。**
# Facade.js
From https://github.com/ramda/ramda  
求同存异←_←  
函数尽量采用跟JS自带的，名字也是，迁就JS程序员的使用习惯。  
使用F函数来柯里化。  
``` javascript
var func1=(a,b)=>a+b;
var func2=a=>b=>a+b;
var cF1=F(fun1);
var cF2=F(fun2);
//函数cF1和cF2在使用上会变得一样，如果是纯函数，结果也将一样。
```
新库，欢迎那个啥。
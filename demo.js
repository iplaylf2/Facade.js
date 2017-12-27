var F = require('./dest/Facade');
var basket = [
    { item: 'apples', per: .95, count: 3, cost: 2.85 },
    { item: 'peaches', per: .80, count: 2, cost: 1.60 },
    { item: 'plums', per: .55, count: 4, cost: 2.20 }
];
var { map, reduce } = F.Array;
var pluck = F.pipe([F.prop, map]);
var sum = reduce(F.add);
var totalCost = F.pipe([pluck('cost'), sum]);
var A = Array.prototype;

var prop = {
    length(enumerable) {
        return A.reduce.call(enumerable, count => count + 1, 0);
    }
};

var prototype = {
    concat(a, b) {
        return A.concat.call(a, b);
    },
    every(predicate, enumerable) {
        for (var item of enumerable)
            if (!predicate(item)) return false;
        return true;
    },
    full(content, count) { return Array(count).fill(content); },
    filter(predicate, enumerable) {
        var result = [];
        for (var item of enumerable)
            if (predicate(item)) result.push(item);
        return result;
    },
    find(predicate, enumerable) {
        for (var item of enumerable)
            if (predicate(item)) return item;
    },
    findIndex(predicate, enumerable) {
        var i = -1;
        for (var item of enumerable) {
            i++;
            if (predicate(item)) return i;
        }
        return i;
    },
    forEach(cb, enumerable) {
        for (var item of enumerable) cb(item);
    },
    includes(element, start, enumerable) {
        return A.includes.call(enumerable, element, start);
    },
    indexOf(element, start, enumerable) {
        return A.indexOf.call(enumerable, element, start);
    },
    join(separator, enumerable) {
        return A.join.call(enumerable, separator);
    },
    lastIndexOf(element, start, enumerable) {
        return A.lastIndexOf.call(enumerable, element, start);
    },
    map(cb, enumerable) {
        var result = [];
        for (var item of enumerable) result.push(cb(item));
        return result;
    },
    reduce(cb, enumerable) {
        var iterator = enumerable[Symbol.iterator](), first = iterator.next();
        if (first.done) return;

        var result = first.value;
        for (var item of iterator) result = cb(result, item);
        return result;
    },
    reduceI(cb, init, enumerable) {
        var result = init;
        for (var item of enumerable) result = cb(result, item);
        return result;
    },
    reduceRight(cb, enumerable) {
        var source = [];
        for (var item of enumerable) source.push(item);

        var iterator = source[Symbol.iterator](), first = iterator.next();
        if (first.done) return;

        var result = first.value;
        for (var item of iterator) result = cb(result, item);
        return result;
    },
    reduceRightI(cb, init, enumerable) {
        var source = [];
        for (var item of enumerable) source.push(item);

        var result = init;
        for (var item of source) result = cb(result, item);
        return result;
    },
    reverse(enumerable) {
        var result = [];
        for (var item of enumerable) result.push(item);
        return result;
    },
    slice(start, end, enumerable) {
        return A.slice.call(enumerable, start, end);
    },
    some(predicate, enumerable) {
        for (var item of enumerable)
            if (predicate(item)) return true;
        return false;
    },
    sort: function sort(enumerable) {
        var l = [], r = [], iterator = enumerable[Symbol.iterator](), first = iterator.next();
        if (first.done) return [];

        for (var item of iterator) {
            if (item < first.value) l.push(item);
            else r.push(item);
        }
        return [...sort(l), first.value, ...sort(r)];
    },
    sortC: function sort(comparer, enumerable) {
        var l = [], r = [], iterator = enumerable[Symbol.iterator](), first = iterator.next();
        if (first.done) return [];

        for (var item of iterator) {
            if (comparer(item, first.value) < 0) l.push(item);
            else r.push(item);
        }
        return [...sort(comparer, l), first.value, ...sort(comparer, r)];
    }
};

export default Object.assign({}, prop, prototype);
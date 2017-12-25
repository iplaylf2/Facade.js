var rollup = require('rollup');
rollup.rollup({
    input: 'src/index.js',
}).then(function (bundle) {
    bundle.write({
        format: 'umd',
        name: 'Facade',
        file: 'dest/Facade.js',
        globals: {
            Facade: 'F'
        }
    });
});
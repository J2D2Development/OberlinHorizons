var test = require('tape');

test('timing test', function(t) {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    t.equal(1, 1);
});
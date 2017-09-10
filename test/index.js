var test = require('tape'),
    perfparser = require('../index')

test('single line, single perfdata', t => {
    var perf = perfparser('Some status | some_label=0m;1;2;3;4')
    t.ok(perf['some_label'])
    t.equal(perf['some_label'].oum, 'm')
    t.equal(perf['some_label'].value, 0)
    t.equal(perf['some_label'].warn, 1)
    t.equal(perf['some_label'].crit, 2)
    t.equal(perf['some_label'].min, 3)
    t.equal(perf['some_label'].max, 4)
    t.end()
})

test('single line, missing values', t => {
    var perf = perfparser('Some status | some_label=0;1;2')
    t.notOk(perf['some_label'].oum)
    t.notOk(perf['some_label'].min)
    t.notOk(perf['some_label'].max)
    t.end()
})

test('single quote label', t => {
    var perf = perfparser('Some status | \'some label\'=0m;1;2;3;4')
    t.ok(perf['\'some label\''])
    t.end()
})

test('single line, multiple values', t => {
    var perf = perfparser('Some status | some_label=0m;1;2;3;4 more=1 another=2')
    t.ok(perf['some_label'])
    t.ok(perf['more'])
    t.ok(perf['another'])
    t.end()
})

test('multiline', t => {
    var perf = perfparser(`
        OK - some status msg | 'some label'=0%;1;2;3;4
        more lines of status
        fdasf
        fdsa
        last line - fgfga | another_label=100
    `)

    t.ok(perf['\'some label\''])
    t.ok(perf['another_label'])
    t.end()
})

test('Not a Number test', t => {
    var perf = perfparser('blah|test=0%;fasf;fdsa')

    t.notOk(isNaN(perf['test'].value))
    t.ok(isNaN(perf['test'].warn))
    t.ok(isNaN(perf['test'].crit))
    t.end()
})

test('Flatten option', t => {
    var perf = perfparser('Some status | some_label=0m;1;2;3;4', {
        flatten: true,
    })
    t.ok(perf instanceof Array)
    t.ok(perf[0].label = 'some_label')
    t.end()
})

test('Throw exception option', t => {
    t.throws(
        perfparser.bind(null, 'Some status | some_label=invalid', {
            throwErr: true,
        })
    )
    t.end()
})

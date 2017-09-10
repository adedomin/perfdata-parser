#!/usr/bin/env node
/*
 * Copyright (c) 2017 Anthony DeDominic <adedomin@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var path = require('path')

function removeNaN(k, v) {
    // NaN
    if (v !== v)
        return
    return v
}

function usage() {
    console.error(
        'usage: cmd | perfdata-parser [-p|--pretty] [-f|--flatten]'
    )
    process.exit(1)
}

var pretty, opt = { throwErr: true }
process.argv.slice(2).forEach(arg => {
    if (arg == '-p' || arg == '--pretty') 
        pretty = 2
    else if (arg == '-f' || arg == '--flatten') 
        opt.flatten = true
    else usage()
})

var perf = ''
process.stdin.on('data', data => {
    perf += data
})

process.stdin.on('end', () => {
    try {
        console.log(
            JSON.stringify(
                require(path.join(__dirname, '../index.js'))(perf, opt),
                removeNaN,
                pretty
            ) || null
        )
    }
    catch (e) {
        console.error(e.toString())
        process.exit(1)
    }
})

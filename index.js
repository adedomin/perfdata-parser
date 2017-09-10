/*
 * Copyright (c) 2017, Anthony DeDominic <adedomin@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = function(input, options) {
 
    if (!options) options = {}
    if (!input) return

    var perfs = ''
    // long perfdata
    input.split('\n').forEach((line) => {
        perfs += line.split('|')[1] || ''
    })
    input = perfs.trim()

    if (input == '') return

    // 'label'=value[UOM];[warn];[crit];[min];[max]
    // splits by label & values
    var perfdatas = input.split(/\s+(?=(?:[^']*['][^']*['])*[^']*$)/)

    var err = null

    var perf
    if (!options.flatten) perf = {}
    else perf = []
    perfdatas.find(perfdata => {
        perfdata = perfdata.split('=')
        var label = perfdata[0]
        if (!perfdata[1]) return err = 'invalid perfdata, no values'
        var values = perfdata[1].split(';')

        if (!values[0]) return err = 'invalid perfdata, no primary value'
        var value_oum = values[0].match(/(\d+(?:\.\d+)?)\s*(\D+)?/)
        if (!value_oum) return err = 'primary value is not a number'

        if (options.flatten) {
            perf.push({
                label,
                oum: value_oum[2],
                value: +value_oum[1],
                warn: +values[1],
                crit: +values[2],
                min: +values[3],
                max: +values[4],
            })
        }
        else {
            perf[label] = {
                oum: value_oum[2],
                value: +value_oum[1],
                warn: +values[1],
                crit: +values[2],
                min: +values[3],
                max: +values[4],
            }
        }
        return undefined
    })

    if (err) {
        if (options.throwErr)
            throw Error(err)
        return
    }
    return perf
}

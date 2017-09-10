/*
 * Copyright (c) 2016, prussian <genunrest@gmail.com>
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
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

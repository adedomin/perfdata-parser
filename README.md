perfdata-parser
===============

Not the strictest parser but handles nagios perfdata fine.

returns undefined on error

Using
-----

    var perfparser = require('perfdata-parser')

    perfparser(`OK - some status msg | 'some label'=0%;1;2;3;4
        more lines of status
        fdasf
        fdsa
        last line - fgfga | another_label=100
    `, {})

perfdata-parser now takes an optional option object with the following properties.

  * flatten  - if truthy, returns an array of objects instead, see example below.
  * throwErr - throw parsing errors instead of returning undefined.

Returns
-------

returns object with keys for each label: eg:

    'some label'=0%;1;2;3;4

becomes

    { '\'some label\'': {
            oum: '%',
            value: 0,
            warn: 1,
            crit: 2,
            min: 3,
            max: 4
        }
    }

or if the flatten option is enabled

    [{  
        label: '\'some label\'',
        oum: '%',
        value: 0,
        warn: 1,
        crit: 2,
        min: 3,
        max: 4
    }]

perfdata-parser
===============

Parses nagios perfdata into a json object.

Command Line Tool
-----------------

    # output json of a nagios plugin's perfdata
    a-nagios-plugin | perfdata-parser
    
    # using the "flatten" structure instead
    # can also use the short option -f
    a-nagios-plugin | perfdata-parser --flatten

    # pretty print of the json output
    # short option is -p
    # note you can mix and match --flatten and --pretty
    a-nagios-plugin | perfdata-parser --flatten --pretty

If there are any parsing errors the command will output the error to stderr.
Note that if there is no perfdata to parse, it returns a json object of null with no error; this will look like a string of 'null'

Javascript API Usage
---------------------

    var perfparser = require('perfdata-parser')

    perfparser(`OK - some status msg | 'some label'=0%;1;2;3;4
        more lines of status
        fdasf
        fdsa
        last line - fgfga | another_label=100
    `, { flatten: false, throwErr: false })

perfdata-parser now takes an optional option object with the following properties.

  * flatten  - if truthy, returns an array of objects instead, see example below.
  * throwErr - throw parsing errors instead of returning undefined.

Returns
-------

Returns object with keys for each label: eg:

    'some label'=0%;1;2;3;4

Becomes

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

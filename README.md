perfdata-parser
===============

Not the strictest parser but handles nagios perfdata fine.

returns undefined on error

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

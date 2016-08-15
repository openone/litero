#!/usr/bin/env node

var litero = require('./lib/litero.js'),
    argv = require('minimist')(
    process.argv.slice(2), {
        alias: {
            'h': 'help',
            'u': 'url',
            'f': 'filename',
            'e': 'format',
            'v': 'version'
        },
        default: {
            story:   true,
            verbose: false,
            series:  false,
            help:    false,
            version: false
        },
        string:  ['url', 'filename', 'format'],
        boolean: [ 'story', 'version', 'help', 'verbose']
    });

if ( argv.help || ! argv.url ) {
    return console.log(require('./lib/usage.js').usage);
}
if ( argv.version )
    return console.log( require('./package').version);

litero.getStory(argv);

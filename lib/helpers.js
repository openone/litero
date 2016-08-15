/**
 * Utility functions.
 */
var fs = require('fs');

// Repeat. =D
if ( typeof String.prototype.repeat  == 'undefined' ) {
    String.prototype.repeat = function(times) {
        return (new Array(times + 1)).join(this);
    };
}

module.exports = {
    extendO : function(orig, dupl) {
        return Object.assign({}, orig, dupl);
    },
    // Clone objects with JSON.
    cloneJ : function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    // Function : cloneO
    // Clones objects with Object.assign
    cloneO : function() {
        return ( ! arguments.length ? {} : Object.assign.apply(null, arguments) );
    }, // END Function cloneO
    // Merge Objects.
    mergeO : function( src, cop ) {
        var temp = {};
        for (var attrn in src) { temp[attrn] = src[attrn]; }
        for (var attrn2 in cop) { temp[attrn2] = cop[attrn2]; }
        return temp;
    },
    // Write a file using stream.
    writeFS: function (data, localFileName, finish) {
        if (!wStream) var wStream = fs.createWriteStream(localFileName);
        wStream.write(data);
        if (finish)
            wStream.end();
    },
    // Save a file to local file system.
    saveToFile: function (data, filename) {
        fs.writeFile(filename, data, function (err) {
            if (err) {
                console.log( 'Following error occurred while attempting to write the file.\n' );
                return console.log(err);
            }
            console.log('\nFile was written to *' + filename + '*');
        });

    },
    // Extends a class. To be removed.
    extend: function (ChildClass, ParentClass) {
        ChildClass.prototype = new ParentClass();
        ChildClass.prototype.constructor = ChildClass;
    },
    // Multiple replace
    replaceAll: function (str, repl) {
        var  regex = new RegExp(Object.keys(repl).join('|'), 'gi');
        return str.replace(regex,
            function (matched) {
                return repl[matched.toLowerCase()];
            });
    },
    
    // Function : ireplaceAll
    // Replaces all, but case-insensitive
    ireplaceAll : function(str, repl) {
        var  regex = new RegExp(Object.keys(repl).join('|'), 'g');
        return str.replace(regex, function (matched) {
            return repl[matched];
        });
    }, // END Function ireplaceAll
    genHash: function (s) {
        return s.split('').reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    },
    // Function : getDateTimef
    // Gets nicely formatted Date and time nicely.
    getDateTimef : function(format, d) {
        format = format || 'DD/MM/YYYY hh:mm:ss:ll AA';
        if ( ! d || d.constructor.name !== 'Date' ) d = new Date();

        var fArr = format.replace(/[^\w]/g, ' ' ).split(' '),
            hrs = d.getHours(),
            ampm = hrs > 12 ? 'PM' : 'AM',
            // Time Lord strings.
            repl = {
                'HH' : this.padString(hrs, 2),
                'hh' : this.padString(hrs % 12,2),
                'mm' : this.padString(d.getMinutes(),2),
                'ss' : this.padString(d.getSeconds(),2),
                'll' : this.padString(d.getMilliseconds(), 3),
                'DD' : this.padString(d.getDate(), 2),
                'MM' : this.padString(d.getMonth() + 1, 2),
                'YYYY' : d.getFullYear(),
                // 'YY' : d.getFullYear().toString().substr(-2),
                'AA' : ampm,
                'aa' : ampm.toLowerCase()
            };
        repl['dd'] = repl['DD'];
        repl['ii'] = repl['mm'];
        // Replace the format string.
        for(var k = 0; k < fArr.length; k++) {
            if ( typeof repl[fArr[k]] != 'undefined' )
                format = format.replace(fArr[k], repl[fArr[k]]);
        }
        return format;
    }, // END Function getDateTimef
    
    // Function : padString
    // Pads a string with supplied character or 0
    padString : function(str,len,padchar) {
        padchar = padchar || '0';
        str = str.toString();
        return ( str.length < len ) ? padchar.repeat(len - str.length) + str : str;
    }// END Function padString
};

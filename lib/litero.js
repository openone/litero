var fs = require('fs'),
    https = require('https'),
    cheerio = require('cheerio'),
    helpers = require('./helpers'),
    path = require('path'),
    ura = require('unique-random-array')(require('./useragents'));


/*
 * Litero(tica)
 */
function litero() {
    // nothing to see here.
} // END function litero


/*
 * Litero prototype
 */
litero.prototype = function () {

    // Exposed is exposed. Inner is private.
    var exposed = {
            txtTemplate: '%title%%posttitle%%author%%precontent%%content%%postcontent%%footer%',
            story: {}
        },
        // Inner object.
        inner = {
            story: {
                title: null,
                url: null,
                author: null,
                authorURL: null,
                totalPages: null,
                // pages: [],
                pages: null,
                format: 'txt',
                request: {
                    path: null,
                    host: null,
                    page: null,
                    headers: {
                        // TODO : remove random UA.
                        'User-Agent': ura()
                    } // end headers
                } // end request.
            } // end inner.story
        }; // end inner.


    // Clone the object.
    exposed.story = Object.assign({}, inner.story);

    /*
     * Validate arguments incl. url and format.
     *
     * @param options object passed to getStory
     * @param callback optional callback to fire upon validation.
     */
    inner.validate = function (options, callback) {
        var url, story;
        story = exposed.story;

        if (typeof options.url == 'undefined')
            return console.log(exposed.getStoryUsage('No URL Provided!'));

        story.url = options.url;

        url = /^(?:https?\:\/\/)?(?:w{3}\.)?(?:i\.)?(literotica\.com)(\/s(?:tories)?\/(?:showstory\.php\?(?:url|id)=)?([a-z-0-9]+))$/.exec(story.url);

        if (url) {
            story.request = story.request || {};
            story.request.path = url[2];
            story.request.host = url[1];

            story.filename = story.filename || url[3];

            // TODO : story.name might be needed for Hash.
            // story.name = url[ 2 ].split('/').pop();
            story.filename = (story.filename || url[2].split('/').pop()) + '.' + story.format;

            // Check if format is valid.
            if (typeof exposed['output' + story.format] == 'undefined' && ['html','txt'].indexOf(exposed.story.format) < 0)
                return console.log(exposed.getStoryUsage('Unknown Format provided in the arguments.'));

            ( ! exposed.story.verbose ) || exposed.info( 'Getting story from ' + story.url ); 

            // Callback if valid.
            if (typeof callback == 'function')
                callback.call(this);
        }
        else {
            return console.log(exposed.getStoryUsage('URL Provided was invalid.'));
        }
    }; // END function inner.validate


    // Function : exposed.info
    // Function Description
    exposed.info = function(info) {
        console.log(helpers.getDateTimef() + ' - ' +  info);
    }; // END Function exposed.info


    /*
     * Get the story.
     *
     * @param options  Object with URL, filename, format etc.
     */
    exposed.getStory = function (options) {
        if (!arguments.length)
            return console.log(exposed.getStoryUsage('No arguments Provided!'));

        // Assume options is always an object.
        // Assume an URL if string is provided.
        if (typeof options == 'string')
            options = {
                url: options
            };

        exposed.story = Object.assign({}, exposed.story, options,
            (arguments.length > 1 && typeof arguments[1] == 'object') ?
            arguments[1] : {});

        // Validate and initiate the HTTP request.
        inner.validate.call(this, options, function () {
            ( ! exposed.story.verbose ) || exposed.info('Requesting page - 1');
            https.get(exposed.story.request, inner.httpCallback.bind(null, this));
        });
    }; // END function getStory

    /*
     * Callback for the HTTPS request.
     */
    inner.httpCallback = function (ind, resp) {
        var str = '', $;

        ind = (typeof ind == 'number') ? ind : 1;

        resp.on('data', function (d) {
            str += d;
        })
        .on('end', function () {
            // Load the content into DOM.
            $ = cheerio.load(str);

            if (exposed.story.totalPages == null) exposed.firstPage = true;

            // See if this story has more than 1 page.
            exposed.story.totalPages = exposed.story.totalPages || $('.b-pager-pages select option').length;

            if (exposed.story.totalPages && exposed.firstPage == 1) {

                ( ! exposed.story.verbose ) || exposed.info( 'This story has totally ' + exposed.story.totalPages + ' Pages' );
                
                // Make exp.sto.pages an array. It's string for one page.
                if (!exposed.story.pages) {
                    // Pre allot a new array.
                    exposed.story.pages = new Array(exposed.story.totalPages);
                    var i = 0;
                    while (i < exposed.story.totalPages) {
                        exposed.story.pages[i] = 0;
                        i++;
                    }
                }

                // Manually count the finished pages.
                exposed.story.pagesDone = 0;

                // So, now, there are multiple pages.
                var request_path = exposed.story.request.path;

                for (var k=2; k <= exposed.story.totalPages; k++) {
                // for (var k = exposed.story.totalPages; k > 1; k--) {
                    // Modify the Path to get subsequent pages.
                    exposed.story.request['path'] = request_path + '?page=' + k;

                    ( ! exposed.story.verbose ) || exposed.info('Requesting page - ' + k );
                    
                    // Get the page as usual, pass an additional arg - page number(k)
                    https.get(exposed.story.request, inner.httpCallback.bind(null, k));
                } // For var k..
                
                // First page done.
                exposed.firstPage = false;
            } // Check if ( this.story.totalPage....

            // Process the content and prepare the story object.
            inner.processStory($, ind);
        })
        .on('error', function (e) {
            ( ! exposed.story.verbose ) || exposed.info('Error getting the story. Well, that sucks. Please try again later.');
            console.log(e);
        });
    }; // END function inner.httpCallback


    /*
     * Process the story
     */
    inner.processStory = function ($, ind) {

        if (ind == 1) {
            // Populating the story object
            exposed.story.title = exposed.story.title || $('.b-story-header h1').text();
            exposed.story.author = exposed.story.author || $('.b-story-user-y').eq(0).children().eq(1).text();
            exposed.story.authorURL = exposed.story.authorURL || $('.b-story-user-y').eq(0).children().eq(1).attr('href');
        }

        // Incrementing is necessary with Array preallocated.
        exposed.story.pagesDone++;

        ( ! exposed.story.verbose ) || exposed.info('Got page ' + ind + '; Total pages done so far : ' + (exposed.story.pagesDone || 1 ));
        
        // FIX
        if (!exposed.story.pages)
            exposed.story.pages = $('.b-story-body-x p').text();
        else
            exposed.story.pages[ind - 1] = $('.b-story-body-x p').text();

        if (exposed.story.pagesDone >= exposed.story.totalPages || !exposed.story.totalPages) {

            ( ! exposed.story.verbose ) || exposed.info('Finished downloading all ' + exposed.story.totalPages + ' pages.');
            
            // TODO merge with output
            inner.output(exposed.story.format);

        } // END Finished check.
    }; // END function inner.processStory


    /*
     * Output to a file or stream.
     */
    inner.output = function (format) {
        format = format || exposed.story.format;
        var sep = (exposed.story.format == 'html') ?
            (!exposed.story.nobr ? '<br />' : '</p><p>') :
            '\n',
            content = '',
            templ = '',
            repl = {};

        if (typeof exposed.story.pages == 'object') {
            for (var i = 0; i < exposed.story.pages.length; i++) {
                if (i > 0) content += sep + 'Page ' + (i + 1) + sep + '-'.repeat(10) + sep;
                content += exposed.story.pages[i];
            } // Content is ready..
        }
        else {
            content = exposed.story.pages;
        }

        if (exposed.story.format == 'html')
            content = content.replace(/(?:\r\n|\r|\n)/g, sep);

        // Run the output function if available.
        // FIX Redundant check.
        if (typeof exposed['output' + exposed.story.format] != 'undefined')
            return exposed['output' + exposed.story.format](exposed.story);

        ( ! exposed.story.verbose ) || exposed.info('Attempting to write the story "' + exposed.story.title + '" as ' + exposed.story.filename );
        // OR Output HTML or txt.
        if (exposed.story.format == 'html') {
            try {
                templ = fs.readFileSync(path.resolve(__dirname, 'htmltemplate.html')).toString();
            }
            catch (err) {
                console.error('Error sourcing the HTML Template : \n' + err);
                console.info('\nPlease make sure "' + path.basename(__filename, path.extname(__filename)) + '" is properly installed.\n');
                return;
            }
        }
        else {
            templ = exposed.txtTemplate;
        }

        repl = {
            '%title%': exposed.story.title,
            '%posttitle%': sep + ((format == 'html') ? '' : '-'.repeat(exposed.story.title.length)) + sep,
            '%author%': (format == 'html') ? 'by <a href="http://www.nullrefer.com?' + exposed.story.authorURL + '">' + exposed.story.author + '</a> \u00A9' : ' \u00A9 by ' + exposed.story.author,
            '%precontent%': (format == 'html') ? '' : '\n\n',
            '%content%': content,
            '%postcontent%': (format == 'html') ? '' : sep + '-'.repeat(exposed.story.title.length) + sep,
            '%footer%': (format == 'html') ? 'Copyright  \u00A9 ' + exposed.story.author + '<br/> Downloaded from <a href="http://www.nullrefer.com?' + exposed.story.url + '">' + exposed.story.url + '</a>' : '\nStory Downloaded from ' + exposed.story.url
        };

        templ = helpers.replaceAll(templ, repl);
        
        // Write to the file.
        if (typeof exposed.story.stream != 'undefined') {
            ( ! exposed.story.verbose ) || exposed.info('The option stream was provided, streaming ~~~~~~~~~');
            console.log(templ);
        }
        else {
            // Save the file.
            helpers.saveToFile(templ, exposed.story.filename);
        }


    }; // END function inner.output

    /*
     * Usage for getStory function.
     */
    exposed.getStoryUsage = function (err) {
        err = (typeof err == 'undefined') ? '' : 'Error : ' + err + '\n\n';
        err += 'Usage:\n';
        err += '='.repeat(7) + '\n';
        err += 'Requires a valid Literotica story URL passed as a string or Javascript object.\n\n';
        
        err += 'instanceName = new litero();\n';
        err += 'URL     : instanceName.getStory("https://literotica.com/s/how-to-write-for-literotica")\n';
        err += 'Object  : instanceName.getStory({ url : "https://literotica.com/s/how-to-write-for-literotica"})\n';
        err += 'Object  : instanceName.getStory({ url : "https://literotica.com/s/how-to-write-for-literotica", filename : "writing-stories-litero", format : "html" })\n';

        return err;
    }; // END function getStoryUsage


    // Expose the object.
    return exposed;
}(); // END function litero.prototype

module.exports = new litero();

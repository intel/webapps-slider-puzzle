# INITIAL SET UP

To run the build, you'll need to install some node modules.
Run the following in the top-level directory of the project:

    npm install

grunt requires that you install grunt-cli globally
to be able to use grunt from the command line. To install
grunt-cli do:

    npm install -g grunt-cli

You should then install the client-side dependencies into app/lib/:

  npm install -g bower
  bower install

    npm install -g mocha

Note that if you want to install the application to a Tizen device
as a wgt file, you will also need to install the sdb tool first.
This is available for various platforms from
http://download.tizen.org/tools/latest-release/.

Configure your package manager to use the appropriate repo from the
ones available and install sdb, e.g. for Fedora 17:

    $ REPO=http://download.tizen.org/tools/latest-release/Fedora_17/tools.repo
    $ sudo yum-config-manager --add-repo $REPO
    $ sudo yum install sdb

Note that you should then edit the build.json file to point to your
sdb binary: set the sdbCmd property as the path to your sdb command
(or just sdb if it is in your path).

Also note that if you want to use the sdb:dumplocalstorage task, you
will need a very recent version of sdb with support for the "sdb root on"
command (e.g. the tizen_2.0 branch). All of the other sdb:* tasks
work with older versions of sdb, however.

# WHERE'S THE APP?

There are a few options for running the application:

*   Open app/index.html in a browser (there's no requirement to
    run a build before you can run the app).

*   Serve the app from a standard web server. First, run:

        grunt server-build

    Then copy the content of the build/server/ directory to a web folder
    for your server (e.g. an Apache htdocs directory).

*   Run the app using the built-in local server:

        grunt server

    This builds the dist version of the app and runs it on a server
    accessible at http://localhost:30303/. This is useful for testing the
    app in a mobile device: just navigate to the server hosting
    the app, using the phone's browser.

*   Install/reinstall to an attached Tizen device via sdb by running:

        grunt wgt-install

    This installs an optimised version of the app (minified HTML,
    minified and concatenated CSS and JS). Also note that this
    will strip all script and stylesheet tags out of HTML files,
    replacing them with references to a single minified script file
    and a single minified CSS file.

*   Install a version of the app without minification or
    concatenation with:

        grunt sdk-install

    This can be useful for debugging on a device.

*   Build the files for the Chrome extension with:

        grunt crx

    then load the build/crx directory as an unpacked extension in Chrome
    developer mode. (The build can't currently make full .crx packages.)

    NOTE: any inline scripts in the index.html file will be stripped
    out by this build, as they are not allowed in Chrome extensions.

# RUNNING TESTS

Run the unit tests with:

    grunt test

# AMD MODULES

AMD modules are used throughout the application. Any new code should
be added in the form of AMD modules where possible (see later for
details).

For deployment, the r.js tool is used to minify all of the JS (from
app/js and app/lib) into a single file.

See Gruntfile.js for more details of how this works.

# CACHING AND HOW TO BYPASS IT

To use the app in no-cache mode (so the browser doesn't cache
any JS files), open:

    index.html?nocache

This stops requirejs using cached copies of js files so you get
the most recent js each time you refresh the browser.

To use in normal (caching) mode, open:

    index.html

NB no-cache mode cannot be used if the app is running from a build
(e.g. code generated and put into build/server/, which is what the
simple_server task serves).

The code which looks for this URL argument is in the require configuration
file, app/js/amd-config.js.

# PACKAGING

The application can be packaged into a wgt (zip) file using the grunt
command:

    grunt wgt

This will generate a package in the build/ directory.

It can also be packaged into an SDK wgt file (with uncompressed JS,
CSS, and HTML) using:

    grunt sdk

Note that in both cases, the files comprising the packages are
first copied into the build/wgt and build/sdk directories respectively.

To create packages for Android use the 'apk' target:

    grunt apk

This will first build an 'xpk' target and then package two apks in
build/ named AppName_{x86,arm}.apk.
You can then install the appropriate one to your device as usual -
for example, ```adb install -r build/AppName_x86.apk```.
There are also targets to create packages just for a single architecture. They require the 'xpk' target to be build previously :

    grunt xpk
    grunt crosswalk:x86

or :

    grunt xpk
    grunt crosswalk:arm

Packaging for Android requires some set up - please see
[crosswalk-apk-generator README.md](https://github.com/crosswalk-project/crosswalk-apk-generator/blob/master/README.md#pre-requisites).

# USING AND ADDING TO THE APPLICATION

The convention is to put files in the following locations:

*   HTML files go in app/templates/ with .html suffixes (NB only HTML
    fragments should be used, and loaded by their corresponding page)
*   dustjs templates go in app/templates/ with .dust suffixes
*   JS files go in app/js/ (see later for detailed instructions for adding
    AMD modules)
*   CSS files go in app/css/
*   image files go in app/images/
*   data files go in app/data/ (e.g. JSON files; note that these
    aren't minified but potentially could be)
*   Any Chrome-specific files under packages/crx and Tizen-specific
    files under packages/wgt. See below for more details.
*   3rd party libraries should be added using bower. See below for
    more details.

If you want to add assets which are common to all distributions, you can
use the app/fonts/ and app/audio/ directories which aren't touched by
the minifiers.

If you need to add other types of assets, you'll need to add a new
directory under app/ and tell the build to include it with the
distributed assets. The usual approach is:

*   Modify build.json to tell the build where the new type of asset is.
*   Modify tools/grunt-config-loader.js to expand the paths for the new
    assets.
*   Modify Gruntfile.js, inside the copy:common task, to include the
    asset in the list of those copied without modification for all builds.

Note that you should add or change paths by modifying build.json, rather
than hacking around in Gruntfile.js. If you want to do this, have a look at
build.json and tools/grunt-config-loader.js. (The idea of this tool is to
externalise path specifications so that the build can still optimise
the project without you having to modify the Gruntfile.js directly.)

# PLATFORM-SPECIFIC FILES

Files specific to Tizen and Chrome are in the platforms/ directory.

Note that the metadata is not maintained automatically between
formats, so changes to version numbers, descriptions etc. will have
to be made in config.xml and manifest.json files (as well as in
the top level package.json file).

Any extra files to be included for Tizen-only or Chrome-only should
go in the appropriate subdirectory under platforms/.

# ADDING 3RD PARTY LIBRARIES

bower should be used to add extra 3rd party libraries to the project,
e.g. to include async:

    bower install async

The library will be copied into the app/lib/ directory (the .bowerrc
configuration file governs where libraries go).

Then you need a couple more steps to integrate the library:

*   Modify app/js/amd-config.js, adding the path to the new library
    and any required shim config.
*   Modify build.json, editing the libs property to include the new
    library.

For example, for async, amd-config.js could be modified as follows:

    paths: {
      // ... existing paths ...
      async: '../lib/async/async'
    },
    shim : {
      // ... existing shims ...
      'async': {
        'exports': 'async'
      }
    }

And the libs property in build.json extended as follows:

    "libs": [
      ... other libs ...
      { "cwd": "app", "src": ["lib/async/async.js"] }
    ]

# ADDING YOUR OWN AMD MODULES

When using require in your own code, paths to modules should be
relative to the ./app/js/ directory. So, for example, imagine you're
defining a new module app/js/newmodule.js, which depends on
the module in app/js/mymodule.js. To load the dependency in
app/js/newmodule.js, you'd do this:

    // NB 'mymodule' is the path to app/js/mymodule.js, relative to app/js
    define(['mymodule'], function (MyModule) {
      var newmodule = {
        /*
           DEFINE NewModule HERE;
           in your definition of newmodule, you can make use
           of the MyModule dependency
        */
      };

      return NewModule;
    });

# "BEST" PRACTICE

Some of the practices used in this application are not necessarily
appropriate for applications served on the open web.

Here are some examples of the differences between best practice
for this type of application (as we perceive it) and best practice for
generic web applications:

*   The JavaScript and CSS files for this app are minified and
    concatenated into two files, one for JavaScript and one for CSS.
    This is because we ran some performance tests which indicated that
    a single minified JS file loads faster in Tizen than multiple
    minified JS files, where the resources are already on the
    filesystem. In the case of Tizen web apps and Chrome extensions,
    all the resources are locally available, and loading is fast.

    It is possible to run the application without concatenation or
    minification, but the performance will suffer, especially on
    Tizen mobile devices.

    In situations where resources are being loaded over a network
    connection, a better strategy may be to load JavaScript/CSS for
    each page at the point when it is needed. Minifying JavaScript and
    CSS would still be a valid strategy here, but concatenation
    might be less appropriate.

*   The HTML for the front page is initially hidden, then revealed at
    the point where scaling has been applied. This is to avoid a
    "flash of unstyled content", where the user sees the page
    in the incorrect position and it "flashes" to its correct
    placement (centered in the window).

    Where files are local, it is acceptable to hide content this way,
    as rendering is very fast and resources are loaded very quickly,
    because files are local (the total page load time is under a second).

    On an open website, this approach may be less appropriate, as
    a user may see any empty page for a few seconds while resources
    load and enhancements are applied. In that environment, it may be
    better to show a loading page or spinner.

*   We lock the application to landscape orientation with a size of
    1024x640, and scale that area to the size of the device's screen
    or the browser window.

    For web applications which are going to be generally accessible
    via browsers, or across many form factors, a responsive design is
    likely to be more appropriate.

*   We only target recent Firefox and WebKit-based browsers. The
    application is heavily reliant on JavaScript and modern CSS features,
    with no fallbacks or feature detection. Much of its functionality
    will be broken in older browsers.

    Again, this is not an appropriate approach for applications on
    the open web. Graceful degradation, progressive enhancement etc.
    should be applied in that context.

# GUIDE FOR MS WINDOWS USERS AND TIZEN IDE

Here are some steps to help people wishing to generate code for use in the Tizen IDE on Microsoft Windows.

1. install git
1. get admin shell
1. click start
1. in ‘search’ type ‘command’ - don’t hit return/enter
1. ‘command prompt’ appears under ‘programs’ - right click on it and select ‘run as administrator’ - click ‘yes’ if it asks for confirmation
1. install grunt - type ‘npm install -g grunt’
1. install bower - type ‘npm install -g bower’
1. close admin shell
1. right click on desktop and select ‘git bash’
1. change directory to where you want your projects to go (or don’t, if Desktop is ok)
1. clone the repository, eg ‘git clone https://github.com/01org/webapps-annex.git’
1. cd webapps-annex
1. npm install
1. bower install
1. grunt sdk
1. the project is now built in build/sdk and can be imported into the IDE
1. launch Tizen IDE
1. File->New->Tizen Web Project
1. select all the files in the project and delete them
1. File->Import…->General->File System Next
1. “From directory” <- the build/sdk directory
1. “Into folder” <- the project you created in the IDE
1. Finish

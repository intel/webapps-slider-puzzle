# INTRODUCTION

This is a Tizen/Chrome/Firefox slider puzzle app.

It has been tested on the following browsers/platforms:

* Firefox 22.0b3 on Linux
* Google Chrome 27.0.1453.12-dev on Linux
* Tizen 2.1 web runtime

It is unlikely to run properly on old browsers, as it makes extensive
use of CSS3 features (flexible box model, animations, transitions etc.).

See HACKING.md for more details about how to use and extend this project.

# DEPENDENCIES

Run-time dependencies (note that these are installed using bower and
not distributed with the project):

*   dustjs-linkedin (MIT licence)
    http://linkedin.github.io/dustjs/
*   fastclick (MIT licence)
    https://github.com/ftlabs/fastclick
*   hammerjs (MIT licence)
    http://eightmedia.github.io/hammer.js/
*   lodash (MIT licence)
    http://lodash.com/
*   Q (MIT licence)
    http://documentup.com/kriskowal/q/
*   requirejs + requirejs-domready + requirejs-text + requirejs-i18n
    (new BSD/MIT licence)
    http://requirejs.org/
*   rye (MIT licence)
    http://ryejs.com/
*   stapes (MIT licence)
    http://hay.github.io/stapes/

Build-time dependencies are detailed in the package.json file.
These are installed using npm and not distributed with the application.

# FONTS

This project uses the following font:

*   Graduate
    Author: Eduardo Tunni
    Licence: SIL 1.1 (http://scripts.sil.org/OFL)
    Homepage: http://www.tipo.net.ar/

icons.woff was created using fontello.com and incorporates icons from
the following fonts:

*   Elusive
    Author: Aristeides Stathopoulos
    Licence: SIL (http://scripts.sil.org/OFL)
    Homepage: http://aristeides.com/

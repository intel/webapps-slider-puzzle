# INTRODUCTION
This is a Tizen/Chrome/Firefox slider puzzle app.

It has been tested on the following browsers/platforms:
* Tizen/WRT
* Tizen/Crosswalk
* Android/Crosswalk
* Tizen IDE
* Chrome/file
* Chrome/extension
* Firefox 22.0b3 on Linux

It is unlikely to run properly on old browsers, as it makes extensive
use of CSS3 features (flexible box model, animations, transitions etc.).

This application is distributed under [Apache2.0](http://www.apache.org/licenses/LICENSE-2.0.html) license.

See [HACKING.md](https://github.com/01org/webapps-slider-puzzle/blob/master/HACKING.md) for more details about how to use and extend this project.

# AUTHORS
* Author: Elliot Smith, Intel (https://github.com/townxelliot)
* Original version: Sirisha Muppavarapu and Todd Brandt (Intel)

# DEPENDENCIES
Run-time dependencies (note that these are installed using bower and not distributed with the project):

* dustjs-linkedin (MIT licence)<br/>
  http://linkedin.github.io/dustjs/
* fastclick (MIT licence)<br/>
  https://github.com/ftlabs/fastclick
* hammerjs (MIT licence)<br/>
  http://eightmedia.github.io/hammer.js/
* lodash (MIT licence)<br/>
  http://lodash.com/
* Q (MIT licence)<br/>
  http://documentup.com/kriskowal/q/
* requirejs + requirejs-domready + requirejs-text + requirejs-i18n<br/>
  (new BSD/MIT licence)<br/>
  http://requirejs.org/
* rye (MIT licence)<br/>
  http://ryejs.com/
* stapes (MIT licence)<br/>
  http://hay.github.io/stapes/

Build-time dependencies are detailed in the package.json file.<br/>
These are installed using npm and not distributed with the application.

# FONTS
This project uses the following fonts:

* Graduate<br/>
Author: Eduardo Tunni<br/>
Licence: SIL 1.1 (http://scripts.sil.org/OFL)<br/>
Homepage: http://www.tipo.net.ar/

icons.woff was created using fontello.com and incorporates icons from
the following fonts:

* Elusive<br/>
Author: Aristeides Stathopoulos<br/>
Licence: SIL (http://scripts.sil.org/OFL)<br/>
Homepage: http://aristeides.com/

# IMAGES
All images are created by Intel Corp.<br/>
They are licensed under the Creative Commons Attribution 3.0 license.<br/>
http://creativecommons.org/licenses/by/3.0/us/

# SOUNDS
Credits for the sounds in the `app/audio` directory are as follows:

* shuffle.ogg<br/>
  Source: http://www.freesound.org/people/thereelfryboy/sounds/35022/<br/>
  Licence: http://creativecommons.org/licenses/sampling+/1.0/
* win.ogg<br/>
  Source: Intel Corporation Ltd.<br/>
  Licence: CC-BY (http://creativecommons.org/licenses/by/3.0/us/)

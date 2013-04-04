Slider puzzle application, implemented in HTML5/JavaScript

Owner: Sirisha Muppavarapu <sirisha.muppavarapu@intel.com>

Technical Deatils: This application is written using
HTML5/CSS3/jQuery and is distributed under the Apache2.0 licence.

# BUILD FOR TIZEN

To build a deployable Tizen package, you will need Linux,
node and grunt. Once these are installed, follow these steps:

1. Install build-time dependencies with: <code>npm install .</code>
2. Create the package by running: <code>grunt pkg</code>

The package is built in the <em>build/</em> directory. You can deploy
this package manually using <code>sdb</code>.

Alternatively, use the deployment script <code>deploy.sh</code>
to build the package and deploy it to an attached Tizen device.

# PHOTOS

Photos for the slider puzzle are taken from Flickr.
Photo credits (all licensed under creative commons 2.0):

* mccun934-pumpkin-patch.jpg by Mike McCune (mccun934)
* StuSeeger-elephant-mother-child.jpg by Stuart Seeger (StuSeeger)
* ktylerconk-water-lily.jpg by Kathleen Tyler Conklin (ktylerconk)
* Ian_Sane-zoo-lion.jpg by Ian Sane (Ian_Sane)
* Ian_Sane-railroad-bridge.jpg by Ian Sane (Ian_Sane)
* Ian_Sane-forest-waterfall.jpg by Ian Sane (Ian_Sane)
* Ian_Sane-brick-wall.jpg by Ian Sane (Ian_Sane)
* Ian_Sane-red-wall.jpg by Ian Sane (Ian_Sane)
* mccun934-leaf-water.jpg by Mike McCune (mccun934)
* kennymatic-rocky-beach.jpg by Kenny Louie (kennymatic)
* Ralphman-train-station.jpg by Ralphman (Ralphman)
* JonoMueller-dirty-truck.jpg by Jonathan Mueller (JonoMueller)
* Mason_Masteka-purple-carrots.jpg by Mason Masteka (Mason_Masteka)
* StuSeeger-fair-ride.jpg by Stuart Seeger (StuSeeger)
* pdxjeff-ferris-wheel.jpg by Jeff Muceus (pdxjeff)
* Sideonecincy-bald-eagle.jpg by Chris Miller (Sideonecincy)
* Thomas_Good-zoo-tiger.jpg by Tom Good (Thomas_Good)
* sam_churchill-daylight-train.jpg by Sam Churchill (sam_churchill)
* Puerto_Rico_Vega_Baja_by_Ricardo_Mangual.jpg by Ricardo Mangual (RicymarFineArt)
* Tso_Moriri_Lake_by_Prabhu_B_Doss.jpg by Prabhu B Doss (Prabhu B Doss)

# SOUNDS

These files were created by Intel Corp. and are licensed under the Creative Commons Attribution 3.0 license http://creativecommons.org/licenses/by/3.0/us/

* ButtonClick_01_Start.ogg<br>
  Source: http://www.freesound.org/people/Bram/sounds/7127/<br>
  License: CC BY 3.0
* ButtonClick_02_Settings.ogg<br>
  Source: http://www.freesound.org/people/vitriolix/sounds/778/<br>
  License: http://creativecommons.org/licenses/sampling+/1.0/
* Shuffle.ogg<br>
  Source: http://www.freesound.org/people/thereelfryboy/sounds/35022/<br>
  License: http://creativecommons.org/licenses/sampling+/1.0/
* Intro.ogg
* MovePiece.ogg
* Win.ogg
* cheer.ogg

# IMAGES

All images in the images/ folder (excluding images/puzzle_photos/*) are
created by Intel Corp. They are licensed under the Creative Commons
Attribution 3.0 license: http://creativecommons.org/licenses/by/3.0/us/

These images are a part of jquery-ui:

* images/ajax-loader-transparent.png<br>
  Origin: http://jqueryui.com/<br>
  License: http://jquery.org/license/

# FONTS

* FugazOne-Regular.ttf<br>
  License:  SIL Open Font License, 1.1<br>
  License link: http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL<br>
  http://www.google.com/webfonts/specimen/Fugaz+One

* Lato-LightItalic.ttf<br>
  Copyright [c] 2010-2011 by tyPoland Lukasz Dziedzic with Reserved Font Name "Lato".<br>
  License: Licensed under the SIL Open Font License, V<br>
  http://www.ffonts.net/Lato-Light-Italic.font

* Molot.woff (converted from original otf file)<br>
  Author: Jovanny Lemonad<br>
  License: Freeware Free<br>
  http://www.fonts4free.net/molot-font.html

# LIBRARIES

* jQuery library [MIT license]<br>
  Origin: http://jquery.org/<br>
  License: http://jquery.org/license/

* iScroll Lite [MIT license]<br>
  Origin: https://github.com/cubiq/iscroll/<br>
  License: https://github.com/cubiq/iscroll/blob/master/license.txt

At build time, the following node libraries are used
(but not distributed with this application):

* grunt
* grunt-contrib-cssmin
* grunt-contrib-uglify
* grunt-contrib-copy
* grunt-contrib-clean
* async
* node-native-zip

You can find out more about these libraries via <code>npm search</code>.

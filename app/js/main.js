/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
require(['page-loader', 'fastclick', 'domReady!'], function (pageLoader, Fastclick) {
  'use strict';

  console.log('app loaded');

  // height and width of the page-container element; note that these
  // are set in CSS so we can do that once here
  var container = document.querySelector('.page-container');
  var computedStyles = window.getComputedStyle(container);
  var containerWidth = parseInt(computedStyles.width.replace('px', ''), 10);
  var containerHeight = parseInt(computedStyles.height.replace('px', ''), 10);
  var containerStyle = container.style;

  // resize page so that it fills it either horizontally or vertically
  var scale = function () {
    // available height and width
    var availableWidth = document.documentElement.clientWidth;
    var availableHeight = document.documentElement.clientHeight;

    // work out ratio of available height to container height,
    // and the same for width
    var scaleWidth = availableWidth / containerWidth;
    var scaleHeight = availableHeight / containerHeight;

    // use a single scaling value for both width and height:
    // whichever is smaller, vertical or horizontal scale
    var scaleBoth = scaleWidth;
    if (scaleHeight < scaleWidth) {
      scaleBoth = scaleHeight;
    }

    var scaleTransform = 'scale(' + scaleBoth + ',' + scaleBoth + ')';

    var left = (availableWidth - (containerWidth * scaleBoth)) / 2;
    left = parseInt(left * (1 / scaleBoth));

    var top = (availableHeight - (containerHeight * scaleBoth)) / 2;
    top = parseInt(top * (1 / scaleBoth));

    var translateTransform = 'translate(' + left + 'px, ' + top + 'px)';

    containerStyle['-webkit-transform'] = scaleTransform + ' ' +
                                          translateTransform;
    containerStyle['transform'] = scaleTransform + ' ' +
                                  translateTransform;
    containerStyle.position = 'absolute';

  };

  Fastclick.attach(document.body);

  window.onresize = scale;
  window.addEventListener('orientationchange', scale);

  scale();

  // lock orientation
  if (screen.lockOrientation) {
    screen.lockOrientation('landscape');
  }

  pageLoader.open('home');
});

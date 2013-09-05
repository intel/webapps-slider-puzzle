/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
require(
['page-loader', 'fastclick', 'scale', 'domReady!'],
function (pageLoader, Fastclick, scale) {
  'use strict';

  console.log('app loaded');

  Fastclick.attach(document.body);

  // 640 is the width at which the pseudo landscape is applied
  // (i.e. once the width of the client is <= 640px)
  scale(document.querySelector('.page-container'), 640);

  pageLoader.open('home');
});

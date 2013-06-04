/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['lodash', 'page-loader'], function (_, pageLoader) {
  'use strict';

  // use the page loader to open or popup another page
  // data: pagename and params properties; pagename is the name of
  // the page to open or popup; params is a key/value pair object
  // to be passed to the show() method on the page
  var popupOrOpen = function (data, navType) {
    if (navType === 'popup') {
      pageLoader.popup(data.pagename, data.params);
    }
    else {
      pageLoader.open(data.pagename, data.params);
    }
  };

  // attach a page open/popup handler to a button
  var setupButton = function (btn, data) {
    btn.removeAttribute('disabled');
    btn.addEventListener('click', function () {
      popupOrOpen(data, btn.getAttribute('data-nav-rel'));
    });
  };

  var PageProto = {
    // use the page loader to navigate to a different page
    // dest: full destination, e.g. 'game/photoId:111/difficulty:easy'
    // navType: 'popup' or 'open'
    loadPageAndNavigate: function (dest, navType) {
      var data = pageLoader.parsePath(dest);
      navType = navType || 'page';

      if (pageLoader.isLoaded(data.pagename) ||
          pageLoader.isLoading(data.pagename)) {
        popupOrOpen(data, navType);
      }
      else {
        pageLoader.load(data.pagename)
        .then(
          function () {
            popupOrOpen(data, navType);
          },
          function (e) {
            console.error(e)
          }
        )
        .done();
      }
    },

    // turn elements inside this page which have a data-nav attribute
    // into clickable elements which will open or popup another page
    enableNavButtons: function () {
      var btns = this.elt.get(0).querySelectorAll('[data-nav]');

      _.each(btns, function (btn) {
        var data = pageLoader.parsePath(btn.getAttribute('data-nav'));

        if (pageLoader.isLoaded(data.pagename) ||
            pageLoader.isLoading(data.pagename)) {
          setupButton(btn, data);
        }
        else {
          pageLoader.load(data.pagename)
          .then(
            function () {
              setupButton(btn, data);
            },
            function (e) {
              console.error(e);
            }
          )
          .done();
        }
      });
    }
  };

  // pageToWrap should have an elt property which is a DOM resultset
  // wrapped by Rye, which returns a raw DOM element when .get(0)
  // is called on it
  return function (pageToWrap) {
    return _.extend(pageToWrap, PageProto);
  };
});

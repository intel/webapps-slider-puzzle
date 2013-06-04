/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['Q'], function (Q) {
  'use strict';

  var pages = {};

  // splits a destination path in the form 'pagename/param1:value1/param2:value2'
  // into an object of form
  // {pagename: pagename, params: {param1: value1, param2: value2}}
  var parsePath = function (dest) {
    var pageName = dest.match(/[^\/]+/)[0];
    var rawParams = dest.split('/').slice(1);

    var params = {};

    for (var i = 0; i < rawParams.length; i++) {
      var pieces = rawParams[i].split(':');
      params[pieces[0]] = pieces[1];
    }

    return {
      pagename: pageName,
      params: params
    };
  };

  /**
   * Retrieve a page object; if no page is registered with pageName,
   * an error is thrown.
   * As pages are loaded, the elements in the pages object are given
   * an "object" property, representing the page object itself. As
   * a page is loaded, its init() method is called with the element
   * the page should anchor itself to.
   *
   * @param {String} pageName Name of page to load; must be registered
   * with the pageLoader, otherwise an error is thrown
   */
  var load = function (pageName) {
    var done = Q.defer();

    if (pages[pageName] && pages[pageName].object) {
      done.resolve(pages[pageName].object);
    }
    else {
      pages[pageName] = {
        isLoading: true
      };

      require(['pages/' + pageName + '-page'], function (page) {
        console.log('loaded page "' + pageName + '"');

        // for all pages except the home page, we append to the
        // .page-container element; for the home page, we use
        // a page element which is already in the DOM
        var selector = '.page-container';
        if (pageName === 'home') {
          selector = '[data-page=home]';
        }

        var elt = document.querySelector(selector);

        page.init(elt)
        .then(
          function (page) {
            pages[pageName].object = page;
            pages[pageName].isLoading = false;
            done.resolve(page);
          },
          done.reject
        )
        .done();
      });
    }

    return done.promise;
  };

  var isLoaded = function (pageName) {
    return pages[pageName] && pages[pageName].object;
  };

  var isLoading = function (pageName) {
    return pages[pageName] && pages[pageName].isLoading;
  };

  /**
   * Load and show a page
   *
   * @param {String} pageName Name of page to load; must be registered
   * with the pageLoader, otherwise an error is thrown
   * @param {Object} [params] Optional parameters passed to show()
   * when the page is opened
   */
  var open = function (pageName, params) {
    load(pageName).then(
      function (page) {
        for (var k in pages) {
          if (k !== pageName && pages[k].object) {
            pages[k].object.hide();
          }
        }
        page.show(params);
      },
      function (err) {
        console.error(err.stack);
      }
    )
    .done();
  };

  /**
   * Load and show a popup
   *
   * This just calls the show() method of the popup; it doen't hide any other
   * pages; it's up to the popup to make itself modal, add an overlay etc.
   */
  var popup = function (popupName, params) {
    load(popupName).then(
      function (popup) {
        popup.show(params);
      },
      function (err) {
        console.error(err.stack);
      }
    )
    .done();
  };

  return {
    parsePath: parsePath,
    load: load,
    isLoaded: isLoaded,
    isLoading: isLoading,
    open: open,
    popup: popup
  };
});

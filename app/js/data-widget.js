/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['lodash', 'stapes'], function (_, Stapes) {
  'use strict';

  // basic widget class which can watch for updates on objects
  // and automatically re-render when they occur
  //
  // different from a page, in that there can be multiple instances
  // of a widget in the application; and in that widgets aren't
  // shown or hidden themselves, but are dependent on the page which
  // houses them for their visibility
  //
  // widgets should define a render() method which returns a promise
  // that resolves to an HTML fragment; this render() method is then
  // called by the update() method automatically when a watched
  // object changes
  //
  // NB a widget can define an optional refresh() function
  // which will be run after the update() function is called
  var DataWidget = function (config) {
    if (typeof config.render !== 'function') {
      throw new Error('Widget must be declared with render() function');
    }

    if (!config.elt) {
      throw new Error('Widget must be associated with a resultset elt');
    }

    _.extend(this, config);

    Stapes.mixinEvents(this);
  };

  // calls the widget's render function and replaces its HTML
  // content with the result
  DataWidget.prototype.update = function () {
    var self = this;

    this.elt.empty();

    this.render().then(function (html) {
      self.elt.html(html);

      if (self.refresh) {
        setTimeout(function () {
          self.refresh();
        }, 0);
      }
    });
  };

  // automatically call the update() method of this widget when
  // the watched object fires/emits particular events;
  // note that the watched object should support then on() method
  // for attaching handlers to events
  //
  // obj: object to watch
  // events: array of event names to watch for on obj; if omitted,
  // the data widget will watch for all 'update' events on
  // any property
  DataWidget.prototype.watch = function (obj, events) {
    var update = this.update.bind(this);

    if (events) {
      for (var i = 0; i < events.length; i++) {
        obj.on(events[i], update);
      }
    }
    else {
      obj.on('update', update);
    }
  };

  return function (config) {
    return new DataWidget(config);
  };
});

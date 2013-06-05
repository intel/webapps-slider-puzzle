/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['rye', 'stapes'], function ($, Stapes) {
  'use strict';

  var SlideMenuWidget = function (menuElt, otherMenuElt) {
    var self = this;

    this.elt = menuElt;
    this.menuCtrlElt = this.elt.find('.slide-menu-control');
    this.otherMenuElt = otherMenuElt;

    // handler for clicks on the slide menu controls
    this.slide = function () {
      var menu = this.elt;
      var menuRawElt = this.elt.get(0);
      var menuCtrl = this.menuCtrlElt;
      var otherMenu = this.otherMenuElt;

      // we only slide a menu if the other menu is in and this menu
      // is not animating; otherwise we ignore the click
      var otherMenuNotIn = otherMenu.attr('data-menu-state') !== 'in';
      var thisMenuAnimating = menu.attr('data-menu-state') === 'animating';

      if (otherMenuNotIn || thisMenuAnimating) {
        return;
      }

      // menu was clicked, other menu is in, so animate this menu
      var side = menu.attr('data-menu-side');
      var startState = menu.attr('data-menu-state');
      var endState = (startState === 'in' ? 'out' : 'in');
      var animationName = 'slide-menu-' + side + '-' + endState;

      // the action that the menu control will do next time it's clicked
      var nextAction = (endState === 'out' ? 'close' : 'open');

      var animationEndListener = function () {
        console.log('end of animation');
        menu.attr('data-menu-state', endState);
        menuCtrl.attr('data-menu-action', nextAction);
        self.emit(endState);
        menuRawElt.removeEventListener('webkitAnimationEnd', animationEndListener);
        menuRawElt.removeEventListener('animationend', animationEndListener);
      };

      menuRawElt.addEventListener('webkitAnimationEnd', animationEndListener);
      menuRawElt.addEventListener('animationend', animationEndListener);

      self.emit('animating-' + endState);
      menu.attr('data-menu-state', 'animating');
      menu.css({
        '-webkit-animation-name': animationName,
        'animation-name': animationName
      });
    };

    // close without animation
    this.close = function () {
      this.elt.removeListener('webkitAnimationEnd animationend');
      this.elt.attr('data-menu-state', 'in');
      this.elt.css({
        '-webkit-animation-name': '',
        'animation-name': ''
      });
      this.menuCtrlElt.attr('data-menu-action', 'open');
    };

    // use the whole menu as a clickable area: the control on its
    // own isn't big enough on a small screen
    this.elt.on('click', function () {
      self.slide();
    });
  };

  return function (menuElt, otherMenuElt) {
    var widget = new SlideMenuWidget(menuElt, otherMenuElt);
    Stapes.mixinEvents(widget);
    return widget;
  };
});

/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(
[
  'rye',
  'Q',
  'page',
  'puzzle-widget',
  'slide-menu-widget',
  'game-info-widget',
  'leaderboard-mini-widget',
  'game-level-select-widget',
  'dust-render',
  'i18n!../../nls/strings',
  'api'
],
function (
  $,
  Q,
  Page,
  PuzzleWidget,
  SlideMenuWidget,
  GameInfoWidget,
  LeaderboardMiniWidget,
  GameLevelSelectWidget,
  render,
  translations,
  api
) {
  'use strict';

  var parentElt = null;
  var game = api.game;
  var leaderboard = api.leaderboard;
  var soundBoard = api.soundBoard;

  return Page({
    templateName: 'game',

    init: function (elt) {
      var dfd = Q.defer();
      var self = this;

      soundBoard.load('shuffle');

      parentElt = $(elt);
      render(this.templateName, {translations: translations}).then(function (html) {
        parentElt.append(html);

        // create HTML from template
        self.elt = parentElt.find('[data-page=game]');

        // add widgets to the basic HTML which update themselves
        // in response to changes in models
        var puzzleWidgetElt = self.elt.find('[data-widget=puzzle]');
        self.puzzleWidget = PuzzleWidget(puzzleWidgetElt, game);

        // setup slide menus; NB the markup of the menus doesn't change,
        // just the markup of text elements inside the menus; so we use
        // separate small widgets to handle those
        var leftMenuElt = self.elt.find('.slide-menu[data-menu-side=left]');
        var rightMenuElt = self.elt.find('.slide-menu[data-menu-side=right]');

        self.leftMenu = SlideMenuWidget(leftMenuElt, rightMenuElt);
        self.rightMenu = SlideMenuWidget(rightMenuElt, leftMenuElt);

        // expanding a menu pauses the game (as soon as the slide out
        // starts);
        // collapsing a menu starts the game again (as soon as the slide in
        // finishes)
        self.leftMenu.on('in', function () {
          game.start();
          self.puzzleWidget.start();
        });

        self.leftMenu.on('animating-out', function () {
          game.pause();
          self.puzzleWidget.pause();
        });

        self.rightMenu.on('in', function () {
          game.start();
          self.puzzleWidget.start();
        });

        self.rightMenu.on('animating-out', function () {
          game.pause();
          self.puzzleWidget.pause();
        });

        // game info panel, left-hand menu
        var gameInfoElt = self.leftMenu.elt.find('[data-widget=game-info]');
        var showPhotoCredit = true;
        self.gameInfo = GameInfoWidget(gameInfoElt, game, showPhotoCredit);
        self.gameInfo.update();

        // mini leaderboard, left-hand menu
        var leaderboardElt = self.leftMenu.elt
                             .find('[data-widget=leaderboard-mini]');
        var scoresToDisplay = 3;

        self.leaderboardMini = LeaderboardMiniWidget(
          leaderboardElt,
          game,
          leaderboard,
          scoresToDisplay
        );
        self.leaderboardMini.update();

        // level select, right-hand menu
        var levelWidgetSelector = '[data-widget=game-level-select]';
        var levelSelectElt = self.rightMenu.elt.find(levelWidgetSelector);
        self.levelSelect = GameLevelSelectWidget(levelSelectElt, game);
        self.levelSelect.watch(game, ['update:difficulty']);
        self.levelSelect.update();

        self.levelSelect.on('select', function (newDifficultyLevel) {
          soundBoard.play('shuffle');
          game.setDifficulty(newDifficultyLevel);
          game.reset();
        });

        // handler for the "Play again" button, which slides the menu
        // back in and resets the game
        self.playAgainBtn = self.rightMenu.elt.find('[data-menu-action=reset]');
        self.playAgainBtn.on('click', function () {
          soundBoard.play('shuffle');
          self.rightMenu.slide();
          game.reset();
        });

        // enable buttons on menus
        self.enableNavButtons();

        // hook data-bound widgets up so that if data changes, they
        // update themselves in the background
        self.gameInfo.watch(game);
        self.leaderboardMini.watch(leaderboard);
        self.leaderboardMini.watch(game);
        self.puzzleWidget.watch(game, ['reset']);

        // if the game ends, transfer to the "finished" page
        game.on('completed', function () {
          game.pause();
          self.loadPageAndNavigate('finish');
        });

        // done
        setTimeout(function () {
          dfd.resolve(self);
        }, 0);
      });

      return dfd.promise;
    },

    // note that this page is static with dynamic areas, so each
    // widget is redrawn only if the data it is bound to has changed;
    // this happens in the background automatically
    show: function (params) {
      soundBoard.play('shuffle');

      // get parameters for the game
      var difficulty = params.difficulty;
      var photo = game.getPhotoById(params.photoId);

      var difficultyChanged = (difficulty &&
                               difficulty !== game.get('difficulty'));
      var photoChanged = (photo && photo !== game.get('photo'));

      if (difficultyChanged) {
        game.set('difficulty', difficulty);
      }

      if (photoChanged) {
        game.set('photo', photo);
      }

      // show the page element
      this.elt.removeClass('page-inactive').addClass('page-active');

      // reset the game every time the page is shown
      game.reset();
    },

    hide: function () {
      if (this.elt) {
        this.elt.removeClass('page-active').addClass('page-inactive');
        this.rightMenu.close();
        this.leftMenu.close();
      }
    }
  });
});

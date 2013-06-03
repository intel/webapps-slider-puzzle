/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
define(['sound'], function (Sound) {
  'use strict';

  // files is a map from a sound alias to a file
  var SoundBoard = function (files) {
    this.files = files;
    this.sounds = {};
  };

  SoundBoard.prototype.load = function (name) {
    if (!this.sounds[name]) {
      this.sounds[name] = new Sound(this.files[name]);
    }
  };

  SoundBoard.prototype.play = function (name) {
    var self = this;

    if (!this.sounds[name].ready) {
      this.load(name);

      this.sounds[name].on('ready', function () {
        self.sounds[name].play();
      });
    }
    else {
      if (this.sounds[name].isPlaying) {
        this.sounds[name].stop();
      }

      this.sounds[name].play();
    }
  };

  return SoundBoard;
});

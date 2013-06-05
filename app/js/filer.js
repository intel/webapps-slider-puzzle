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

  var onTizen = (typeof tizen !== 'undefined');

  var makeDirNonTizen = function (quotaDesired, dirName) {
    var dfd = Q.defer();

    var errorHandler = function (e) {
      console.error(e);
      dfd.reject(e);
    };

    var mkdir = function (fs) {
      fs.root.getDirectory(
        dirName,
        { create: true },
        dfd.resolve,
        errorHandler
      );
    };

    var rmdir = function (fs, dirEntry) {
      if (dirEntry) {
        dirEntry.removeRecursively(
          function () {
            mkdir(fs);
          },
          errorHandler
        );
      }
      else {
        mkdir(fs);
      }
    };

    var getdir = function (fs) {
      fs.root.getDirectory(
        dirName,
        {},
        function (dirEntry) {
          rmdir(fs, dirEntry);
        },
        errorHandler
      );
    };

    navigator.webkitPersistentStorage.requestQuota(
      quotaDesired,

      function (grantedBytes) {
        webkitRequestFileSystem(
          PERSISTENT,
          grantedBytes,
          getdir,
          errorHandler
        );
      },

      errorHandler
    );

    return dfd.promise;
  };

  // object to save blobs to local filesystem
  var Filer = function (storageMb, dirName) {
    this.quotaDesired = storageMb * 1024 * 1024;
    this.dirName = dirName;
    this.dir = null;
  };

  Filer.prototype.init = function () {
    var self = this;
    var dfd = Q.defer();

    if (onTizen) {
      // TODO
    }
    else {
      makeDirNonTizen(this.quotaDesired, this.dirName).then(
        function (directory) {
          self.dir = directory;
          dfd.resolve();
        },
        dfd.reject
      );
    }

    return dfd.promise;
  };

  // save blob and return the resulting File object
  Filer.prototype.saveBlob = function (blob) {
    if (!this.dir) {
      throw new Error('filer has no directory; please call init() before use');
    }

    var dfd = Q.defer();

    // TODO make a filename for this file
    var filename = 'slider-puzzle-' + ((new Date()).getTime()) + '.png';

    // TODO clean up this mess
    // make the file
    this.dir.getFile(
      filename,
      {create: true, exclusive: true},
      function (entry) {
        // write the blob to it
        entry.createWriter(
          function (filewriter) {
            filewriter.onwriteend = function () {
              entry.file(
                function (file) {
                  var reader = new FileReader();

                  reader.onloadend = function () {
                    var data = this.result;

                    dfd.resolve({
                      id: file.name,
                      full: data,
                      thumb: data,
                      creator: 'camera'
                    });
                  };

                  reader.readAsDataURL(file);
                },

                function (e) {
                  console.error(e);
                }
              );
            };

            filewriter.onerror = function (e) {
              console.error(e);
            };

            filewriter.write(blob);
          },
          function (e) {
            console.error(e);
          }
        );
      },
      function (e) {
        console.error(e);
      }
    );

    return dfd.promise;
  };

  return Filer;
});

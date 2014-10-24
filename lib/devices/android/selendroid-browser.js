"use strict";

var _ = require('underscore')
  , logger = require('../../server/logger.js').get('appium')
  , Selendroid = require('./selendroid.js');

var SelendroidBrowser = function () {
  this.init();
};

_.extend(SelendroidBrowser.prototype, Selendroid.prototype);

SelendroidBrowser.configure = function (args, caps, cb) {
  logger.debug("Configuring Selendroid for mobile web testing");
  this._deviceConfigure(args, caps);
  this.setAndroidArgs();
  cb();
};

module.exports = SelendroidBrowser;

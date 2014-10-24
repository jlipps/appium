"use strict";

var env = require("./env")
  , _ = require('underscore')
  , uuidGenerator = require('node-uuid');

var spinTitle = function (expTitle, browser, _timeout) {
  var timeout = typeof _timeout === 'undefined' ? 90 : _timeout;
  timeout.should.be.above(0);
  return browser
    .title()
    .then(function (pageTitle) {
      if (pageTitle.indexOf(expTitle) < 0) {
        return browser
          .sleep(500)
          .then(function () { return spinTitle(expTitle, browser, timeout - 1); });
      }
    });
};

var chromeBrowsers = ["chrome", "chromium", "chromebeta"];
var androidBrowsers = chromeBrowsers.concat(["browser"]);
var allBrowsers = androidBrowsers.concat(["safari"]);

var loadWebView = function (desired, browser, urlToLoad, titleToSpin) {
  var app = typeof desired === 'object' ? desired.app || desired.browserName  : desired;

  var uuid = uuidGenerator.v1();
  if (typeof urlToLoad === "undefined") {
    if (_.contains(androidBrowsers, app)) {
      urlToLoad = env.CHROME_GUINEA_TEST_END_POINT + '?' + uuid;
    } else {
      urlToLoad = env.GUINEA_TEST_END_POINT + '?' + uuid;
    }
  }
  if (typeof titleToSpin === "undefined") {
    titleToSpin = uuid;
  }
  if (_.contains(allBrowsers, app)) {
    return browser
      .get(urlToLoad)
      .sleep(3000)
      .then(function () { return spinTitle(titleToSpin, browser); });
  } else {
    return browser
      .contexts()
      .then(function (ctxs) {
        ctxs.length.should.be.above(0);
        return browser
          .context(ctxs[1])
          .url();
      })
      .then(function (url) {
        if (url !== urlToLoad) {
          return browser
            .get(urlToLoad)
            .then(function () { return spinTitle(titleToSpin, browser); });
        } else {
          return spinTitle(titleToSpin, browser);
        }
      });
  }
};


var isChrome = function (desired) {
  return _.contains(chromeBrowsers, desired.app) ||
         _.contains(chromeBrowsers, desired.browserName);
};

var isAndroidBrowser = function (desired) {
  return _.contains(androidBrowsers, desired.app) ||
         _.contains(androidBrowsers, desired.browserName);
};

function skip(reason, done) {
  console.warn("skipping: " + reason);
  done();
}

var testEndpoint = function (desired) {
  return isAndroidBrowser(desired) ? env.CHROME_TEST_END_POINT : env.TEST_END_POINT;
};

module.exports = {
  spinTitle: spinTitle,
  loadWebView: loadWebView,
  isChrome: isChrome,
  isAndroidBrowser: isAndroidBrowser,
  skip: skip,
  testEndpoint: testEndpoint
};

## A Developer's Overview of Appium

(Before reading this document, please ensure that you have read and understood the more general [introduction to Appium concepts](/docs/en/about-appium/intro.md).)

Appium is primarily a collection of [node.js](http://nodejs.org) packages that
combine to form a running node.js server. These packages are maintained independently of one another and each have their own GitHub repo, CI, and release process. Some packages (like `appium-ios-driver`) are large and add significant functionality to Appium, while others play a support role and expose one specific bit of functionality that is reused by other packages.

For an overview of the package hierarchy and the role that each package plays, please check out our [package overview](./appium-packages.md) doc.

### Transpilation

Appium is written in a new form of JavaScript, called ES6 (or now ES2015). Because this version of the language is not yet supported natively by older versions of node.js, Appium code is _transpiled_ to ES5 (the more widely-supported version of JS). This transpilation process must occur before any code is run. In addition to the new language features of ES6, we have adopted two very important keywords from the _subsequent_ version of JS, namely `async` and `await`, which assist in writing asynchronous code cleanly. Because of the transpilation step, Appium packages include tools which watch code for changes and automatically

### Linting and Style

### Testing

### Releasing

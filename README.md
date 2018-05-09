# Day 2
## Homework
Readings:
- HTML introduction: https://www.w3schools.com/html/default.asp
Please read all of this guide. Its important to understand the basic
tags as Angular builds on top of this to create their own tags which will
have enhance functionality.
- JS introduction: https://www.w3schools.com/js/default.asp
This will be a great introduction to how JavaScript interacts with the
DOM natively. Every year the [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)
organization gets together and decides on how the JavaScript standard for the web
is going to evolve, this will include neat new features, or simply fixes
to previous API. Their main job is to provide an API that JavaScript uses inside a browser
to interact with the DOM tree, and to do other important functions such as a
a request to a server via a [get request](https://www.w3schools.com/tags/ref_httpmethods.asp).
Angular builds on top of this basic JavaScript API to create easier management of
websites, it creates functions that wrap this functionality and provides them
the Angular way.
- Git tutorial by Logan Montgomery: [git tutorial](https://docs.google.com/document/d/16PSag95XtbPKWGNi2K5PCtYNoGMo-haOJV3nsPXc2Z0/edit?usp=sharing),
go through this tutorial to understand the basics of git.
## Description

Today we will be introducing the front-end technologies for the app. We will go through an overview of the 
dependency managers, the set-up for a typical web-app and finally create a coding example in the context of a messaging app.
By the end of this module, you should be a little bit more familiar with the Opal
application set up, the common AngularJS flow, OnsenUI flow, and ultimately how to
 set-up a project using these technologies. We will set-up testing, but we will
 not take care of that until tomorrow.
## Resources
This might be a lot to process, to aid this process, the following resources
will help you plus the resources I will be adding along with the tutorial.
- [Code Academy](https://www.codecademy.com/) - Intro. Tutorials on JS, HTML, CSS, AngularJS
- [AngularJS Documentation](https://docs.angularjs.org/api)
- [OnsenUI Documentation] (https://onsen.io/v1/guide.html)
- [Styling guide AngularJS](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) Please
    use this style guide when writing your AngularJS code. It makes the code clean,
    consistent, and easy to use for people that follow.
- [HTML W3School](https://www.w3schools.com/html/default.asp)
- [AngularJS W3Schools](https://www.w3schools.com/angular/default.asp)

# Project
## Getting started

1. Install bower, npm, and gulp globally.
2. Run `$ npm init`, this will initialize your project development dependencies, creating a config file named package.json
it will ask common questions for a project set up such as the description, the version, and the name of the project.
3. Add bower as a development dependency `$ npm install bower --save-dev`
This will be the front-end dependency manager, this will handle and all our front-end dependencies
4. Run `$ bower init`, similarly as above, this will initialize your configuraton file
    for front-end dependencies creating a bower.json file.
5. Create a .bowerrc file to configure bower and add the contents as follows:
    ```
    {
        "directory":"app/lib/bower_components"
    }
    ```

This will install the added bower dependencies in the path pointed by "directory",
normally your application code lives in the app folder. The lib folder is the
place where you place all your application external libraries and dependencies.


6. Now its time to add and install our two major frameworks and front-end dependencies.
  ```
    bower install onsen#1.3.16 --save
    bower install angular#1.4.14 --save
  ```


- The `--save` flag saves both of those dependencies in the bower.json file as actual project dependencies
OnsenUI and AngularJS are the two JavaScript dependencies we use in the app.
- AngularJS, provides a framework for thinking about the logic of a web-app building
on top of the __MVC__ design pattern. Here is a small introduction: https://docs.angularjs.org/guide/concepts
- OnsenUI is a CSS/JavaScript that provides out of the box components that are mobile
    looking, it allows a web-app to look and feel like a mobile app.
    Look through the start page on OnsenUI https://onsen.io/v1/guide.html,
    note that we will be working with version 1 of this framework. When you are going
    through the documentation make sure of that.


7. Start our index.html file with both of our dependencies.
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Title</title>
    <link rel="stylesheet" href="lib/bower_components/OnsenUI/css/onsen-css-components.css">
    <link rel="stylesheet" href="lib/bower_components/OnsenUI/css/onsenui.css">
    <script src="lib/bower_components/angular/angular.min.js" type="application/javascript"></script>
    <script src="lib/bower_components/OnsenUI/js/onsenui.min.js" type="application/javascript"></script>
</head>
<body >


</body>

</html>

```
- Here we are adding 4 files. Two stylesheets, which will be the Onsen CSS components,
  and 2 JavaScript files, which will load the AngularJS framework and OnsenUI.
- See [OnsenUI Getting Started](https://onsen.io/v1/guide.html) if you have any problems.
  Your index.html page is the only page that will be loaded in your application,
  Angular will take care of dynamically swapping dependencies in and out within that page.
  It will also do other things like controlling the url, as to give the illusion of a
  multi-page app, and controlling your state via their Angular directives which
  always start with an `ng`.

8. Run server and test no errors, make sure to open in Chrome.
```
    http-server ./app -p 9000
```
To test for errors check the console by inspecting the page and choosing `console` on the
top bar of the browser. Let's also disable the cache on the site
by going into the `network` tab of the debugging tools and
[selecting](https://www.technipages.com/google-chrome-how-to-completely-disable-cache)
the `disable cache` box.

9. Now its time to start building the app. Angular app is bootstrapped by the
module config function. To do this, we do two different things.
First, we create a tag on the `index.html` as to tell Angular
where to start nesting the application.
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Title</title>
    <link rel="stylesheet" href="lib/bower_components/OnsenUI/css/onsen-css-components.css">
    <link rel="stylesheet" href="lib/bower_components/OnsenUI/css/onsenui.css">
    <script src="lib/bower_components/angular/angular.min.js" type="application/javascript"></script>
    <script src="lib/bower_components/OnsenUI/js/onsenui.min.js" type="application/javascript"></script>
</head>
<body ng-app="messaging-app">


</body>

</html>
```
Here we have told Angular to start our application from the body tag of our html tree.
For more information on HTML or a start with it, see https://www.w3schools.com/html/html_intro.asp
they are a great side to get started with it.
Secondly, we instantiate the module, i.e.
```
angular.module("<name-module>",[<list-of-angular-dependencies>])
```
This will create an Angular module with the name give and declare
the set of Angular dependencies for this module. The following
steps will go through our basic set-up.
9. Instantiate angular module.
- Create 'app.js' file under the `app/js` directory and include

```
(function(){
    var module = angular.module("messaging-app",["onsen"]);


})();
```
This creates and defines the angular module and the angular dependencies for the project
`messaging-app` is the name of our module, and `onsen` is the angular dependency for the
module. Notice the `(function(){})();`, this will encapsulate
our code as to not let variables escape from scope, if you
try to simply declare variables in a JavaScript file without a function
encapsulating and you have more than one file. You will have a collision
problems with your variables.



 5. Let's now install the Karma framework for unit testing
 ```
 npm install karma karma-jasmine jasmine-core karma-chrome-launcher karma-junit-reporter --save-dev
 npm instal -g karma-cli
 bower install angular-mocks#1.4.14 --save-dev

 ```
 Notice here again that this is an example of a development dependency, thus
 the `--save-dev` flag.
6. Setup for AngularJS testing environment. To do this, run `$karma init karma.conf.js`,
choose the Jasmine Framework (AngularJS Framework, Require.js no (Since we are dealing
with a browser and Require.js is for server side JavaScript, a.k.a Node.js). Then go
through the rest of the default options choosing Chrome as your browser. This
will create a `karma.conf.js` file from the options you provided. Below is
my configuration.

```
// Karma configuration
// Generated on Sun May 06 2018 14:08:09 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'app',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
	    'lib/bower_components/angular/angular.min.js',
	    'lib/bower_components/angular-mocks/angular-mocks.js',
	    'lib/bower_components/OnsenUI/js/onsenui.js',
    	'js/app.js',
        'js/controllers/**/*.js',
	    'js/services/**/*.js'

	    // 'js/**/*.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
	  plugins: [
		  'karma-chrome-launcher',
		  'karma-jasmine',
		  'karma-junit-reporter'
	  ],
	  junitReporter: {
		  outputFile: 'test_out/unit.xml',
		  suite: 'unit'
	  },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
```
This is the configuration file for the karma unit testing framework. Here we are specifying
things like our files that we want to test, the browser we want to test in, and the plugins
that make this possible. The `karam-chrome-plugin` for instance will allow you to run your tests
in Chrome automatically, `karma-jasmine` is the plugin that provides functions to interact
with the AngularJS environment. For more information look at the [Karma tutorial](http://www.bradoncode.com/blog/2015/05/19/karma-angularjs-testing/),
[AngularJS testing](https://docs.angularjs.org/guide/unit-testing)
7. Add the following key,value pair to the scripts object in your package.json replacing
the value currently present:
```
    scripts:{
        "test": "karma start karma.conf.js"
    }
```
This will allow you to run your tests as `$npm run test`.

Your folder should look like this now:

__Success__!!! You have now gone through the basic steps to get an AngularJS app
with our front-end technology stack! Now you are ready! To move on to your
first Angular Application.

If you have any problems, send me an e-mail to: davidfherrerar@gmail.com

# Messaging app

The goal of this mini-project is to create a messaging app using this technology stack.

- Creation of new conversations
- Creation and management of messages in conversation
- Creation and management of a contact page accessible once inside the
  conversation.

#### New Conversations
##### Requirements.
1. Follow the guide above to get set up.
2.
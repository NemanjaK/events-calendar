// Karma configuration

module.exports = function(config) {
	
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '../../../',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],
		
		plugins: [
			'karma-ng-html2js-preprocessor',
			'karma-jasmine',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-ie-launcher',
			'karma-firefox-launcher',
			'karma-coverage'
		],


		// list of files / patterns to load in the browser
		files: [
			'src/main/webapp/vendor/jquery/jquery-*.js',
			'src/main/webapp/vendor/angular/angular.min.js',
			'src/main/webapp/vendor/angular/angular-*.js',
			'src/main/webapp/vendor/angular/angular-mocks.js',
			//'src/main/webapp/vendor/foundation/js/foundation.min.js',
			'src/main/webapp/vendor/angular-foundation/mm-foundation-tpls-0.3.1.min.js',
			'src/main/webapp/app/**/main.js',
			'src/main/webapp/app/component/**/*.js',
			'src/main/webapp/app/component/**/*.html',
			'src/main/webapp/app/common/**/*.js'
		],


		// list of files to exclude
		exclude: [
		  'src/main/webapp/vendor/**/*.map'
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/main/webapp/app/**/!(*.test|*.ng|*.min|*.concat).js': ['coverage'],
			'src/main/webapp/app/component/**/*.html': ['ng-html2js']
		},
		
		ngHtml2JsPreprocessor: {
			stripPrefix: 'src/main/webapp',
			moduleName: 'templates'
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter 
		reporters: ['progress', 'coverage'],

		// the default configuration
		coverageReporter: {
			type : 'html',
			dir : 'src/test/webapp/coverage'
		},


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		//browsers: ['Chrome', 'PhantomJS', 'Firefox', 'IE'],
		browsers: [ 'PhantomJS' ],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true
	});
};

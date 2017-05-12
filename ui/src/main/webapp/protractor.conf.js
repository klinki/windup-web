exports.config = {
    baseUrl: 'http://localhost:8080/rhamt-web',
    specs: [
        'tests/e2e/**/*.e2e.ts'
    ],

    allScriptsTimeout: 110000,
    getPageTimeout: 100000,

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000,
        print: function() {}
    },
    directConnect: true,

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    },

    onPrepare: function() {
        browser.ignoreSynchronization = false;

        // add jasmine spec reporter
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
    },

//    seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     *
     */
    useAllAngular2AppRoots: true
};

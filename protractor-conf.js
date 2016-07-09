exports.config = {
    // set to "custom" instead of cucumber.
    framework: 'custom',

    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // The file path to the selenium server jar so that protractor can manage the start/stop of the selenium server
    seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
    specs: ['features/**/*.feature'],
    cucumberOpts: {
        require: [
            'features/step_definitions/**/*.js',
            'features/support/env.js'
        ]
    }
};
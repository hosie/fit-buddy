exports.config = {
    // set to "custom" instead of cucumber.
    framework: 'custom',

    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['features/**/*.feature'],
    cucumberOpts: {
        require: [
            'features/step_definitions/**/*.js',
            'features/support/env.js'
        ]
    }
};
'use strict';

var os = require('os');

module.exports = function(grunt) {
    var SRC_REQUEST_URL_REGEX = new RegExp('src/.*ng-pattern-restrict\\.js$');
    var MIN_REQUEST_URL_REGEX = new RegExp('^/min');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 9001,
                    base: ['node_modules', 'angular-2.x'],
                }
            }
        },
        protractor_webdriver: {
            webDriverStart: {
                options: {
                    path: './node_modules/protractor/bin/',
                    command: 'webdriver-manager start'
                }
            },
        },
        protractor: {
            options: {
                configFile: 'tests/protractor-conf.js',
                keepAlive: false,
                noColor: false,
                args: { }
            },
            test: {
                options: {
                    configFile: 'tests/protractor-conf.js',
                    args: { }
                }
            },
            travis: {
                options: {
                    configFile: 'tests/protractor-travis-conf.js',
                    args: { }
                }
            },
            travismin: {
                options: {
                    configFile: 'tests/protractor-travis-min-conf.js',
                    args: { }
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'angular-1.x/src/ng-pattern-restrict.min.js': ['angular-1.x/src/ng-pattern-restrict.js']
                },
                options: {
                    compress: {
                        sequences: true,
                        properties: true,
                        dead_code: true,
                        drop_debugger: true,
                        conditionals: true,
                        comparisons: true,
                        evaluate: true,
                        booleans: true,
                        loops: true,
                        unused: true,
                        hoist_funs: true,
                        hoist_vars: true,
                        if_return: true,
                        join_vars: true,
                        cascade: true,
                        warnings: true,
                        negate_iife: true,
                        pure_getters: true,
                        drop_console: true,
                        unsafe: true,
                        global_defs: {
                            DEBUG: false
                        }
                    },
                    report: 'gzip',
                    sourceMap: true,
                    quoteStyle: 1
                }
            }
        },
        ts: {
            default: {
                tsconfig: {
                    tsconfig: 'tsconfig.json'
                },
                src: ['angular-2.x/**/*.ts']
            }
        },
        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            default: {
                src: ['angular-2.x/**/*.ts']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-protractor-webdriver');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    
    grunt.registerTask('test', [
        /*'tslint', 'ts',*/
        'connect',
        'protractor_webdriver:webDriverStart',
        'protractor:test'
    ]);
    grunt.registerTask('test:travis', ['tslint', 'ts', 'connect', 'protractor:travis', 'protractor:travismin']);
};

module.exports = function (grunt) {
    // load all grunt tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-inline-angular-templates');

    var checksum = require('checksum');
    var fs = require('fs');

    var vendorJsDep = [
        '../src/vendor/jquery/jquery.min.js',
        '../src/vendor/jquery-ui/jquery-ui.min.js',
        '../src/vendor/jquery-mousewheel/jquery.mousewheel.min.js',
        '../src/vendor/bootstrap/js/bootstrap.min.js',
        '../src/vendor/angular/angular.min.js',
        '../src/vendor/angular/angular-animate.min.js',
        '../src/vendor/angular/angular-loader.min.js',
        '../src/vendor/angular/angular-resource.min.js',
        '../src/vendor/angular/angular-route.min.js',
        '../src/vendor/angular/angular-messages.min.js',
        '../src/vendor/touchPunch/touch-punch.min.js',
        '../src/vendor/angular-dnd/dnd.min.js',
        '../src/vendor/angular-translate/angular-translate.min.js',
        '../src/vendor/angular-local-storage/angular-local-storage.min.js',
        '../src/vendor/angular-sortable/angular_sortable.js',
        '../src/vendor/d3/d3.min.js',
        '../src/vendor/nvd3/nv.d3.min.js',
        '../src/vendor/angular-nvd3/angularjs-nvd3-directives.min.js',
        '../src/vendor/ui-bootstrap/ui-bootstrap-tpls-0.13.0.min.js'
    ];
    var vendorCssDep = [
        '../src/vendor/angular/angular-csp.css',
        '../src/vendor/bootstrap/css/bootstrap.css',
        '../src/vendor/jquery-ui/jquery-ui.min.css',
        '../src/vendor/nvd3/nv.d3.min.css'
    ];

    grunt.initConfig({
        options: {
            nospawn: true
        },
        template: {
            'injectTranslationsHashes': {
                'options': {
                    'data': function () {
                        var data = {};

                        var files = fs.readdirSync('../src/translations/');

                        files.forEach(function (val) {
                            data[val.substr(6, 2) + "LangHash"] = checksum(grunt.file.read('../src/translations/' + val));
                        });

                        return data;
                    }
                },
                'files': {
                    '../app/index.html': ['../app/index.html']
                }
            }
        },
        clean: {
            options: {
                force: true
            },
            app: {
                src: [
                    "../app",
                    "../report/coverage"
                ]
            },
            public: {
                src: [
                    "../../backend/src/public"
                ]
            },
            node_modules: {
                src: [
                    "node_modules"
                ]
            }
        },
        jshint: {
            options: {
                globalstrict: false,
                strict: false, // do not require strict mode
                camelcase: true, // force all variable names style to 'camelCase' or 'UPPER_CASE'
                curly: true, // require curly braces around blocks in loops and conditionals
                freeze: true, // prohibit overwriting prototypes of native objects
                latedef: "nofunc", // prohibit use of variables before declaration
                undef: true, // prohibit use of undeclared variables
                immed: true, // prohibits the use of immediate function invocations without wrapping them in parentheses
                //                unused: true,

                supernew: true, // allow singleton constructors
                sub: true, // allow defining properties using [] synthax
                debug: true, // allow debugger statement

                browser: true, // allow use of window and document objects
                phantom: true,
                jquery: true,

                devel: true, // allow use of console and alert
                globals: {
                    // Codesynapses Hairdresser
                    cal: true,
                    CAL_LANG: true,
                    // Angular
                    angular: false,
                    // Jasmine
                    describe: false,
                    beforeEach: false,
                    afterEach: false,
                    it: false,
                    expect: false,
                    module: false,
                    inject: false,
                    spyOn: false,
                    jasmine: false,

                    randomColor: false
                }
            },
            src: ['../src/js/**/*.js', '../src/translations/**/*.json']
        },
        karma: {
            options: {
                configFile: '../test/karma.config.js',
                runnerPort: 9999
            },
            phantom: {
                singleRun: true,
                browsers: ['PhantomJS']
            },
            browsers: {
                singleRun: true,
                browsers: ['Chrome', 'Firefox', 'IE']
            },
            browsersNoIE: {
                singleRun: true,
                browsers: ['Chrome', 'Firefox']
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            js: {
                src: [
                    '../src/js/config/config.js',
                    '../src/js/**/*.js'
                ],
                dest: '../app/js/cshd.concat.js'
            },
            jsVendor: {
                src: vendorJsDep,
                dest: '../app/js/vendor.min.js'
            },
            css: {
                src: ['../src/css/**/*.css'],
                dest: '../app/css/cshd.concat.css'
            },
            cssVendor: {
                src: vendorCssDep,
                dest: '../app/css/vendor.min.css'
            }
        },
        cssmin: {
            all: {
                files: {
                    '../app/css/cshd.min.css': ['../app/css/cshd.concat.css']
                }
            }
        },
        ngmin: {
            all: {
                src: ['../app/js/cshd.concat.js'],
                dest: '../app/js/cshd.ng.js'
            }
        },
        uglify: {
            all: {
                files: {
                    '../app/js/cshd.min.js': ['../app/js/cshd.ng.js']
                }
            }
        },
        injector: {
            options: {
                template: '../src/index-template.html',
                addRootSlash: false,
                transform: function (path) {
                    console.log("PATH: " + path);
                    //path = path.substring(2);
                    path = path.replace("../src/", "");
                    path = path.replace("../app/", "");
                    if (path.indexOf(".css") > -1) {
                        path = '<link rel="stylesheet" href="' + path + '">';
                    } else {
                        path = '<script src="' + path + '"></script>';
                    }
                    console.log("NEW_PATH: " + path);
                    return path;
                }
            },
            dev: {
                files: {
                    '../app/index.html': vendorJsDep.concat(vendorCssDep, [
                        '../src/js/**/*.js',
                        '../src/css/**/*.css',
                        // exclude previous steps
                        '!../app/**/*.concat.js',
                        '!../app/**/*.ng.js',
                        '!../app/**/*.min.js',
                        '!../app/**/*.min.css'
                    ])
                }
            },
            prod: {
                files: {
                    '../app/index.html': [
                        '../app/js/vendor.min.js',
                        '../app/js/cshd.min.js',
                        '../app/css/vendor.min.css',
                        '../app/css/cshd.min.css'
                    ]
                }
            }
        },
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '../src',
                    src: ['**/*', '!index-template.html'],
                    dest: '../app/'
                }]
            },
            toBackend: {
                files: [{
                    expand: true,
                    cwd: '../app/',
                    src: ['**/*'],
                    dest: '../../backend/src/public/'
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: '../src',
                    src: ['**/*.html', 'resources/**', 'vendor/**', '!index-template.html'],
                    dest: '../app/'
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: '../src/vendor/bootstrap/',
                    src: ['fonts/**'],
                    dest: '../app/'
                }]
            },
            bootstrapCss: {
                files: [{
                    expand: true,
                    cwd: '../src/vendor/bootstrap/',
                    src: ['css/**'],
                    dest: '../app/'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            all: {
                files: [
                    '../src/index-template.html',
                    '../src/**/*.js',
                    '../src/**/*.html',
                    '../src/**/*.css',
                    '../src/**/*.json'
                ],
                tasks: ['dev']
            }
        },
        inline_angular_templates: {
            dist: {
                options: {
                    base: '../src/', // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
                    prefix: '/',            // (Optional) Prefix path to the ID. Default is empty string.
                    selector: 'body',       // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
                    method: 'prepend',       // (Optional) DOM insert method. Default is `prepend`.
                    unescape: {             // (Optional) List of escaped characters to unescape
                        '&lt;': '<',
                        '&gt;': '>',
                        '&apos;': '\'',
                        '&amp;': '&'
                    }
                },
                files: {
                    '../app/index.html': ['../src/inline-templates/**/*.html']
                }
            }
        }
    });

    grunt.task.registerTask('concatAll', ['concat:jsVendor', 'concat:js', 'concat:cssVendor', 'concat:css']);
    grunt.task.registerTask('minify', ['ngmin:all', 'uglify:all', 'cssmin:all']);

    grunt.task.registerTask('dev', ['clean:app', 'clean:public', 'jshint:src', 'copy:dev', 'injector:dev', 'template:injectTranslationsHashes', 'inline_angular_templates', 'copy:toBackend', 'clean:app' /*'karma:phantom'*/]);

    grunt.task.registerTask('watchDog', ['dev', 'watch:all']);

    grunt.task.registerTask('prod', ['clean:app', 'jshint:src', 'copy:prod', 'copy:fonts', 'copy:bootstrapCss', /*'karma:phantom',*/ 'concatAll', 'minify', 'injector:prod', 'template:injectTranslationsHashes', 'inline_angular_templates', 'copy:toBackend', 'clean:app']);

    grunt.registerTask('default', []);

};
module.exports = function(grunt) {

    // modules to compress images
    var mozjpeg = require('imagemin-mozjpeg');
    var pngout  = require('imagemin-pngout');
    var optipng = require('imagemin-optipng');

    // defines the common scripts from site pages
    var scripts = {
        home: [
            'js/smooth-scroll.js',
            'node_modules/echo-js/dist/echo.js',
            'js/app.js'
        ],
        default: [
            'bower_components/chartist/dist/chartist.min.js',
            'node_modules/echo-js/dist/echo.js',
            'js/smooth-scroll.js',
            'js/default.js'
        ]
    };

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            options: {
                advanced: true,
                aggressiveMerging: true,
                semanticMerging : true
            },
            target: {
                files: {
                    '_site/css/main.css': [
                        'bower_components/chartist/dist/chartist.min.css',
                        '_site/css/main.css'
                    ],
                    '_site/css/home.css': [
                        '_site/css/home.css'
                    ]
                }
            }
        },

        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [
                        mozjpeg(),
                        pngout(),
                        optipng()
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '_site/img/',
                        src: [ '**/*.{png,jpg,gif}', '!sprite-src/' ],
                        dest: '_site/img/'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: {
                    '_site/index.html': '_site/index.html',
                    '_site/resultado-das-avaliacoes/index.html': '_site/resultado-das-avaliacoes/index.html'
                }
            }
        },

        concat : {
            scripts : {
                src : scripts.home,
                dest : '_site/js/main.js',
            },
            js_default: {
                src: scripts.default,
                dest: '_site/js/default.js'
            },
            css: {
                src: [
                    'bower_components/chartist/dist/chartist.min.css',
                    '_site/css/main.css'
                ],
                dest: '_site/css/main.css'
            }
        },

        jshint: {
            beforeconcat: scripts.home/*,
            afterconcat: ['_site/js/main.js']*/
        },

        uglify : {
            target : {
                files : {
                    '_site/js/main.js' : scripts.home
                }
            },
            js_default : {
                files: {
                    '_site/js/default.js' : scripts.default
                }
            }
        },

        watch: {
            options: {
                event: ['changed', 'added', 'deleted'],
                spawn : true,
                atBegin : true,
                livereload : true
            },

            images : {
                files : [
                    'img/*'
                ],

                tasks : [ 'imagemin', 'exec:buildDev', 'concat' ]
            },

            scripts : {
                files : [
                    'js/*.js',
                ],

                tasks : [ 'concat' ]
            },

            jekyll: {
                files: [

                    // data
                    '_data/results.json',

                    // styles (sass)
                    '_sass/**/*.scss',
                    '_sass/*.scss',
                    'css/*.scss',

                    // views
                    '_layouts/*.html',
                    '_includes/*.html',
                    'index.html',
                    'resultado-das-avaliacoes/*.html',
                    'na-midia/*.html',

                    // configurations
                    '*.yml',
                    'Gruntfile.js',
                ],

                tasks : [
                    'exec:buildDev',
                    'concat'
                ]
            }
        },

        exec: {

            // sync google form
            syncFormDev: {
                cmd: 'casperjs _scripts/update-form.js --env=dev'
            },

            syncFormStg: {
                cmd: 'casperjs _scripts/update-form.js --env=stg'
            },

            syncFormPrd: {
                cmd: 'casperjs _scripts/update-form.js --env=prd'
            },

            // builds
            buildDev: {
                cmd: 'JEKYLL_ENV=development jekyll build -c _config.yml,_config_dev.yml'
            },
            buildStg: {
                cmd: 'JEKYLL_ENV=staging jekyll build -c _config.yml,_config_stg.yml'
            },
            buildPrd: {
                cmd: 'JEKYLL_ENV=production jekyll build -c _config.yml,_config_prd.yml'
            },

            // deploys
            deployStg: {
                cmd: 'rsync -azpog --progress --delete-excluded --exclude "Gruntfile.js" --exclude "sitemap.xml" --exclude "robots.txt" --exclude "img/src-sprite" --exclude "package.json" --exclude "node_modules/" --exclude "readme.md" -e "ssh -q" _site/ root@andrewslince.me:/var/www/beta.maternidadesmanaus.com.br/'
            },
            deployPrd: {
                cmd: 'rsync -azpog --progress --delete-excluded --exclude "Gruntfile.js" --exclude "img/src-sprite" --exclude "package.json" --exclude "node_modules/" --exclude "readme.md" -e "ssh -q" _site/ root@andrewslince.me:/var/www/maternidadesmanaus/'
                // cmd: 'echo "\nPara que seus dentes se mantenham intactos, o deploy de PRD ainda está desabilitado! :)\n"'
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    // register tasks
    grunt.registerTask('default', [ 'exec:buildDev', 'jshint', 'concat' ]);
    grunt.registerTask('sync-form-dev', [ 'exec:syncFormDev' ]);
    grunt.registerTask('sync-form-stg', [ 'exec:syncFormStg' ]);
    grunt.registerTask('sync-form-prd', [ 'exec:syncFormPrd' ]);
    grunt.registerTask('deploy-stg', [
        'exec:buildStg',
        'jshint',
        'uglify',
        'htmlmin',
        'imagemin',
        'cssmin',
        'exec:deployStg'
    ]);
    grunt.registerTask('deploy-prd', [
        'exec:buildPrd',
        'jshint',
        'uglify',
        'htmlmin',
        'imagemin',
        'cssmin',
        'exec:deployPrd'
    ]);
};

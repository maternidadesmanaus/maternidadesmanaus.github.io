module.exports = function(grunt) {

    var mozjpeg = require('imagemin-mozjpeg');
    var pngout  = require('imagemin-pngout');
    var optipng = require('imagemin-optipng');

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
                    '_site/css/main.css': [ '_site/css/main.css' ]
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
                        src: [ '**/*.{png,jpg,gif}' ],
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
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: {
                    '_site/index.html': '_site/index.html'
                }
            }
        },

        concat : {
            scripts : {
                src : [
                    'js/smooth-scroll.js',
                    'js/echo.js',
                    'js/app.js'
                ],
                dest : '_site/js/main.js',
            }
        },

        uglify : {
            target : {
                files : {
                    '_site/js/main.js' : [
                        'js/smooth-scroll.js',
                        'js/echo.js',
                        'js/app.js'
                    ]
                }
            }
        },

        watch: {
            options: {
                event: ['changed', 'added', 'deleted']
            },

            images : {
                files : [
                    'img/*'
                ],

                tasks : [ 'imagemin', 'exec:build', 'concat' ]
            },

            scripts : {
                files : [
                    'js/*.js',
                ],

                tasks : [ 'concat' ]
            },

            jekyll: {
                files: [

                    // styles (sass)
                    '_sass/*.scss',
                    'css/*.scss',

                    // views
                    '_layouts/*.html',
                    '_includes/*.html',
                    'index.html',

                    // configurations
                    '_config.yml',
                    'Gruntfile.js',
                ],

                tasks : [
                    'exec:build',
                    'concat'
                ]
            }
        },

        exec: {
            build: {
                // cmd: 'jekyll build --destination ./_site/public'
                cmd: 'jekyll build'
            },
            deploy: {
                cmd: 'rsync -azvpog --progress --delete-excluded --exclude "Gruntfile.js" --exclude "img/src-sprite" --exclude "package.json" --exclude "node_modules/" --exclude "readme.md" -e "ssh -q" _site/ root@andrewslince:/var/www/maternidadesmanaus/'
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    // register tasks
    grunt.registerTask('default', [ 'exec:build', 'concat' ]);
    grunt.registerTask('deploy', [
        'exec:build',
        'uglify',
        'htmlmin',
        'imagemin',
        'cssmin',
        'exec:deploy'
    ]);
};

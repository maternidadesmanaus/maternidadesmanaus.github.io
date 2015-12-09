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
                    'js/jquery-2.1.4.min.js',
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
                        'js/jquery-2.1.4.min.js',
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

                    // styles (sass)
                    '_sass/*.scss',
                    'css/*.scss',

                    // views
                    '_layouts/*.html',
                    '_includes/*.html',
                    'index.html',
                    'ranking/*.html',

                    // configurations
                    '_config.yml',
                    'Gruntfile.js',
                ],

                tasks : [
                    'exec:buildDev',
                    'concat'
                ]
            }
        },

        exec: {

            // update google form
            updateForm: {
                cmd: 'casperjs _scripts/update-form.js'
            },

            // builds
            buildDev: {
                cmd: 'JEKYLL_ENV=development jekyll build'
            },
            buildStg: {
                cmd: 'JEKYLL_ENV=staging jekyll build'
            },
            buildPrd: {
                cmd: 'JEKYLL_ENV=production jekyll build'
            },

            // deploys
            deployStg: {
                cmd: 'rsync -azpog --progress --delete-excluded --exclude "Gruntfile.js" --exclude "img/src-sprite" --exclude "package.json" --exclude "node_modules/" --exclude "readme.md" -e "ssh -q" _site/ root@andrewslince.me:/var/www/beta.maternidadesmanaus.com.br/'
            },
            deployPrd: {
                // cmd: 'rsync -azpog --progress --delete-excluded --exclude "Gruntfile.js" --exclude "img/src-sprite" --exclude "package.json" --exclude "node_modules/" --exclude "readme.md" -e "ssh -q" _site/ root@andrewslince:/var/www/maternidadesmanaus/'
                cmd: 'echo "\nPara que seus dentes se mantenham intactos, o deploy de PRD ainda está desabilitado! :)\n"'
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
    grunt.registerTask('default', [ 'exec:buildDev', 'concat' ]);
    grunt.registerTask('update-form', [ 'exec:updateForm', 'exec:buildDev', 'concat' ]);
    grunt.registerTask('deploy-stg', [
        'exec:buildStg',
        'uglify',
        'htmlmin',
        'imagemin',
        'cssmin',
        'exec:deployStg'
    ]);
    grunt.registerTask('deploy-prd', [
        'exec:buildPrd',
        'uglify',
        'htmlmin',
        'imagemin',
        'cssmin',
        'exec:deployPrd'
    ]);
};

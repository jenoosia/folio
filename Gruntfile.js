module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        
        copy: {
            build: {
                files: [
                    //JS
                    { expand: true, cwd: '<%=jsBowerDir %>requirejs/', src: ['require.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>handlebars/', src: ['handlebars.runtime.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>jquery/', src: ['jquery.min.js', 'jquery-migrate.min.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>json3/lib/', src: ['json3.min.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>knockout.js/', src: ['knockout.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>zepto/', src: ['zepto.min.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>modernizr/', src: ['modernizr.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>underscore/', src: ['underscore-min.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>jquery-colorbox/', src: ['jquery.colorbox-min.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>history.js/scripts/bundled/html4+html5/', src: ['jquery.history.js'], dest: '<%=jsVendorDir %>', filter: 'isFile' },
                    //CSS
                    { expand: true, cwd: '<%=jsBowerDir %>normalize-css/', src: ['normalize.css'], dest: '<%=sassDir %>vendor/', 
                      rename: function(dest, src) { return dest + '_normalize.scss'; }, filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>font-awesome/css/', src: ['font-awesome.min.css'], dest: '<%=rootDir %>css/', filter: 'isFile' },
                    { expand: true, cwd: '<%=jsBowerDir %>font-awesome/font/', src: ['**'], dest: '<%=rootDir %>font/', filter: 'isFile' },
                ]
            }
        },
        uglify: {
            options: {},
            build: {
                files: {
                    '<%=jsVendorDir %>require.min.js': ['<%=jsVendorDir %>require.js'],
                    '<%=jsVendorDir %>modernizr.dev.min.js': ['<%=jsVendorDir %>modernizr.js'],
                    '<%=jsVendorDir %>handlebars.runtime.min.js': ['<%=jsVendorDir %>handlebars.runtime.js']
                }
            }
        },
        
        watch: {
            compass: {
                files: ['<%=sassDir %>**/*.scss'],
                tasks: ['compass:dev']
            }
        },
        
        rootDir: 'public/',
        jsBowerDir: 'bower_components/',
        jsDir: '<%= rootDir %>js/',
        jsDistDir: '<%= jsDir %>dist/',
        jsVendorDir: '<%= jsDir %>vendor/',
        sassDir: 'sass/'
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    
    grunt.registerTask('build', ['copy:build', 'uglify:build']);
    
    grunt.registerTask('default', ['watch']);
};
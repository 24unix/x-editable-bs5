function getFiles() {
    //directories  
    var
    lib = 'src/',
    forms = lib+'editable-form/',
    inputs = lib+'inputs/',
    containers = lib+'containers/';  

    //config for Bootstrap 5 only
    var config = {
        bootstrap5: {
            filePrefix: 'bootstrap', //to have bootstrap-editable.js instead of bootstrap5-editable
            form: [forms+'editable-form-bootstrap5.js'],
            container: [containers+'editable-popover5.js'],
            inputs: [
                // Bootstrap-datepicker now loaded from npm, not bundled
                inputs+'date/date.js',
                inputs+'date/datefield.js'
            ],
            css: [
                // Bootstrap-datepicker CSS now loaded from npm, not bundled
            ]
        }
    };

    //common js files 
    var js = [
        forms+'editable-form.js',
        forms+'editable-form-utils.js',
        containers+'editable-container.js', 
        containers+'editable-inline.js',
        lib+'element/editable-element.js',
        inputs+'abstract.js',
        inputs+'list.js',
        inputs+'text.js',
        inputs+'textarea.js',
        inputs+'select.js',    
        inputs+'checklist.js',
        inputs+'html5types.js'
    ]; 

    //common css files
    var css = [
        forms+'editable-form.css',
        containers+'editable-container.css', 
        lib+'element/editable-element.css'
    ];

    //create 'concat' and 'uglify' tasks
    var task, folder, dest, concat_files = {}, min_files = {};
    for(var k in config) {
        folder = '<%= dist %>/'+k+'-editable/';
        var prefix = config[k].filePrefix || k;
        
        //js
        task = k+'_js';
        dest = folder+'js/'+prefix+'-editable'+ (k === 'jquery' ? '-poshytip' : '');
        concat_files[task] = {
            src:  js.concat(config[k].form).concat(config[k].container).concat(config[k].inputs),
            dest: dest+'.js'
        };
        min_files[task] = {
            src: ['<%= concat.'+task+'.dest %>'],
            dest: dest + '.min.js'
        };      

        //css
        concat_files[k+'_css'] = {
            src: css.concat(config[k].css),
            dest: folder+'css/'+prefix+'-editable.css'
        };
    }  

    return {concat_files: concat_files, min_files: min_files};  

} 

/*global module:false*/
module.exports = function(grunt) {

 grunt.util.linefeed = '\n';

 grunt.loadNpmTasks('grunt-contrib-clean');
 grunt.loadNpmTasks('grunt-contrib-concat');
 grunt.loadNpmTasks('grunt-contrib-uglify');
 grunt.loadNpmTasks('grunt-contrib-qunit');
 grunt.loadNpmTasks('grunt-contrib-connect');
 grunt.loadNpmTasks('grunt-contrib-jshint');
 grunt.loadNpmTasks('grunt-contrib-copy');
 //grunt.loadNpmTasks('grunt-contrib-requirejs');

 //module for testing
 var module = ''; 
// module = '&module=textarea';
//module = '&module=select';
//module = '&module=text';    

 //get js and css for different builds
 var files = getFiles();
 
 var banner = '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> \n' +
        '* <%= pkg.description %>\n' +
        '* <%= pkg.homepage %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n';
 
 files.concat_files.options = {banner: banner};
 files.min_files.options = {banner: banner};
 
 
 // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dist: 'dist',
    
    // clean: ['<%= dist %>'],
    
    concat: files.concat_files,
    
    uglify: files.min_files,
     
    qunit: {
      bootstrap5: {
          options: {
            urls: [
                  'http://localhost:8000/test/index.html?f=bs5&c=popup'+module,
                  'http://localhost:8000/test/index.html?f=bs5&c=inline'+module
                 ]
          }
      }         
    },
    
    connect: {
        server: {
            port: 8000,
            base: '.'
        }
    },    
    
    jshint: {
      options: {
        esversion: 6,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        evil: false,
        globals: {
            jQuery: true,
            console: true
        },  
      },
      js: [   'Gruntfile.js', 
              'src/editable-form/*.js', 
              'src/containers/*.js', 
              'src/element/*.js', 
              'src/inputs/*.js', 
              'src/inputs/date/*.js'
          ]
    },
    copy: {
        dist: {
            files: [
            //image
            {expand: true, flatten: true, dest: '<%= dist %>/bootstrap5-editable/img/', src: 'src/img/*'},
            //licences
            {expand: true, flatten: true, dest: '<%= dist %>/', src: ['LICENSE-MIT', 'README.md', 'CHANGELOG.txt']}
            ]
        }      
    }
  });

  //test task
  grunt.registerTask('test', ['jshint', 'connect', 'qunit:bootstrap5']);  
  
  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);

  // alive server
  grunt.registerTask('server', 'connect:server:keepalive');
  
  // build
  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy']);
  
 //to run particular task use ":", e.g. copy:libs 
};


var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {
  grunt.initConfig({
    imagemin: {                          // Task
      dynamic: {                         // Another target
        options: {                       // Target options
          optimizationLevel: 3,
          progressive: true,
          use: [mozjpeg()]
        },
        files: [{
          expand: true,                 // Enable dynamic expansion
          cwd: 'old_images/',           // Src matches are relative to this path
          src: ['**/*.{png,jpg}'],      // Actual patterns to match
          dest: 'img/'                  // Destination path prefix
        }]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['imagemin']);
}
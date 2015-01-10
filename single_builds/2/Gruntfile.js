var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {
  grunt.initConfig({
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3,
          progressive: true,
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'old_images/',
          src: ['**/*.{png,jpg}'],
          dest: 'img/'
        }]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['imagemin']);
}
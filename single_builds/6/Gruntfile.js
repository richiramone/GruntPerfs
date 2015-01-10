
module.exports = function(grunt) {
  grunt.initConfig({
    colorguard: {
      options: {
        threshold : 3
      },
      files: {
        src: ['css/style.css'],
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-colorguard');

  grunt.registerTask('default', ['colorguard']);
}


module.exports = function(grunt) {
  grunt.initConfig({
    uncss: {
      dist: {
        options: {
          timeout      : 10000,
          report       : 'max'
        },
        files: {
          'css/clean-style.min.css': ['index.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-uncss');

  grunt.registerTask('default', ['uncss']);
}
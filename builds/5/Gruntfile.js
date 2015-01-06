
module.exports = function(grunt) {
  grunt.initConfig({
    critical: {
      dist: {
        base: './', 
        width: 1280,
        height: 1200,
        minify: true,
        src: 'original-index.html',
        dest: 'index.html'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-critical');

  grunt.registerTask('default', ['critical']);
}

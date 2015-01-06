
module.exports = function(grunt) {
  grunt.initConfig({
    critical: {
      dist: {
        options: {
            base: './',
            css: ['css/style.css'],
            width: 1280,
            height: 900,
            minify: true,
            htmlTarget: 'index.html',
            extract: true,
            generateInline: true
        },
        src: 'original-index.html',
        dest: 'css/critical-styles.css'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-critical');

  grunt.registerTask('default', ['critical']);
}

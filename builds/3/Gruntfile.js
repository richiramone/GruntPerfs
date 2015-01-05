
module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      options: {
        mangle: {
          except: ['jQuery', '$', 'Modernizr','_slot']
        }
      },
      my_target: {
        files: {
          'js/scripts.min.js': ['js/scripts.js'],
          'js/cn_banner.min.js': ['js/cn_banner.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
}
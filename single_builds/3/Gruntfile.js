
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
    },
    cssmin: {
      target: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'css/style.min.css': ['css/style.css']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeCommentsFromCDATA: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        },
        files: {
          'index.html': 'original_index.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('default', ['uglify','cssmin','htmlmin']);
}
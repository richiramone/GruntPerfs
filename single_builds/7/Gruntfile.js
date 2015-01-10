
module.exports = function(grunt) {
  grunt.initConfig({
    perfbudget: {
      default: {
        options: {
          url: 'http://lucasramos.me/gruntperfs/builds/7/',
          key: 'A.d01077156635968a5bd2637fda103bd2',
          runs: 2
        }
      }
    },
    pagespeed: {
      dev: {
        options: {
          nokey: true,
          url: "http://lucasramos.me/gruntperfs/builds/7/index.html",
          locale: "it_IT",
          strategy: "desktop",
          threshold: 70
        }
      }
    },
    phantomas: {
      dev : {
        options : {
          indexPath : './phantomas/',
          url       : 'http://lucasramos.me/gruntperfs/builds/7/index.html',
          buildUi   : true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-perfbudget');
  grunt.loadNpmTasks('grunt-pagespeed');
  grunt.loadNpmTasks('grunt-phantomas');

  grunt.registerTask('default', ['perfbudget', 'pagespeed', 'phantomas']);
}

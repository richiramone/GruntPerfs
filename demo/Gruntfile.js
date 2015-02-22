'use strict'

var ngrokUrl = 'http://3da7ad24.ngrok.com',
    remoteUrl = 'http://gruntperfs.lucasramos.me/',
    mozjpeg = require('imagemin-mozjpeg'),
    casper = require('casper').create();

module.exports = function(grunt) {

  var yslowTestFile = 'perfs-analytics/yslow-reports/yslow_' + grunt.template.today('dd-mm-yyyy_hh.mm.ss') + '.json';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    colorguard: {
      options: {
        threshold : 3
      },
      files: {
        src: ['dev/media/css/style.css']
      }
    },
    less: {
      dev: {
        options: {
          paths: ["dev/media/less"]
        },
        files: {
          "dev/media/css/style.css": "dev/media/less/style.less"
        }
      }
    },
    uncss: {
      dev: {
        options: {
          media: ['all'],
          ignore: [],
          timeout: 15000,
          report: 'min'
        },
        files: {
          'dev/media/css/style.css': ['dev/index.html']
        }
      }
    },
    critical: {
      dev: {
        options: {
          minify: true,
          extract: true,
          base: 'dev/',
          width: 980,
          height: 600
        },
        src: 'dev/index.html',
        dest: 'dev/index.critical.html'
      }
    },
    cssmin: {
      dev: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          cwd: 'dev/media/css',
          src: ['style.*.css'],
          dest: 'prod/media/css/'
        }]
      }
    },
    htmlmin: {
      dev: {
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
          'prod/index.html': 'dev/index.critical.html'
        }
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery', '$']
        }
      },
      dev: {
        files: {
          'prod/media/js/scripts.js': ['dev/media/js/scripts.js']
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 7,
          interlaced: true,
          progressive: true,
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'dev/media/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'prod/media/images'
        }]
      }
    },
    phantomcss: {
      options: {
        screenshots: 'perfs-analytics/diffs/screenshots/',
        results: 'perfs-analytics/diffs/results/',
        viewportSize: [1280, 800]
      },
      src: [
        'perfs-analytics/diffs/tests/casper.js'
      ]
    },
    perfbudget: {
      prod: {
        options: {
          url: remoteUrl,
          key: 'A.d01077156635968a5bd2637fda103bd2',
          location: 'Dulles:Chrome',
          runs: 2,
          budget: {
            render: '30000',
            SpeedIndex: '100000'
          }
        }
      }
    },
    yslow_test: {
      options: {
        info: "grade",
        format: "json",
        urls: [remoteUrl],
        reports: [yslowTestFile]
      },
      your_target: {
        files: []
      }
    },
    pagespeed: {
      prod: {
        options: {
          nokey: true,
          locale: "it_IT",
          strategy: "desktop",
          threshold: 30,
          url: remoteUrl
        }
      }
    },
    devperf: {
      options: {
        urls: ['http://gruntperfs.lucasramos.me/'],
        numberOfRuns: 1,
        timeout: 120,
        openResults: true,
        resultsFolder: 'perfs-analytics/devperf'
      },
      phantomasOptions: {
        numberOfRuns: 1,
        'no-externals': false,
        'allow-domain': 'googleapis.com,fbcdn.net,vmmpxl.com,amctv.com,quantserve.com,adnxs.com,tubemogul.com,adsrvr.org,pointroll.com,doubleclick.net,google-analytics.com,facebook.com,amazonaws.com,tubemogul.com,exelator.com',
        'timeout': 60,
        verbose: true,
        assertions : {
          bodyHTMLSize: 100500,
          jsErrors: 150
        }
      }
    },
    yslow: {
      options: {
        thresholds: {
          weight: 10000,
          speed: 50000,
          score: 1,
          requests: 500
        }
      },
      pages: {
        files: [{
          src: remoteUrl
        }]
      }
    }
  });

  grunt.registerTask('dev', ['colorguard', 'phantomcss' /* csslint, jslint */]);

  grunt.registerTask('build', [
    'less',
    'uncss',
    'critical',
    'cssmin',
    'htmlmin',
    'uglify',
    'imagemin',
    'phantomcss'
  ]);

  grunt.registerTask('analysis', [
    'perfbudget',
    'pagespeed',
    'devperf',
    'yslow_test',
    'yslow'
  ]);
};

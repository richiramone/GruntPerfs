'use strict'

var ngrokUrl = 'http://3da7ad24.ngrok.com',
    remoteUrl = 'http://gruntperfs.lucasramos.me/',
    mozjpeg = require('imagemin-mozjpeg'),
    casper = require('casper').create();

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    colorguard: {
      options: {
        threshold : 3
      },
      files: {
        src: ['media/css/style.css'],
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      first: {
        files: {
          'media/css/style.min.css': ['media/css/style.css']
        }
      },
      second: {
        files: {
          'media/css/style.min.css': ['media/css/style.uncss.css']
        }
      },
      third: {
        files: [{
          expand: true,
          cwd: 'media/css',
          src: ['style.min.*.css'],
          dest: 'media/css/'
        }]
      }
    },
    uncss: {
      dist: {
        options: {
          media: ['all'],
          ignore: [],
          timeout: 15000,
          report: 'min'
        },
        files: {
          'media/css/style.uncss.css': ['index.original.html']
        }
      }
    },
    critical: {
      dist: {
        options: {
          minify: true,
          extract: true,
          base: './',
          width: 980,
          height: 600
        },
        src: 'index.original.html',
        dest: 'index.critical.html'
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
          'index.html': 'index.critical.html'
        }
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery', '$', 'Modernizr','_slot']
        }
      },
      my_target: {
        files: {
          'media/js/unified.min.js': ['media/js/unified.js']
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
          cwd: 'media/images_no_compression',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'media/images'
        }]
      }
    },
    phantomcss: {
      options: {
        screenshots: 'diffs/screenshots/',
        results: 'diffs/results/',
        viewportSize: [1280, 800]
      },
      src: [
        'diffs/tests/casper.js'
      ]
    },
    perfbudget: {
      default: {
        options: {
          url: remoteUrl,
          key: 'A.d01077156635968a5bd2637fda103bd2',
          location: 'Dulles:Chrome',
          runs: 2,
          budget: {
            render: '30000',
            SpeedIndex: '100000',
          }
        }
      }
    },
    yslow_test: {
      options: {
        info: "grade",
        format: "junit",
        urls: [remoteUrl],
        reports: ['./yslow-reports/yslow.xml']
      },
      your_target: {
        files: []
      }
    },
    pagespeed: {
      dev: {
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
        resultsFolder: './devperf'
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
        files: [
          {
            src: remoteUrl
          }
        ]
      }
    }
  });

  grunt.registerTask('default', [  
    'colorguard',
    'cssmin:first',
    'uncss',
    'cssmin:second',
    'critical',
    'cssmin:third',
    'htmlmin'
    'uglify',
    'imagemin',
    
    'phantomcss',
    'perfbudget',
    'yslow_test',
    'pagespeed',
    'devperf',
    'yslow'
  ]);
};


'use strict'

var ngrokUrl = 'http://3da7ad24.ngrok.com',
    remoteUrl = 'http://gruntperfs.lucasramos.me/',
    mozjpeg = require('imagemin-mozjpeg'),
    casper = require('casper').create();

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
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
          'index.min.html': 'index.html'
        }
      }
    },
    uncss: {
      dist: {
        options: {
          media        : ['all'],
          ignore       : [],
          timeout      : 15000,
          report       : 'max'
        },
        files: {
          'media/css/clean-style.css': ['index.html']
        }
      }
    },
    colorguard: {
      options: {
        threshold : 3
      },
      files: {
        src: ['media/css/clean-style.css'],
      }
    },
    critical: {
      dist: {
        base: './', 
        width: 1280,
        height: 1200,
        minify: true,
        src: 'index.html',
        dest: 'index.critical.html'
      }
    },
    cssmin: {
      target: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'media/css/style.min.css': ['media/css/clean-style.css']
        }
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
    //'uncss',
    //'colorguard',
    //'critical',
    //'cssmin'
    //'imagemin'
    //'uglify',
    'htmlmin'
    
    //'phantomcss',
    //'perfbudget',
    //'yslow_test',
    //'pagespeed',
    //'devperf'
    //'yslow'
  ]);
};


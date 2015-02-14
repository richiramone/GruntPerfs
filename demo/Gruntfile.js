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
          'index.min.html': 'index.html'
        }
      }
    },
    colorguard: {
      options: {
        threshold : 3
      },
      files: {
        src: ['media/css/style.css'],
      }
    },
    uncss: {
      dist: {
        options: {
          media        : ['all',
                          '(min-width:768px)',
                          '(min-width:992px)',
                          '(min-width:1281px)',
                          '(max-width:767px)',
                          '(max-width:1280px)',
                          '(max-width:1281px)',
                          'screen and (min-width:768px)',
                          'screen and (max-width:1280px)',
                          '(min-width:768px) and (max-width:991px)',
                          '(min-width:992px) and (max-width:1280px)'],
          
          ignore       : ['#header.affix',
                          '.affix',
                          '.wide-carousel li.active article .next',
                          '.wide-carousel li.active article .prev',
                          '.wide-carousel li.active article header',
                          '.wide-carousel.created',
                          '.open>.dropdown-menu',
                          '.search-bar-open #header #search-bar',
                          '.paged-carousel.created',
                          '.open>a',
                          'span.label-open',
                          '.open>.dropdown-menu',
                          '#abbonati.dropdown-open',
                          '#abbonati.dropdown-open .secondary',
                          '#abbonati.dropdown-open .secondary #edicola',
                          '.paged-carousel .pages a',
                          '.paged-carousel .pages a:after',
                          '.paged-carousel .pages a.selected',
                          '.paged-carousel .pages a span',
                          '#abbonati .secondary .open .label-close',
                          '#header .secondary .open .label-close',
                          '#abbonati .secondary .open .label-open',
                          '#header .secondary .open .label-open',
                          'hover'],
          timeout      : 15000,
          report       : 'max'
        },
        files: {
          'css/clean-style.css': ['original-index.html']
        }
      }
    },
    critical: {
      dist: {
        base: './', 
        width: 1280,
        height: 1200,
        minify: true,
        src: 'index.html',
        dest: 'index.html'
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
    }
  });

  // Register default tasks
  grunt.registerTask('default', [  
    //'imagemin'
    //'uglify',
    //'cssmin',
    //'htmlmin',
    //'colorguard',
    //'uncss'
    //'critical',
    //'phantomcss',
    'perfbudget',
    'yslow_test',
    'pagespeed',
    'devperf',
    'yslow'
  ]);
};


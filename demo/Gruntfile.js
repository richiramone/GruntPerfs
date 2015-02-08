'use strict'

var mozjpeg = require('imagemin-mozjpeg'),
    ngrok = require('ngrok');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3,
          progressive: true,
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'old_images/',
          src: ['**/*.{png,jpg}'],
          dest: 'img/'
        }]
      }
    },
    colorguard: {
      options: {
        threshold : 3
      },
      files: {
        src: ['css/style.css'],
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
          'index.html': 'index.html'
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

    perfbudget: {
      default: {
        options: {
          url: 'http://lucasramos.me/gruntperfs/builds/7/',
          key: 'A.d01077156635968a5bd2637fda103bd2',
          runs: 2
        }
      }
    },
    yslow: {
      options: {
        thresholds: {
          weight: 180,
          speed: 1000,
          score: 80,
          requests: 15
        }
      },
      pages: {
        files: [
          {
            src: 'http://andyshora.com'
          },
          {
            src: 'http://www.google.co.uk',
            thresholds: {
              weight: 100
            }
          }
        ]
      }
    },

    phantomas: {
      dev : {
        options : {
          indexPath: './phantomas/',
          url: 'http://localhost:80',
          buildUi: true,
          numberOfRuns: 1,
          'no-externals': true,
          'allow-domain': 'connect.facebook.net,platform.twitter.com',
          'timeout': 60,
          verbose: true,
          assertions : {
            bodyHTMLSize: 10500,
            jsErrors: 15
          },
          group: {
            'REQUESTS' : [
              'requests',
              'gzipRequests',
              'postRequests',
              'httpsRequests',
              'notFound',
              'multipleRequests',
              'maxRequestsPerDomain',
              'domains',
              'medianRequestsPerDomain',
              'redirects',
              'redirectsTime',
              'smallestResponse',
              'biggestResponse',
              'smallestLatency',
              'biggestLatency',
              'medianResponse',
              'medianLatency',
              'assetsNotGzipped'
            ],
            'TIMINGS' : [
              'timeToFirstByte',
              'timeToFirstImage',
              'slowestResponse',
              'onDOMReadyTime',
              'onDOMReadyTimeEnd',
              'windowOnLoadTime',
              'windowOnLoadTimeEnd',
              'httpTrafficCompleted',
              'timeBackend',
              'timeFrontend'
            ],
            'HTML' : [
              'bodyHTMLSize',
              'iframesCount',
              'imagesScaledDown',
              'imagesWithoutDimensions',
              'commentsSize',
              'hiddenContentSize',
              'DOMelementsCount',
              'nodesWithInlineCSS'
            ],
            'JAVASCRIPT' : [
              'documentWriteCalls',
              'evalCalls',
              'jsErrors',
              'consoleMessages',
              'globalVariables',
              'ajaxRequests'
            ],
            'DOM' : [
              'DOMqueries',
              'DOMqueriesById',
              'DOMqueriesByClassName',
              'DOMqueriesByTagName',
              'DOMqueriesByQuerySelectorAll',
              'DOMinserts',
              'DOMqueriesDuplicated',
              'domContentLoaded',
              'domContentLoadedEnd',
              'domComple',
              'DOMidDuplicated'
            ],
            'HEADERS' : [
              'headersCount',
              'headersSentCount',
              'headersRecvCount',
              'headersSize',
              'headersSentSize',
              'headersRecvSize'
            ],
            'CACHING' : [
              'cacheHits',
              'cacheMisses',
              'cachePasses',
              'cachingNotSpecified',
              'cachingTooShort',
              'cachingDisabled'
            ],
            'COOKIES' : [
              'cookiesSent',
              'cookiesRecv',
              'domainsWithCookies',
              'documentCookiesLength',
              'documentCookiesCount'
            ],
            'COUNTS & SIZES' : [
              'contentLength',
              'bodySize',
              'htmlSize',
              'htmlCount',
              'cssSize',
              'cssCount',
              'jsSize',
              'jsCount',
              'jsonSize',
              'jsonCount',
              'imageSize',
              'imageCount',
              'webfontSize',
              'webfontCount',
              'base64Size',
              'base64Count',
              'otherCount',
              'otherSize'
            ],
            'JQUERY' : [
              'jQueryOnDOMReadyFunctions'
            ]
          }
        }
      }
    },
    yslow_test: {
      options: {
        info: "grade",
        format: "junit",
        urls: ['http://localhost:80'],
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
          threshold: 30
        }
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 80;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      grunt.task.run('yslow_test');
      grunt.task.run('phantomas');
      done();
    });
  });

  // Register default tasks
  grunt.registerTask('default', [  
  /*'imagemin',
    'colorguard',
    'uncss',
    'uglify',
    'cssmin',
    'htmlmin',
    'critical',

    'perfbudget',
    'yslow',*/

    'psi-ngrok'
  ]);
};


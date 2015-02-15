casper.start('http://gruntperfs.demo/')
  .then(function() {
    phantomcss.screenshot('html');
});
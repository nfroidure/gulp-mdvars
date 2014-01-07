var fs = require('fs')
  , gulp = require('gulp')
  , gutil = require('gulp-util')
  , es = require('event-stream')
  , mdvars = require('../src/index')
  , assert = require('assert')
;


describe('gulp-mdvars', function() {

  describe('in stream mode', function() {

    it('should work with a valid file', function(done) {
      gulp.src('tests/fixtures/simple.meta.md', {buffer: false})
        .pipe(mdvars())
        .pipe(es.map(function(file){
          file.contents.pipe(es.wait(function(err, data) {
            assert(file.metas);
            assert.equal(file.metas.title, 'A markdown file');
            assert.equal(file.metas.description, 'This is a simple markdown file');
            assert.equal(
              data,
              fs.readFileSync('tests/fixtures/simple.md', 'utf8')
            );
            done();
          }));
        }));
    });

  });

  describe('in buffer mode', function() {

    it('should work with a valid file', function(done) {
      gulp.src('tests/fixtures/simple.meta.md', {buffer: true})
        .pipe(mdvars())
        .pipe(es.map(function(file) {
          assert(file.metas);
          assert.equal(file.metas.title, 'A markdown file');
          assert.equal(file.metas.description, 'This is a simple markdown file');
          assert.equal(
            file.contents.toString('utf-8'),
            fs.readFileSync('tests/fixtures/simple.md', 'utf-8')
          );
          done();
        }));
    });

  });

});

var fs = require('fs');
var gutil = require('gulp-util');
var streamtest = require('streamtest');
var mdvars = require('../src/index');
var assert = require('assert');


describe('gulp-mdvars', function() {

  // Iterating through versions
  streamtest.versions.forEach(function(version) {

    describe('for ' + version + ' streams', function() {

      describe('with null contents', function() {

        it('should let null files pass through', function(done) {

          var stream = mdvars();
          var varsendEmitted = false;
          stream.pipe(streamtest[version].toObjects(function(err, files) {
            if(err) {
              return done(err);
            }
            assert.equal(files.length, 1);
            assert.equal(files[0].path, 'bibabelula.md');
            assert.equal(files[0].contents, null);
            done();
          }));
          stream.on('varsend', function() {
            varsendEmitted = true;
          });
          stream.write(new gutil.File({
            path: 'bibabelula.md',
            contents: null
          }));
          stream.end();

        });

      });

      describe('in stream mode', function() {

        it('should work with a valid file', function(done) {

          var stream = mdvars();
          var files = [];
          var varsendEmitted = false;
          stream.pipe(streamtest[version].toObjects(function(err, files) {
            if(err) {
              return done(err);
            }
            assert.equal(files.length, 1);
            assert.equal(files[0].path, 'tests/fixtures/simple.meta.md');
            files[0].contents.pipe(streamtest[version].toText(function(err, text) {
              assert(varsendEmitted);
              assert(files[0].metadata);
              assert.equal(files[0].metadata.title, 'A markdown file');
              assert.equal(files[0].metadata.description, 'This is a simple markdown file');
              assert.equal(
                text,
                fs.readFileSync('tests/fixtures/simple.md', 'utf-8')
              );
              done();
            }));
          }));
          stream.on('varsend', function() {
            varsendEmitted = true;
          });
          stream.write(new gutil.File({
            path: 'tests/fixtures/simple.meta.md',
            contents: fs.createReadStream('tests/fixtures/simple.meta.md')
          }));
          stream.end();
        });

      });

      describe('in buffer mode', function() {

        it('should work with a valid file', function(done) {

          var stream = mdvars();
          stream.pipe(streamtest[version].toObjects(function(err, files) {
            if(err) {
              return done(err);
            }
            assert.equal(files.length, 1);
            assert.equal(files[0].path, 'tests/fixtures/simple.meta.md');
            assert(files[0].metadata);
            assert.equal(files[0].metadata.title, 'A markdown file');
            assert.equal(files[0].metadata.description, 'This is a simple markdown file');
            assert.equal(
              files[0].contents.toString('utf-8'),
              fs.readFileSync('tests/fixtures/simple.md', 'utf-8')
            );
          }));
          stream.on('varsend', function() {
            done();
          });
          stream.write(new gutil.File({
            path: 'tests/fixtures/simple.meta.md',
            contents: fs.readFileSync('tests/fixtures/simple.meta.md')
          }));
          stream.end();

        });

      });

    });

  });

});

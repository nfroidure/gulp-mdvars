var gutil = require('gulp-util');
var Stream = require('readable-stream');
var mdvars = require('mdvars');

const PLUGIN_NAME = 'gulp-mdvars';

function gulpMdvars(options) {

  var stream = Stream.Transform({objectMode: true});
  var filesBuffer = [];
  var streamFlushCallback = null;

  options = options || {};
  options.prop = options.prop || 'metadata';

  stream._transform = function gulpMdvarsTransform(file, unused, done) {
    // When null just pass through
    if(file.isNull()) {
      stream.push(file); done();
      return;
    }

    var mdStream = new mdvars(file, options.prop);

    filesBuffer.push(file);
    mdStream.on('varsend', function() {
      filesBuffer.splice(filesBuffer.indexOf(file), 1);
      streamFlushCallback && streamFlushCallback();
    });

    var contents = file.pipe(mdStream);

    // Buffers
    if(file.isBuffer()) {
      file.contents = new Buffer('');

      contents.once('end', function() {
        stream.push(file);
        done();
      });

      contents.on('readable', function() {
        var chunk;
        while(null !== (chunk = contents.read())) {
          file.contents = Buffer.concat([file.contents, chunk]);
        }
      });

    // Streams
    } else {
      file.contents = contents;
      stream.push(file);
      done();
    }
  };

  stream._flush = function gulpMdvarsFlush(done) {
    streamFlushCallback = function() {
      if(!filesBuffer.length) {
        stream.emit('varsend');
        done();
      }
    };
    streamFlushCallback();
  };

  return stream;

}

module.exports = gulpMdvars;

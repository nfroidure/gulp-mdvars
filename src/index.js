var gutil = require('gulp-util');
var Stream = require('readable-stream');
var mdvars = require('mdvars');

const PLUGIN_NAME = 'gulp-mdvars';

function gulpMdvars(options) {

  var stream = Stream.Transform({objectMode: true});

  options = options || {};

  options.prop = options.prop || 'metas';

  options.varEvent = options.varEvent || 'end';

  stream._transform = function(file, unsed, done) {
    // When null just pass through
    if(file.isNull()) {
      stream.push(file); done();
      return;
    }

    var contents = file.pipe(new mdvars(file, options.prop));

    if('end' !== options.varEvent) {
      contents.on('varsend', function() {
        stream.emit(options.varEvent);
      });
    }

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

  return stream;

}

module.exports = gulpMdvars;

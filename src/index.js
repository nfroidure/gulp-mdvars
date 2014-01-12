var gutil = require('gulp-util')
  , Stream = require('stream')
  , mdvars = require('mdvars')
;

const PLUGIN_NAME = 'gulp-mdvars';

function gulpMdvars(options) {

  var stream = Stream.Transform({objectMode: true});
  
  options = options || {};

  options.prop = options.prop || 'metas';

  stream._transform = function(file, unsed, done) {
    // When null just pass through
    if(file.isNull()) {
      stream.push(file); done();
      return;
    }

    var contents = file.pipe(new mdvars(file, options.prop));

    // Buffers
    if(file.isBuffer()) {
      file.contents = new Buffer('');

      contents.on('data', function(chunk) {
        file.contents = Buffer.concat([file.contents, chunk]);
      });
      
      contents.once('end', function() {
        stream.push(file);
        done();
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

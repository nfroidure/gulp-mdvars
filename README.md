# gulp-mdvars
> Parse VarStream metadatas in a markdown file and reemit the cleaned up
 markdown content with [Gulp](http://gulpjs.com/).

[![NPM version](https://badge.fury.io/js/gulp-mdvars.svg)](https://npmjs.org/package/gulp-mdvars) [![Build status](https://secure.travis-ci.org/nfroidure/gulp-mdvars.svg)](https://travis-ci.org/nfroidure/gulp-mdvars) [![Dependency Status](https://david-dm.org/nfroidure/gulp-mdvars.svg)](https://david-dm.org/nfroidure/gulp-mdvars) [![devDependency Status](https://david-dm.org/nfroidure/gulp-mdvars/dev-status.svg)](https://david-dm.org/nfroidure/gulp-mdvars#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/nfroidure/gulp-mdvars/badge.svg?branch=master)](https://coveralls.io/r/nfroidure/gulp-mdvars?branch=master)

## Usage

First, install `gulp-mdvars` as a development dependency:

```shell
npm install --save-dev gulp-mdvars
```

Then, add it to your `gulpfile.js`:

```javascript
var mdvars = require('gulp-mdvars');
var marked = require('gulp-marked');

gulp.task('mdvars', function() {
  gulp.src(['assets/contents/*.md'])
    .pipe(mdvars({
      prop: 'metadata', // Datas will be set to the file object in the given property
     }))
    .pipe(marked()) // Do whatever you want with the cleaned up datas
    .pipe(gulp.dest('www/'));
});
```

`gulp-mdvars` is build on top of [mdvars](https://github.com/nfroidure/mdvars)
 and [varstream](https://github.com/nfroidure/VarStream) NPM modules. Please
 report specific issues in the corresponding repository.

## API

### mdvars(options)

#### options.prop
Type: `String`
Default value: `'metadata'`

A string value indicating in wich property metadatas must be filled.

## Stats

[![NPM](https://nodei.co/npm/gulp-mdvars.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-mdvars/)
[![NPM](https://nodei.co/npm-dl/gulp-mdvars.png)](https://nodei.co/npm/gulp-mdvars/)

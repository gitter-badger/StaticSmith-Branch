/**
 * StaticSmith-Branch Test Index
 * A StaticSmith module to run separate middleware pipelines on selected files
 *
 * Original foundation by: Eric Gjertsen <https://github.com/ericgj> -  
 * Original source: <https://github.com/ericgj/metalsmith-branch/tree/0.0.4>.
 * @since v0.0.4
 *
 * @see http:///TODO
 *
 * @author Jason Alan Kennedy <https://github.com/CelticParser>
 * @Link https://github.com/codePile/StaticSmith-Branch
 * @license http://opensource.org/licenses/GPL-3.0
 * Copyright (c) 2015 codePile.PBC
 *
 * @since StaticSmith-Branch v0.1.0
 *
 */

var assert = require('assert')
  , equal = require('assert-dir-equal')
  , path  = require('path')
  , clone = require('clone')
  , each = require('async').each
  , StaticSmith = require('staticsmith')
  , markdown = require('staticsmith-markdown')
  , debug = require('debug')('staticsmith-branch-test')
  , branch = require('..');

describe('staticsmith-branch', function() {

  function assertDirEqual(fix,done) {
    return function(err){
      if (err) return done(err);
      equal('test/fixtures/' + fix + '/expected', 'test/fixtures/' + fix + '/build');
      done();
    };
  }

  it('should process files selected by pattern, according to branch', function(done) {
    StaticSmith('test/fixtures/basic')
      .use( branch()
              .pattern('*.md')
              .use( markdown() )
          )
      .build( assertDirEqual('basic',done) );
  });

  it('should process files selected by pattern passed into constructor, according to branch', function(done) {
    StaticSmith('test/fixtures/basic')
      .use( branch('*.md')
              .use( markdown() )
          )
      .build( assertDirEqual('basic',done) );
  });

  it('branch pipelines should be able to add, update, and remove files', function(done) {
    function adder(files,ms,done) {
      function add(name,done) {
        var newf = path.basename(name, path.extname(name)) + '.2' + path.extname(name);
        files[newf] = clone(files[name]);
        done();
      }
      each(Object.keys(files), add, done);
    }

    function updater(files,ms,done) {
      function update(name,done) {
        var old = files[name].contents.toString().trim();
        files[name].contents = new Buffer(
          '<html><head></head><body>' + 
          old + 
          '</body></html>'
        );
        done();
      }
      each(Object.keys(files), update, done);
    }

    function remover(files,ms,done) {
      function remove(name,done) {
        delete files[name];
        done();
      }
      each(Object.keys(files), remove, done);
    }

    StaticSmith('test/fixtures/mutate')
      .use( branch('add.*'   ).use( adder ) )
      .use( branch('update.*').use( updater ) )
      .use( branch('remove.*').use( remover ) )
    .build( assertDirEqual('mutate',done) );
  });

  // TODO
  it('should process selected files through three plugins in a branch', function(done) {
    function adder(files,ms,done) {
      function add(name,done) {
        var newf = path.basename(name, path.extname(name)) + '.2' + path.extname(name);
        files[newf] = clone(files[name]);
        done();
      }
      debug('adder');
      each(Object.keys(files), add, done);
    }

    function updater(files,ms,done) {
      function update(name,done) {
        var old = files[name].contents.toString().trim();
        files[name].contents = new Buffer(
          '<html><head></head><body>' + 
          old + 
          '</body></html>'
        );
        done();
      }
      debug('updater');
      each(Object.keys(files), update, done);
    }

    function remover(files,ms,done) {
      function remove(name,done) {
        delete files[name];
        done();
      }
      debug('remover');
      each(Object.keys(files), remove, done);
    }

    StaticSmith('test/fixtures/multiplugin')
      .use( branch('*.txt')
              .use( adder   ) 
              .use( updater ) 
              .use( remover ) 
          )
    .build( assertDirEqual('multiplugin',done) );
  });

  it('should process files according to two branches, branch selections do not intersect');

  it('should process files according to two branches, branch selections intersect');

  it('should process files according to nested branches', function(done) {

   function hasLicense(file,props){
     return props.license && props.author;
   }

   function appendLicense(files,ms,done) {
     function append(file,done) {
       var str = [
         "",
         "-----",
         "Licensed " + files[file].license + " by " + files[file].author,
       ].join("\n");
       var contents = files[file].contents
         , len = contents.length;
       contents.length = len + str.length;
       contents.write(str,len);
       done();
     }
     debug('appendLicense');
     each(Object.keys(files), append, done);
   }

   StaticSmith('test/fixtures/nested')
     .use( branch('*.md')
        .use( branch( hasLicense )
          .use( appendLicense )
        )
        .use( markdown() )
     )
     .build( assertDirEqual('nested', done) );
  });

});
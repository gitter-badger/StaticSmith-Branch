/**
 * StaticSmith-Branch
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

'use strict';

var Ware  = require('ware')
  , match = require('multimatch')
  , debug = require('debug')('staticsmith-branch')
  , clone = require('clone')
  , has   = hasOwnProperty;

module.exports = function plugin(matcher) {

  var files, root;
  var filter = function() {
    return true;
  };
  var ware = new Ware();

  branch.use = function(fn) {
    ware.use(fn);
    return this;
  };

  branch.filter = function(fn) {
    filter = fn;
    return this;
  };

  branch.pattern = function(pattern) {
    debug('pattern: ' + pattern);
    return this.filter(function(file) {
      return !!match(file, pattern)[0];
    });
  };

  /**
   * Run filtered set of files through branch pipeline
   * and mutate root (staticsmith) files afterwards.
   *
   * Note also that root is injected.
   * That way, you can mutate the metadata directly in middleware
   *
   * Note also `done` callback is passed in from root.
   *
   */
  function run(fn) {
    var selected = filterObject(files, filter)
      , keys     = Object.keys(selected);

    debug("selected files: " + Object.keys(selected).join(", "));

    ware.run(selected, root, function(err) {
      if (err) return fn(err);
      fullMerge(files, selected, keys);
      debug("files after branch processed: " + Object.keys(files).join(", "));
      fn();
    });
  }

  /**
   * Function called by root (staticsmith) pipeline
   *
   */
  function branch(f, staticsmith, done) {
    files = f;
    root = staticsmith;
    if (matcher == undefined) {}
    else if (typeof matcher == "function") {
      branch.filter(matcher);
    }
    else {
      branch.pattern(matcher);
    }
    run(done);
  }

  return branch;

};


// utils


function filterObject(obj, filt) {
  var ret = {},
    i = -1;
  for (var k in obj) {
    i = i + 1;
    if (has.call(obj, k)) {
      if (filt(k, obj[k], i)) ret[k] = obj[k];
    }
  }
  return ret;
}

function fullMerge(obj, selected, keys) {
  keys = keys || [];

  // add new and replace modified
  for (var k in selected) {
    if (has.call(selected, k)) obj[k] = selected[k];
  }

  // delete deleted
  for (var i = 0; i < keys.length; ++i) {
    var k = keys[i];
    if (!(has.call(selected, k))) delete obj[k];
  }

}

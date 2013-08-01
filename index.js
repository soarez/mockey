var assert = require('assert');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var verbose = process.env.VERBOSE;

module.exports = CreateMock;

function CreateMock(methods) {

  methods = methods || [];

  assert(methods instanceof Array, 'methods must be an array');

  function f(name) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(name);
      mock.emit.apply(mock, args);
      if (verbose) console.log.apply(console, args);
    }
  }

  var mock = f('');
  var emitter = new EventEmitter;
  util._extend(mock, emitter);

  [
    'addListener',
    'on',
    'once',
    'removeListener',
    'removeAllListeners',
    'setMaxListeners',
    'listeners',
    'emit'
  ].forEach(function(method) { mock[method] = emitter[method]; });

  methods.forEach(function(m) {
    mock[m] = f(m);
  });

  return mock;
}


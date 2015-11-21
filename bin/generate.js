#!/usr/bin/env node

var path = require('path');
var stamp = require('time-stamp');
var gray = require('ansi-gray');
var Generate = require('..');
var expand = require('expand-args');
var create = require('../lib/runner');
var runnerArgv = require('../lib/argv');
var utils = require('../lib/utils');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});


var Runner = create(Generate);
var cli = new Runner();


var cmd = expand(argv);
console.log(cmd);

cli.on('error', function(err) {
  console.log(err);
});

cli.on('*', function (method, key, val) {
  console.log(method + ':', key, val);
});

if (argv.verbose) {
  cli.on('register', function(key) {
    utils.ok(utils.gray('registered'), 'generator', utils.cyan(key));
  });
}

cli.resolve(['generate-*/generate.js'], {
  resolveGlobal: true,
});

cli.use(runnerArgv(argv));

console.log(cli.argv())

// console.log(cmd)
var task = cmd.list ? ['list', 'default'] : 'default';

cli.task('default', function(cb) {
  console.log('generate > "default" task');
  cb();
});


cli.build(task, function (err) {
  if (err) console.error(err);
  timestamp('done');
});

function timestamp(msg) {
  var time = ' ' + gray(stamp('HH:mm:ss.ms', new Date()));
  return console.log(time, msg, utils.green(utils.successSymbol));
}

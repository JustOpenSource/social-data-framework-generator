#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var sdf = new require('social-data-framework')();

console.log(sdf.test());

console.log('Social Data Framework Generator (sdfg) : sdfg-build');

console.dir(argv);
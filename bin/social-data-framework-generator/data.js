#! /usr/bin/env node

var jfs = require('json-from-schema');
var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();
var _ = require('underscore');
var fs = require('fs');

var DEFAULT_SAMPLE_SIZE = 1000;

if(!argv.d){
    console.log('\n-d is required (directory of sdfg config package.\n');
    return;
}

var root = dirname + '/' + argv.d + '/';

var path = root + 'schema.json';
var schema = require(path);
var schemaId = schema.id;
var gen = new jfs.JsonFromSchema([schema]);

var sampleSize = argv.s || DEFAULT_SAMPLE_SIZE;

var results = [];

while(sampleSize) {

    var sample = gen.generate(schemaId, {additionalProperties:false,requireAll:true});

    results.push(sample);

    sampleSize--;

}

fs.writeFile(root + 'data/sample.json', JSON.stringify(results), function (err) {
        
    if (err) {

        console.log('ERROR: could not write to /data/sample.json');

        return;
    }

    console.log('SUCCESS: created /data/sample.json');
});




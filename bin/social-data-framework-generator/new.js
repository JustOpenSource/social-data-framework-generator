#! /usr/bin/env node

var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');
var prompt = require('prompt');

var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();

var USER_NAME = 'Your OpenID Username (leave blank or you can change later)';
var PROJECT_DIR = 'Project Directory Name (required)';
var SCHEMA_NAME = 'Schema Name (required)';
var SCHEMA_DESC = 'Schema Description (leave blank or you can change later)';

/*********************
BUILD DIRECTORY OUTPUT STRUCTURE
*/

var DIR_STRUCTURE = {
    "config" : [],
    "lang" : [],
    "data" : null
};

//set the config stubs to generate the new package
addConfigs('details_edit');
addConfigs('details');
addConfigs('infographics');
addConfigs('list_filters');
addConfigs('list');
addConfigs('public_api');
addConfigs('system');

var SCHEMA_STUB = {
    "id" : null,
    "type" : "object",
    "description" : "",
    "type" : "object",
    "properties" : {}
};

function main(){

    //start up the prompt engine
    prompt.start();


    /*********************
    TEST FOR HELP
    */

    if(argv.h){
        printHelp();
        return;
    }

    /*********************
    TITLE
    */

    console.log('');
    console.log('Social Data Framework Generator - Create New Project');
    console.log('--------------------------------------\n');


    /*********************
    GET INPUT
    */

    prompt.get([PROJECT_DIR, SCHEMA_NAME, USER_NAME, SCHEMA_DESC], function (err, result) {

        makeContents(result, DIR_STRUCTURE);

        console.log('SUCCESS: Project package is available at ' + result[PROJECT_DIR] + '\n');
    });

}

function setDefaultConfigValues(){

    DIR_STRUCTURE.config['']

}

function addConfigs(schema){

    DIR_STRUCTURE.config.push({

        "name" : schema,
        "type" : "json",
        "content" : require(__dirname + "/../../schema-system-config-stubs/" + schema)
    
    });
}

function printHelp(){

    console.log('help is on the way!');
}

//TODO: look in schema directory for a matching schema
function schemaNameExists(){
    
    return true;
}

//TODO: Make this less noisey/nested, break it out into functions
function makeContents(result, dirs){

    var currRoot = dirname + '/' +  result[PROJECT_DIR];

    mkdirp.sync(currRoot);

    SCHEMA_STUB['id'] = 'http://sdfg/' + result[SCHEMA_NAME] + ".1";
    SCHEMA_STUB['description'] = result[SCHEMA_DESC];

    fs.writeFileSync(currRoot + '/schema.json', stringify(SCHEMA_STUB), 'utf8');

    _.each(Object.keys(dirs), function(dir){
        var currDir = currRoot + '/' + dir;

        mkdirp.sync(currDir);

        _.each(dirs[dir], function(file){

            if(dir === 'lang'){

                file.type = 'en.' + file.type;

                fs.writeFileSync(currDir + '/' + file.name + '.' + file.type, stringify({}), 'utf8');
            }

            fs.writeFileSync(currDir + '/' + file.name + '.' + file.type, stringify(file.content), 'utf8');
        });
    });
}

function stringify(obj){

    return JSON.stringify(obj, null, '\t'); // Indented 4 spaces
}

main();
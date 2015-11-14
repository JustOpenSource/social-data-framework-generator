#! /usr/bin/env node

/**
 * @module generator/new
 * @description command line tool to generate new instance
 * @param {string} -s - The name of the new schema and project (e.g. "my-data")
 */

var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var schemas = require('social-data-framework-schemas');

var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();

var USER_NAME = 'Your OpenID Username (leave blank or you can change later)';
var PROJECT_DIR = 'Project Directory Name (required)';
var SCHEMA_NAME = 'Schema Name (required)';
var SCHEMA_DESC = 'Schema Description (leave blank or you can change later)';

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

    if(!argv.s){
        console.log('-s (name of project directory) is required.  Must consist of lowercase letters and underscores (my_project_name)');
        return;
    }

    var newSchema = argv.s;

    /*********************
    TITLE
    */

    console.log('');
    console.log('Social Data Framework Generator - Create New Project');
    console.log('--------------------------------------\n');


    /*********************
    GET INPUT
    */

    makeContents(newSchema);

    console.log('SUCCESS: Project package is available at ' + newSchema + '\n');

}

function printHelp(){

    console.log('help is on the way!');
}

//TODO: look in schema directory for a matching schema
function schemaNameExists(){
    
    return true;
}

function processPackage(stub, newSchema){

    stub.name = stub.name + newSchema;
    stub.description = stub.description + newSchema;

    return stringify(stub);
}

/**
 * @function makeContents
 * @description Creates the new package and writes the files into it.
 * @param {string} newSchema - The name of the new schema and project (e.g. "my-data")
 */
function makeContents(newSchema){

    var dirs = {
        "config" : [],
        "lang" : [],
        "data" : null
    };

    function addConfigs(schema){

        dirs.config.push({

            "name" : schema,
            "type" : "json",
            "content" : schemas['config-stubs'][schema]

        });
    }

    //set the config stubs to generate the new package
    addConfigs('details_edit.1');
    addConfigs('details.1');
    addConfigs('infographics.1');
    addConfigs('list_filters.1');
    addConfigs('list.1');
    addConfigs('api_public.1');
    addConfigs('system.1');

    var currRoot = dirname + '/' +  newSchema;

    mkdirp.sync(currRoot);

    SCHEMA_STUB['id'] = 'http://sdfg/' + newSchema + ".1";

    fs.writeFileSync(currRoot + '/schema.json', stringify(SCHEMA_STUB), 'utf8');

    fs.writeFileSync(currRoot + '/main.js', schemas['config-stubs']['main'], 'utf8');

    fs.writeFileSync(currRoot + '/package.json', processPackage(schemas['config-stubs']['package'], newSchema));

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
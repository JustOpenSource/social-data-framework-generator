#! /usr/bin/env node

var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();

var USER_NAME = 'Your OpenID Username';
var PROJECT_DIR = 'Project Directory';
var SCHEMA_NAME = 'Schema Name';
var SCHEMA_DESC = 'Schema Description';
var OPEN_ID = 'Your Open ID';
var SCHEMA_PARENT = 'Existing Schema (schema name or )';

//TODO: After I sketch these out here, write schemas and then generate this directory structure from them
var DIR_STRUCTURE = {

    "config" : [

        //TODO: on validator, check to make sure a field only appears once
        {
            "name" : "users",
            "type" : "json",
            "content" : {
                "users" : [{
                    "username" : "", //uniqu
                    "id-system" : "openid", //system that id belongs to
                    "role" : "admin" // roles have access to different parts of the workflows (admin, editor, researcher)
                }]
            }
        },

        {
            "name" : "details",
            "type" : "json",
            "content" : {
                "sections" : [
                    {
                        "name" : "", //identifier for lang files, logging, etc
                        "fields" : [""] //schema path to value
                    }
                ]
            }
        },

        //find a way to add dynamic overrides to default values (or layout values in general?)
        {
            "name" : "details-edit",
            "type" : "json",
            "content" : {
                
                "required" : [{
                    "document-state" : "new", //state change (new, pending, publish),
                    "required" : [""] //schema path to value
                }],
                
                "defaults" : [{
                    'field' : "", //schema path to value,
                    'value' : "" //default value for schema, must be valid for field type
                }],

                "accept-public-suggestions" : "true", //public can suggest edits on existin records
                "accept-public-new-records" : "true" //public can add new records into the system
            }
        },

        {
            "name" : "list",
            "type" : "json",
            
            "content" : {
                "per-page" : 10, //default number of entries to show per page by default (1, 5, 10, 20, 50, 100, 500, all)
                "fields" : [{
                    "field" : "", //schema path to value
                    "size" : "", //size of cell (extra-small, small, medium, large, extra-large),
                    "link" : true //is link to details
                }]
            }
        },

        {
            "name" : "list-filters",
            "type" : "json",
            "content" : {
                "sort-by" : [""], //fields to allow sorting by
                "default-sort-by" : "",
                "filters" : [{
                    "field" : "", //schema path to value,
                    "default-value" : ""
                }]
            }
        },

        //TODO: Deal with these two later
        {
            "name" : "public-api",
            "type" : "json",
            "content" : {} 
        },

        {
            "name" : "infograpics",
            "type" : "json",
            "content" : {}
        },
    ],

    "lang" : [

        //this will need to map to the schema and provide localized values for the keys
        {
            "name" : "schema",
            "type" : "json",
            "content" : {}
        },

        {
            "name" : "details",
            "type" : "json",
            "content" : {
                
                "page-title" : "Details",
                
                "sections" : [{
                    "name" : "", //name of the section created in the config
                    "title" : "" //translated title of that section
                }]
            
            }
        },

        {
            "name" : "details-edit",
            "type" : "json",
            "content" : {
                "page-title" : "Edit Details",
                "submit" : "Suggest Edits",
                "help-text" : [{
                    "field" : "", //schema path to value,
                    "text" : "" //help text
                }]
            }
        },

        {
            "name" : "list",
            "type" : "json",
            "content" : {
                "page-title" : "List of Records",
                "total-entries" : "Total Entries",
                "filter-button" : "Filter",
            }   
        }, 

        {
            "name" : "list-filters",
            "type" : "json",
            "content" : {
                
            }   
        }, 

        //TODO: Deal with these two later
        {
            "name" : "public-api",
            "type" : "json",
            "content" : {
                "page-title" : "",
            }   
        },
        {
            "name" : "infograpics",
            "type" : "json",
            "content" : {
                "page-title" : "Inforgraphics",
            }   
        }, 
    ]
};

var SCHEMA_STUB = {
    "id" : null,
    "type" : "object",
    "description" : "",
    "type" : "object",
    "properties" : {}
};

if(argv.h){
    printHelp();
    return;
}

function printHelp(){
    console.log('help is on the way!');
}

console.log('');
console.log('Social Data Framework Generator');
console.log('--------------------------------------');

prompt.start();

prompt.get([USER_NAME, PROJECT_DIR, SCHEMA_NAME, SCHEMA_DESC], function (err, result) {

    makeContents(result, DIR_STRUCTURE);

    console.log('');

    if(!schemaNameExists()){

        console.log('Schema "' + result[SCHEMA_NAME] + '"" does not exist');
        console.log('');
        console.log('Creating a unique schema.');
        console.log('');
        console.log('Using an existing schema is sometimes the best choice.');
        console.log('For more information about creating a schema, type:');
        console.log('$ sdfg-help schemas');

    } else {
        
        console.log('Schema "' + result[SCHEMA_NAME] + '"" exists');
        console.log('To see the schema, type:');
        console.log('$ sdfg-schemas THE_SCHEMA_NAME');
    
    }

    console.log('');
});

//TODO: look in schema directory for a matching schema
function schemaNameExists(){
    return true;
}

//TODO: Make this less noisey/nested, break it out into functions
function makeContents(result, dirs){

    var currRoot = dirname + '/' +  result[PROJECT_DIR];

    mkdirp.sync(currRoot);

    SCHEMA_STUB['id'] = result[SCHEMA_NAME] + ".1";
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
    return JSON.stringify(obj, null, 4); // Indented 4 spaces
}
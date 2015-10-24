#! /usr/bin/env node
var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();

var PROJECT_DIR = 'Project Directory';
var SCHEMA_NAME = 'Schema Name';
var SCHEMA_DESC = 'Schema Description';
var DIR_STRUCTURE =  {
    
    "config" : [
        {
            "name" : "details",
            "type" : "json",
            "content" : {
                "sections" : []
            }
        }, 

        {
            "name" : "details-edit",
            "type" : "json",
            "content" : {}      
        }, 

        {
            "name" : "infograpics",
            "type" : "json",
            "content" : {}      
        }, 

        {
            "name" : "list",
            "type" : "json",
            "content" : {
                "fields" : [],
            }      
        }, 

        {
            "name" : "list-filters",
            "type" : "json",
            "content" :{
                "filters" : [],
            }
        }, 

        {
            "name" : "public-api",
            "type" : "json",
            "content" : {} 
        }
    ],
    
    "lang" : [

        {
            "name" : "details",
            "type" : "json",
            "content" : {
                "page-title" : "Details",
            }   
        }, 

        {
            "name" : "details-edit",
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

        {
            "name" : "list",
            "type" : "json",
            "content" : {
                "page-title" : "",
            }   
        }, 

        {
            "name" : "list-filters",
            "type" : "json",
            "content" : {
                
            }   
        }, 

        {
            "name" : "public-api",
            "type" : "json",
            "content" : {
                "page-title" : "",
            }   
        }
    ]
};

var SCHEMA_STUB = {
    "id" : null,
    "type" : "object",
    "description" : ""
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

prompt.get([PROJECT_DIR, SCHEMA_NAME, SCHEMA_DESC], function (err, result) {

    makeContents(result, DIR_STRUCTURE);
});

function instructions(){

}

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

                fs.writeFileSync(currDir + '/schema' + '.' + file.type, stringify({}), 'utf8');
            }

            fs.writeFileSync(currDir + '/' + file.name + '.' + file.type, stringify(file.content), 'utf8');
        });
    });
}

function stringify(obj){
    return JSON.stringify(obj, null, 4); // Indented 4 spaces
}


/*
console.log('Social Data Framework Generator (sdfg) : sdfg-new');

console.dir(argv);

if(argv.p){

    var newDir = dirname + '/' + argv.p;

    console.log(newDir);

    mkdirp(newDir, function(err){
        console.log(err);
    });
}
*/
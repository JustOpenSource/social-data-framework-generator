#! /usr/bin/env node

var jsen = require('jsen');
var _ = require('underscore');
var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();
var Validator = require('jsonschema').Validator;
var v = new Validator();

var schemaJSON;

function setSchema(name){
    v.addSchema(require(__dirname + '/../../schema-system' + name), name);
}

setSchema('/core/document-state.1');
setSchema('/core/feature-document-state.1');
setSchema('/core/feature-generic.1');
setSchema('/core/schema-field.1');
setSchema('/core/user-role-feature-set.1');
setSchema('/core/user-role.1');
setSchema('/core/user.1');

setSchema('/config/details-edit.1');
setSchema('/config/details.1');
setSchema('/config/infographics.1');
setSchema('/config/list-filters.1');
setSchema('/config/list.1');
setSchema('/config/public-api.1');
setSchema('/config/system.1');

/*********************
TEST FOR HELP
*/

if(argv.h){
    printHelp();
    return;
}

//TODO: Make this a shared function in utils
function printHelp(){
    console.log('\nhelp is on the way, exiting.\n');

    process.exit();
}

/*********************
TITLE
*/

console.log('\n\n');
console.log('Social Data Framework Generator - Validate Schema');
console.log('--------------------------------------\n');

/*********************
MAKE SURE THAT THE PACKAGE NAME IS SET
*/

if(!argv.d){
    console.log('\n-d is required (directory of sdfg config package.\n');
    return;
}

var schema = dirname + '/' + argv.d + '/schema.json';

/*********************
VALIDATE JSON
*/
console.log('validating schema as JSON: ' + schema + '\n');

try {
    
    schemaJSON = require(schema);
    console.log(' - SUCCESS: Schema is valid json\n');

} catch(err){
    
    console.log(err + '\n');
    console.log(' - FAIL: Fix json errors in schema.json and try again.\n');

    process.exit();

}


/*********************
VALIDATE SCHEMA
*/


console.log('validating schema as schema: ' + schema + '\n');

var validateSchema = jsen(require(__dirname + "/../../utils/schema.4.json"));

var isSchemaValid = validateSchema(schemaJSON);

if(!isSchemaValid){

    console.log(' - FAIL: Schema does not match JSON-schema version 4 spec, try using http://jsonschemalint.com/draft4/ to create a valid schema\n');

    console.log(' - Note: This schema was validated against http://json-schema.org/draft-04/schema with "additionalProperties" set to false.\n');

    process.exit();

} else {

    console.log(' - SUCCESS: Schema is a valid schema\n');

}

/*********************
VALIDATE CONFIGS
*/

var schemaConfigErrors = [];

function validateConfig(schema){

    schemaDir = dirname + '/' + argv.d + '/' + schema;

    console.log('validating config: ' + schema + '\n');

    try {
    
        schemaJSON = require(schemaDir);

        console.log(' - SUCCESS: ' + schemaDir + ' is valid json\n');

    } catch(err){
        
        console.log(err);
        console.log('');
        console.log(' - FAIL: Fix json errors in ' + schemaDir + '\n');
        console.log(' - Try http://jsonlint.com/ to validate json\n');

        process.exit();

    }

    var validation_results = v.validate(schemaJSON, v.schemas['/' + schema + '.1']);

    if(validation_results.errors.length === 0){

        console.log(' - SUCCESS: ' + schemaDir + ' is a valid config.\n');

    } else {

        schemaConfigErrors.push({
            "schema" : schemaDir,
            "errors" : validation_results.errors
        });

        console.log(' - FAIL: Fix schema errors in ' + schemaDir + ' and try again.\n');

        console.log(JSON.stringify( validation_results.errors, null, 4) + '\n');

        console.log(' - Try http://jsonschemalint.com/draft4/ to validate schema');

        process.exit();

    }
}

validateConfig('config/details-edit');
validateConfig('config/details');
validateConfig('config/infographics');
validateConfig('config/list-filters');
validateConfig('config/list');
validateConfig('config/public-api');
validateConfig('config/system');

console.log('\n...\n\nSUCCESS: All configs are valid\n');

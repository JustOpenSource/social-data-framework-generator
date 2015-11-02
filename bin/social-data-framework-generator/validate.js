#! /usr/bin/env node

var jsen = require('jsen');
var _ = require('underscore');
var argv = require('minimist')(process.argv.slice(2));
var dirname = process.cwd();
var Validator = require('jsonschema').Validator;
var v = new Validator();


/*********************
MAKE SURE THAT THE PACKAGE NAME IS SET
*/

if(!argv.d){
    console.log('\n-d is required (directory of sdfg config package.\n');
    return;
}

/*********************
RUN SYSTEM SCHEMA TESTS
*/

require(__dirname + '/../../utils/test_system_schemas')();

var schemaJSON;

function setSchema(name){

    //TODO: adjust this to bring in schemas as a package.  Will have to turn schemas dir into proper module. 
    v.addSchema(require(__dirname + '/../../../social-data-framework-schemas' + name), name);
}

setSchema('/core/document_state.1');
setSchema('/core/feature_change_document_state.1');
setSchema('/core/feature_generic.1');
setSchema('/core/schema_field.1');
setSchema('/core/user_role_feature_set.1');
setSchema('/core/user_role.1');
setSchema('/core/user.1');

setSchema('/config/details_edit.1');
setSchema('/config/details.1');
setSchema('/config/infographics.1');
setSchema('/config/list_filters.1');
setSchema('/config/list.1');
setSchema('/config/public_api.1');
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
    console.log('help is on the way, exiting.');

    process.exit();
}

/*********************
TITLE
*/

console.log('\n\n');
console.log('Social Data Framework Generator - Validate Schema');
console.log('--------------------------------------\n');

var schema = dirname + '/' + argv.d + '/schema.json';

/*********************
VALIDATE JSON
*/
console.log('validating schema as JSON: ' + schema + '\n');

try {
    
    schemaJSON = require(schema);
    console.log(' - SUCCESS: Schema is valid json\n');

} catch(err){
    
    
    console.log(' - FAIL: Fix json errors in schema.json and try again.\n');
    console.log(' - ' + err + '\n');
    console.log(' - Try http://jsonlint.com/ to validate json\n');

    process.exit();

}


/*********************
VALIDATE SCHEMA
*/

console.log('validating schema as schema: ' + schema + '\n');

var validateSchema = jsen(require(__dirname + "/../../../social-data-framework-schemas/core/schema.4.json"));

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

    console.log('validating config ' + schemaDir + '\n');

    try {
    
        schemaJSON = require(schemaDir);

        console.log(' - SUCCESS: ' + schema + ' is valid json\n');

    } catch(err){
        
        console.log(' - FAIL: Fix json errors in ' + schema + '\n');
        console.log(' - ' + err + '\n');
        console.log(' - Try http://jsonlint.com/ to validate json\n');

        process.exit();

    }

    var validation_results = v.validate(schemaJSON, v.schemas['/' + schema + '.1']);

    if(validation_results.errors.length === 0){

        console.log(' - SUCCESS: ' + schema + ' is a valid config schema\n');

    } else {

        schemaConfigErrors.push({
            "schema" : schemaDir,
            "errors" : validation_results.errors
        });

        console.log(' - FAIL: Fix schema errors in ' + schema + ' and try again.\n');

        console.log(JSON.stringify( validation_results.errors, null, 4) + '\n');

        console.log(' - Try http://jsonschemalint.com/draft4/ to validate schema');

        process.exit();

    }
}

validateConfig('config/details_edit');
validateConfig('config/details');
validateConfig('config/infographics');
validateConfig('config/list_filters');
validateConfig('config/list');
validateConfig('config/public_api');
validateConfig('config/system');

console.log('\n...\n\nSUCCESS: All configs are valid\n');

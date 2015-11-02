var Validator = require('jsonschema').Validator;
var v = new Validator();
var _ = require('underscore');
var schemas = require('social-data-framework-schemas');

console.log(schemas);

console.log('\n\n');
console.log('Social Data Framework Generator - Validate System Schemas 1');
console.log('--------------------------------------\n');

/*
var SCHEMAS = [
    '/core/document_state.1',
    '/core/feature_document-state.1'
];
*/

function setSchema(dir, schema){
    v.addSchema(schemas[dir][schema], dir + '/' + schema);
}

setSchema('core', 'document_state.1');
setSchema('core', 'feature_change_document_state.1');
setSchema('core', 'feature_generic.1');
setSchema('core', 'schema_field.1');
setSchema('core', 'user_role_feature_set.1');
setSchema('core', 'user_role.1');
setSchema('core', 'user.1');

setSchema('config', 'details_edit.1');
setSchema('config', 'details.1');
setSchema('config', 'infographics.1');
setSchema('config', 'list_filters.1');
setSchema('config', 'list.1');
setSchema('config', 'public_api.1');
setSchema('config', 'system.1');

function testSchema(dir, schema){

    console.log(schema);

    var validation_results = v.validate(schemas['test'][dir][schema + '.test'], v.schemas[dir + '/' + schema]);

    var errors = (validation_results.errors.length !== 0);

    console.log('results for ' + schema + ' test : ' + ((errors) ? 'ERRORS' : 'OK'));

    if(errors){

        _.each(validation_results.errors, function(error){

            console.log('- ERROR');
            console.log(error);

        });

        process.exit();
    }

    console.log('');
}

function main(){

    testSchema('config', 'system.1');
    testSchema('config', 'details_edit.1');
    testSchema('config', 'details.1');
    testSchema('config', 'list_filters.1');
    testSchema('config', 'list.1');
    testSchema('config', 'public_api.1');
    testSchema('config', 'infographics.1');

    testSchema('core', 'document_state.1');
    testSchema('core', 'feature_change_document_state.1');
    testSchema('core', 'feature_generic.1');
    testSchema('core', 'schema_field.1');
    testSchema('core', 'user_role_feature_set.1');
    testSchema('core', 'user_role.1');
    testSchema('core', 'user.1');

    console.log('');

}

module.exports = main;
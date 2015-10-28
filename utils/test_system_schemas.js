var Validator = require('jsonschema').Validator;
var v = new Validator();
var _ = require('underscore');

console.log('\n\n');
console.log('Social Data Framework Generator - Validate System Schemas');
console.log('--------------------------------------\n');

/*
var SCHEMAS = [
    '/core/document_state.1',
    '/core/feature_document-state.1'
];
*/

function setSchema(name){
    v.addSchema(require(__dirname + '/../schema-system' + name), name);
}

setSchema('/core/document_state.1');
setSchema('/core/feature_document_state.1');
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

function testSchema(schema){

    var validation_results = v.validate(require(__dirname + '/../schema-system-tests' + schema + '.test'), v.schemas[schema]);

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

    console.log('');

    testSchema('/config/system.1');
    testSchema('/config/details_edit.1');
    testSchema('/config/details.1');
    testSchema('/config/list_filters.1');
    testSchema('/config/list.1');
    testSchema('/config/public_api.1');
    testSchema('/config/infographics.1');

    testSchema('/core/document_state.1');
    testSchema('/core/feature_document_state.1');
    testSchema('/core/feature_generic.1');
    testSchema('/core/schema_field.1');
    testSchema('/core/user_role_feature_set.1');
    testSchema('/core/user_role.1');
    testSchema('/core/user.1');

    console.log('');

}

module.exports = main;
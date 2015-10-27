var Validator = require('jsonschema').Validator;
var v = new Validator();
var _ = require('underscore');

function setSchema(name){
    v.addSchema(require(__dirname + '/../schema-system' + name), name);
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

function testSchema(schema){

    var validation_results = v.validate(require(__dirname + '/../schema-system-tests' + schema + '.test'), v.schemas[schema]);

    var errors = (validation_results.errors.length !== 0);

    console.log('results for ' + schema + ' test : ' + ((errors) ? 'ERRORS' : 'OK'));

    if(errors){

        _.each(validation_results.errors, function(error){

            console.log('- ERROR');
            console.log(error);

        });
    }

    console.log('');
}

function main(){

    console.log('');

    testSchema('/config/system.1');
    testSchema('/config/details-edit.1');
    testSchema('/config/details.1');
    testSchema('/config/list-filters.1');
    testSchema('/config/list.1');
    testSchema('/config/public-api.1');
    testSchema('/config/infographics.1');

    testSchema('/core/document-state.1');
    testSchema('/core/feature-document-state.1');
    testSchema('/core/feature-generic.1');
    testSchema('/core/schema-field.1');
    testSchema('/core/user-role-feature-set.1');
    testSchema('/core/user-role.1');
    testSchema('/core/user.1');

    console.log('');

}

module.export = main();
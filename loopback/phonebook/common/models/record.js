'use strict';

module.exports = function(Record) {
    Record.validatesLengthOf('name', {min: 3, message: {min: 'name must be at least 3 characters'}});
    Record.validatesUniquenessOf('phonenumber');
};

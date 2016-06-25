var exercises = require('../../exercises/exercises.js');
describe('exercise', function() {
    describe('list', function() {
        it('resolves with all exercises', function(done) {
            exercises.list()
                .then(done);

        });
    });
});
var nock = require('nock');
describe("persistence/db",function() {
    var DbClient = require("../../persistence/db.js").Client;
    var spoofCloudantUrl = "https://spoofcloundant.com:443";
    var testCdbUser = "testUser";
    var testCdbPass = "testPass";
    var db;

    beforeEach(function() {
        db = new DbClient(
            {
                name:    "testdatabase",
                cdbUrl:  spoofCloudantUrl,
                cdbUser: testCdbUser,
                cdbPass: testCdbPass
            }
        );
    });

    describe("splat",function() {
        it("drops and recreates the database",function(done) {

            var cloudantDeleteDatabase =
                nock(spoofCloudantUrl)
                    .delete("/testdatabase")
                    .basicAuth({
                        user: testCdbUser,
                        pass: testCdbPass
                    })
                    .reply(200);

            var cloudantCreateDatabase =
                nock(spoofCloudantUrl)
                    .put("/testdatabase")
                    .basicAuth({
                        user: testCdbUser,
                        pass: testCdbPass
                    })
                    .reply(201);

            db.splat()
                .then(function() {
                    cloudantDeleteDatabase.done();
                    cloudantCreateDatabase.done();
                    done();
                })
                .catch(function(error) {
                    console.error('pending mocks: %j', cloudantDeleteDatabase.pendingMocks());
                    console.error('pending mocks: %j', cloudantCreateDatabase.pendingMocks());
                    done(error);
                });
        });

        it.skip("handles case where database does not exist");
        it.skip("if drop fails, does not attempt to create");
        it.skip("does the drop and create in correct order");


    });

    describe("insert",function() {
        it("does not barf",function(done) {
            var cloudantInsert =
                nock(
                    spoofCloudantUrl,
                    {
                        reqheaders: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .post("/testdatabase",
                    {
                        name: "test doc"
                    }
                )
                .basicAuth({
                    user: testCdbUser,
                    pass: testCdbPass
                })

                .reply(200);

            db.insert({name: "test doc"})
                .then(function() {
                    cloudantInsert.done();
                    done();
                })
                .catch(done);
        });
    });


});

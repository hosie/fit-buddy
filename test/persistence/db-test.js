var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var conf = require('nconf');
var sinon = require('sinon');

describe("persistence/db",function() {
    var DbClient = require("../../persistence/db.js").Client;
    var spoofCloudantUrl = "https://spoofcloundant.com:443";
    var testCdbUser = "testUser";
    var testCdbPass = "testPass";
    var db;
    var confGet_stub;

    beforeEach(function() {
        confGet_stub = sinon.stub(conf,'get');
        confGet_stub.withArgs('CDB_URL').returns(spoofCloudantUrl);
        confGet_stub.withArgs('CDB_USER').returns(testCdbUser);
        confGet_stub.withArgs('CDB_PASS').returns(testCdbPass);

        db = new DbClient("testdatabase");
    });

    afterEach(function() {
        confGet_stub.restore();
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

    describe("upsert",function() {
        it("Calls post on cloudant API",function(done) {
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

            db.upsert({name: "test doc"})
                .then(function() {
                    cloudantInsert.done();
                    done();
                })
                .catch(done);
        });
    });

    describe('list', function() {
        it('reads all', function(done) {
            var cloudantList =
                nock(
                    spoofCloudantUrl
                )
                .get("/testdatabase/_all_docs?include_docs=true")
                .basicAuth({
                    user: testCdbUser,
                    pass: testCdbPass
                })
                .reply(200,{
                    total_rows: 1,
                    offset: 0,
                    rows:
                        [
                            {
                                id: 'testrow1_id',
                                key: 'testrow1_key',
                                value: 'testdoc1_value',
                                doc: {
                                    _id: 'testdoc1_id',
                                    _rev: 'testdoc1_value',
                                    field1: 'testdoc1_field1',
                                    field2: 'testdoc1_field2'
                                }
                            },
                            {
                                id: 'testrow2_id',
                                key: 'testrow2_key',
                                value: 'testdoc2_value',
                                doc: {
                                    _id: 'testdoc2_id',
                                    _rev: 'testdoc2_value',
                                    field1: 'testdoc2_field1',
                                    field2: 'testdoc2_field2'
                                }
                            }
                        ]
                });
            db.list()
            .then(function(docs) {
                cloudantList.done();
                expect(docs).to.be.an('array');
                expect(docs.length).to.equal(2);
                expect(docs).to.deep.equal(
                    [
                        {
                            _id: 'testdoc1_id',
                            _rev: 'testdoc1_value',
                            field1: 'testdoc1_field1',
                            field2: 'testdoc1_field2'
                        },
                        {
                            _id: 'testdoc2_id',
                            _rev: 'testdoc2_value',
                            field1: 'testdoc2_field1',
                            field2: 'testdoc2_field2'
                        }
                    ]
                );
                done();
            })
            .catch(done);
        });
    });
});

var nock = require('nock');
describe("persistence/db",function(){
    var db = require("../../persistence/db.js");
    var spoofCloudantUrl = "https://spoofcloundant.com:443";
    var testCdbUser = "testUser";
    var testCdbPass = "testPass";

    before(function(){
        db.init(
            {
                cdbUrl: spoofCloudantUrl,
                cdbUser:   testCdbUser,
                cdbPass:   testCdbPass
            }
        );
    });

    describe("addExercise",function(){
        it("does not barf",function(done){
            var cloudantInsert =
                nock(
                    spoofCloudantUrl,
                    {
                        reqheaders:{
                            'Content-Type': 'application/json'
                        }

                    }
                )
                .post("/exercises",
                    {
                        name: "test exercise"
                    }
                )
                .basicAuth({
                    user: testCdbUser,
                    pass: testCdbPass
                })

                .reply(200);

            db.addExercise("test exercise")
                .then(function(){
                    cloudantInsert.done();
                    done();
                })
                .catch(done);
        });
    });
});

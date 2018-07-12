import Timeout from "../../src/javascript/classes/Timeout";


describe("Timeout Class ", function() {
    Timeout.addAnimeFrame();
    var currentTimeInMS = +new Date();//Current Time in miliseconds
    var afterTimeOutInMS;
    var delayTime = 2000; //in ms
    var offset = 100; //set 50ms offset for jasmine functions to execute

    beforeEach(function(done) {
        Timeout.request(function () {
            afterTimeOutInMS = +new Date();
            done();
        },delayTime)
    });

    it("request method should do something after a period",function(){
        expect(afterTimeOutInMS-currentTimeInMS).toBeLessThanOrEqual(delayTime+offset);
        expect(afterTimeOutInMS-currentTimeInMS).toBeGreaterThanOrEqual(delayTime);
    })
});

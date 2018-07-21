import Timeout from "../../src/javascript/classes/Timeout";

describe("Timeout Class ", () => {
	beforeAll(() => {
		expect(Timeout.addAnimeFrame).toBeDefined();
		expect(Timeout.request).toBeDefined();
		expect(Timeout.clear).toBeDefined();
	});
	Timeout.addAnimeFrame();
	var currentTimeInMS; //Current Time in miliseconds
	var afterTimeOutInMS;
	var delayTime = 2000; //in ms
	var offset = 100; //set 50ms offset for jasmine s to execute

	beforeEach(done => {
		currentTimeInMS = +new Date(); //Current Time in miliseconds
		Timeout.request(() => {
			afterTimeOutInMS = +new Date();
			done();
		}, delayTime);
	});

	it("request method should do something after a period", () => {
		console.log(afterTimeOutInMS - currentTimeInMS);
		expect(afterTimeOutInMS - currentTimeInMS).toBeLessThanOrEqual(
			delayTime + offset
		);
		expect(afterTimeOutInMS - currentTimeInMS).toBeGreaterThanOrEqual(
			delayTime
		);
	});
});

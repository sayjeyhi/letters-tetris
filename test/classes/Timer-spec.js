import Timer from "../../src/javascript/classes/Timer";

describe("Timer Class ", () => {
	beforeAll(() => {
		let timer = new Timer();
		expect(timer.start).toBeDefined();
		expect(timer.pause).toBeDefined();
		expect(timer.resume).toBeDefined();
	});
});

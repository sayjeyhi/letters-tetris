import Sound from "../../src/javascript/classes/Sound";

describe("Sound Class ", () => {
	beforeAll(() => {
		expect(Sound.play).toBeDefined();
		expect(Sound._makeInstanceName).toBeDefined();
		expect(Sound._getInstance).toBeDefined();
		expect(Sound._setInstance).toBeDefined();
		expect(Sound.playByKey).toBeDefined();
		expect(Sound.pauseByKey).toBeDefined();
	});
});

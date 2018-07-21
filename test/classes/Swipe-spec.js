import Swipe from "../../src/javascript/classes/Swipe";

describe("Swipe Class ", () => {
	beforeAll(() => {
		let swipe = new Swipe();
		expect(swipe.buildListeners).toBeDefined();
		expect(Swipe._onTouchStart).toBeDefined();
		expect(Swipe._whileTouch).toBeDefined();
		expect(Swipe._onTouchEnd).toBeDefined();
		expect(swipe.destroy).toBeDefined();
	});
});

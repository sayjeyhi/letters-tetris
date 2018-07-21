import Animate from "../../src/javascript/classes/Tetris/Animate";

describe("Animate Class ", () => {
	beforeAll(() => {
		expect(Animate.fallNodeAnimate).toBeDefined();
		expect(Animate.animateFoundedCharacters).toBeDefined();
		expect(Animate.animateFallCharacters).toBeDefined();
		expect(Animate.shake).toBeDefined();
		expect(Animate.showFoundWordAnimated).toBeDefined();
		expect(Animate.shake).toBeDefined();
	});
});

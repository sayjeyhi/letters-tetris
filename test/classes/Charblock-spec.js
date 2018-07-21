import Charblock from "../../src/javascript/classes/Tetris/Charblock";

describe("Charblock Class ", () => {
	beforeAll(() => {
		expect(Charblock.create).toBeDefined();
		expect(Charblock.factory).toBeDefined();
		expect(Charblock.move).toBeDefined();
		expect(Charblock.getInterval).toBeDefined();
		expect(Charblock.getBlockPosition).toBeDefined();
		expect(Charblock._getEl).toBeDefined();
		expect(Charblock._generateMove).toBeDefined();
		expect(Charblock._showUpComingChar).toBeDefined();
		expect(Charblock._destroy).toBeDefined();
		expect(Charblock._registerSkullClick).toBeDefined();
		expect(Charblock._skullClick).toBeDefined();
		expect(Charblock.create).toBeDefined();
	});
});

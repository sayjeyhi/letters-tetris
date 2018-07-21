import Gameplay from "../../src/javascript/classes/Tetris/Gameplay";

describe("Gameplay Class ", () => {
	beforeAll(() => {
		expect(Gameplay.start).toBeDefined();
		expect(Gameplay.pause).toBeDefined();
		expect(Gameplay.resume).toBeDefined();
		expect(Gameplay.restart).toBeDefined();
		expect(Gameplay.restartWholeGame).toBeDefined();
		expect(Gameplay.finish).toBeDefined();
		expect(Gameplay._makeGameBoard).toBeDefined();
		expect(Gameplay._makeMovingEvents).toBeDefined();
		expect(Gameplay._buttonManager).toBeDefined();
	});
});

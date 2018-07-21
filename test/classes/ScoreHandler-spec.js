import ScoreHandler from "../../src/javascript/classes/Tetris/ScoreHandler";

describe("ScoreHandler Class ", () => {
	beforeAll(() => {
		expect(ScoreHandler.submit).toBeDefined();
		expect(ScoreHandler.showScores).toBeDefined();
		expect(ScoreHandler._saveScore).toBeDefined();
		expect(ScoreHandler._getSubmitted).toBeDefined();
		expect(ScoreHandler._getScore).toBeDefined();
		expect(ScoreHandler._updateStats).toBeDefined();
		expect(ScoreHandler._updateScore).toBeDefined();
		expect(ScoreHandler._updateScoreAndStats).toBeDefined();
	});
});

import TetrisGame from "../../src/javascript/classes/Tetris/TetrisGame";

describe("TetrisGame Class ", () => {
	beforeAll(() => {
		expect(TetrisGame.init).toBeDefined();
		expect(TetrisGame.build).toBeDefined();
		expect(TetrisGame.setDefaultValues).toBeDefined();
		expect(TetrisGame.validateColumnsNumber).toBeDefined();
		expect(TetrisGame.checkWordSuccess).toBeDefined();
		expect(TetrisGame.checkWordsResult).toBeDefined();
		expect(TetrisGame.checkSuccessWordStack).toBeDefined();
		expect(TetrisGame.showShuffledWords).toBeDefined();
		expect(TetrisGame._animateExplode).toBeDefined();
		expect(TetrisGame._removeWordAndCharacters).toBeDefined();
	});
});

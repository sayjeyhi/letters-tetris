import WordsHelper from "../../src/javascript/classes/Tetris/WordsHelper";

describe("WordsHelper Class ", () => {
	beforeAll(() => {
		expect(WordsHelper.getSpecial).toBeDefined();
		expect(WordsHelper.chooseWord).toBeDefined();
		expect(WordsHelper.chooseChar).toBeDefined();
		expect(WordsHelper._giveMeABomb).toBeDefined();
		expect(WordsHelper._giveMeAnSkull).toBeDefined();
		expect(WordsHelper._giveMeAnStar).toBeDefined();
	});
});

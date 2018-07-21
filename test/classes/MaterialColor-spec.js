import MaterialColor from "../../src/javascript/classes/MaterialColor";

describe("MaterialColor class", () => {
	beforeAll(() => {
		expect(MaterialColor.getRandomColor).toBeDefined();
		expect(MaterialColor.pickRandomProperty).toBeDefined();
	});
	it("getRandomColor method should randomly return a valid color", () => {
		expect(
			/^#[0-9A-F]{6}$/i.test(MaterialColor.getRandomColor())
		).toBeTruthy();
	});
});

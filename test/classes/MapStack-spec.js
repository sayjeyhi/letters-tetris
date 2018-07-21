import MapStack from "../../src/javascript/classes/MapStack";

describe("MapStack Class ", () => {
	var mapStack = new MapStack();
	beforeAll(() => {
		expect(mapStack.append).toBeDefined();
		expect(mapStack.entries).toBeDefined();
		expect(mapStack.merge).toBeDefined();
		expect(mapStack.popItem).toBeDefined();
		expect(mapStack.popItems).toBeDefined();
		expect(mapStack.reduce).toBeDefined();
	});
});

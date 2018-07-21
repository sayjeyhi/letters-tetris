import Storage from "../../src/javascript/classes/Storage";

describe("Storage Class", () => {
	beforeAll(() => {
		expect(Storage.set).toBeDefined();
		expect(Storage.get).toBeDefined();
		expect(Storage.getInt).toBeDefined();
		expect(Storage.getObject).toBeDefined();
		expect(Storage.setObject).toBeDefined();
		expect(Storage.setEncrypted).toBeDefined();
		expect(Storage.getEncrypted).toBeDefined();
	});

	Storage.set("my_key", "my_value");

	it("method set: with default value saves an item in localStorage", () => {
		expect(Storage.get("my_key")).toBe("my_value");
	});

	it("method get: with wrong key, it shold return value of second argument", () => {
		expect(Storage.get("notFoo", "defaultFoo")).toBe("defaultFoo");
	});
});

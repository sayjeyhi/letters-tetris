import Storage from "../../src/public/javascript/classes/Storage";

describe("Storage Class ", function() {
    it("method set: Saves an item in localStorage", function() {
        expect(Storage.get("notFoo","defaultFoo")).toBe("defaultFoo");
    });
});

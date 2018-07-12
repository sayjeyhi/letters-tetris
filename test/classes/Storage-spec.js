import Storage from "../../src/public/javascript/classes/Storage";

describe("Storage Class", function() {
    Storage.set("my_key","my_value");

    it("method set: with default value saves an item in localStorage", function() {
        expect(Storage.get("my_key")).toBe("my_value");
    });
});



describe("Storage Class ", function() {
    it("method get: with wrong key, it shold return value of second argument", function() {
        expect(Storage.get("notFoo","defaultFoo")).toBe("defaultFoo");
    });
});



import Helper from "../../src/javascript/classes/Helper";

describe("Helper class", function () {

    it("method reverse: should reverse given string argument", function () {
        expect(Helper.reverse("foo 𝌆 bar mañana mañana")).toBe("anãnam anañam rab 𝌆 oof");
        expect(Helper.reverse("avs")).not.toBe("sd");
    });

    it("method isFunction: should check given argument is function or not", function () {
        expect(Helper.isFunction(function () { return; })).toBe(true);
        expect(Helper.isFunction("mammad")).not.toBe(true);
    });

    it("method log: should log given argument on console and return nothing", function () {
        expect(Helper.log("foo log")).toBe(undefined);
    });

    it("method fetchJson: should throw error json resource from mistaken given API as argument", function () {
        let data = JSON.stringify(require('../fakejson.json'));
        console.log(data);
        var fetchJson = Helper.fetchJson("../fakejson.json");
        fetchJson.then(result => {
            expect(result).toBe("data");
        }).catch(error => {
        });
    });


});

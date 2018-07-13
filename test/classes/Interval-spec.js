import Interval from "../../src/javascript/classes/Interval";

describe("Interval class", function () {

    var interval = new Interval();
    var time = 1000;
    var fooFunc = function () {
        console.log("foo");
    }
    beforeEach(function () {
        interval.make(fooFunc, time);
    });

    it("method make: should return id of created interval", function () {
        expect(interval.make(fooFunc, time)).toEqual(jasmine.any(Number));
    });

    it("should interval.intervals not be empty after inteval.make", function () {
        expect(Object.keys(interval.intervals).length).toBeGreaterThan(0);
    });

    it("method clearAll: should remove all intervals", function () {
        interval.clearAll();
        expect(Object.keys(interval.intervals).length).toBe(0);
    });

})

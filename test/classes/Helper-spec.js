import Helper from "../../src/javascript/classes/Helper";

describe("Helper class", () => {
	beforeAll(() => {
		expect(Helper._).toBeDefined();
		expect(Helper.fetchJson).toBeDefined();
		expect(Helper.getRandomArbitrary).toBeDefined();
		expect(Helper.getRandomInt).toBeDefined();
		expect(Helper.getYX).toBeDefined();
		expect(Helper.int).toBeDefined();
		expect(Helper.isDay).toBeDefined();
		expect(Helper.isFunction).toBeDefined();
		expect(Helper.isMobile).toBeDefined();
		expect(Helper.log).toBeDefined();
		expect(Helper.removeDom).toBeDefined();
		expect(Helper.reverse).toBeDefined();
		expect(Helper.shuffleArray).toBeDefined();
		expect(Helper.vibrate).toBeDefined();
	});

	it("method _: should return a html element", () => {
		let foo = document.createElement("div");
		foo.className = "foo";
		document.body.appendChild(foo);
		expect(Helper._(".foo")).toBeInDOM();
		expect(Helper._(".bar")).not.toBeInDOM();
	});

	// it("method fetchJson: should return a json data by given json url", () => {
	// 	expect(
	// 		Helper.fetchJson("../fakejson.json").then(response => {
	// 			console.log(response);
	// 		})
	// 	).toBe(true);
	// });

	it("method reverse: should reverse given string argument", () => {
		expect(Helper.reverse("foo 𝌆 bar mañana mañana")).toBe(
			"anãnam anañam rab 𝌆 oof"
		);
		expect(Helper.reverse("avs")).not.toBe("sd");
	});

	it("method isFunction: should check given argument is function or not", () => {
		expect(
			Helper.isFunction(() => {
				return;
			})
		).toBe(true);
		expect(Helper.isFunction("mammad")).not.toBe(true);
	});

	it("method log: should log given argument on console and return nothing", () => {
		expect(Helper.log("foo log")).toBe(undefined);
	});

	// it("method fetchJson: should throw error json resource from mistaken given API as argument", function () {
	//     let data = JSON.stringify(require('../fakejson.json'));
	//     console.log(data);
	//     var fetchJson = Helper.fetchJson("../fakejson.json");
	//     fetchJson.then(result => {
	//         expect(result).toBe("data");
	//     }).catch(error => {
	//     });
	// });
});

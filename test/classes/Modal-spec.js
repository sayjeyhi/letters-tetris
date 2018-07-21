import Modal from "../../src/javascript/classes/Modal";

describe("Modal Class ", () => {
	let modal = new Modal();

	beforeAll(() => {
		expect(Modal._createHeader).toBeDefined();
		expect(Modal._createContent).toBeDefined();
		expect(Modal._createFooter).toBeDefined();
		expect(modal.show).toBeDefined();
		expect(modal.destroy).toBeDefined();
		expect(modal.show).toBeDefined();
	});
});

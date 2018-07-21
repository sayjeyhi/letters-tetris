import Explosion from "../../src/javascript/classes/Explosion";

describe("Timeout Class ", () => {
	beforeAll(() => {
		expect(Explosion.explode).toBeDefined();
		expect(Explosion._particle).toBeDefined();
		expect(Explosion._render).toBeDefined();
		expect(Explosion._getOneFrameDistance).toBeDefined();
		expect(Explosion._moveOnAngle).toBeDefined();
	});
});

import Settings from "../../src/javascript/classes/Tetris/Settings";

describe("Settings Class ", () => {
	beforeAll(() => {
		expect(Settings.set).toBeDefined();
		expect(Settings.show).toBeDefined();
		expect(Settings.getDefaultSettings).toBeDefined();
		expect(Settings._getIntValue).toBeDefined();
		expect(Settings._setMusicSetting).toBeDefined();
		expect(Settings._setGridsSetting).toBeDefined();
		expect(Settings._setLevelSetting).toBeDefined();
		expect(Settings._setColorMode).toBeDefined();
	});
});

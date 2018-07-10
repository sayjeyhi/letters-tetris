/**
 * @class MaterialColor - A class to get Random material color
 *
 * {@link https://github.com/egoist/color-lib/blob/master/color.json Colors from this link }
 */
export default class MaterialColor {

    /**
     * Get Hex value of a random material color
     * @return {string}
     *
     * @example
     * let myRandomColor = MaterialColor.getRandomColor();
     */
    static getRandomColor() {
        let colors = {
            "red": {
                "400": "#ef5350",
                "500": "#f44336",
                "600": "#e53935",
                "700": "#d32f2f",
                "800": "#c62828",
                "900": "#b71c1c",
                "hex": "#f44336",
                "a200": "#ff5252",
                "a400": "#ff1744",
                "a700": "#d50000"
            },
            "pink": {
                "400": "#ec407a",
                "500": "#e91e63",
                "600": "#d81b60",
                "700": "#c2185b",
                "800": "#ad1457",
                "900": "#880e4f",
                "hex": "#e91e63",
                "a400": "#f50057",
                "a700": "#c51162"
            },
            "purple": {
                "400": "#ab47bc",
                "500": "#9c27b0",
                "600": "#8e24aa",
                "700": "#7b1fa2",
                "800": "#6a1b9a",
                "900": "#4a148c",
                "hex": "#9c27b0",
                "a200": "#e040fb",
                "a400": "#d500f9",
                "a700": "#aa00ff"
            },
            "deepPurple": {
                "400": "#7e57c2",
                "500": "#673ab7",
                "600": "#5e35b1",
                "700": "#512da8",
                "800": "#4527a0",
                "900": "#311b92",
                "hex": "#673ab7",
                "a200": "#7c4dff",
                "a400": "#651fff",
                "a700": "#6200ea"
            },
            "indigo": {
                "400": "#5c6bc0",
                "500": "#3f51b5",
                "600": "#3949ab",
                "700": "#303f9f",
                "800": "#283593",
                "hex": "#3f51b5",
                "a200": "#536dfe",
                "a400": "#3d5afe",
                "a700": "#304ffe"
            },
            "blue": {
                "400": "#42a5f5",
                "500": "#2196f3",
                "600": "#1e88e5",
                "700": "#1976d2",
                "800": "#1565c0",
                "900": "#0d47a1",
                "hex": "#2196f3",
                "a200": "#448aff",
                "a400": "#2979ff",
                "a700": "#2962ff"
            },
            "lightBlue": {
                "500": "#03a9f4",
                "600": "#039be5",
                "700": "#0288d1",
                "800": "#0277bd",
                "900": "#01579b",
                "hex": "#03a9f4",
                "a400": "#00b0ff",
                "a700": "#0091ea"
            },
            "cyan": {
                "500": "#00bcd4",
                "600": "#00acc1",
                "700": "#0097a7",
                "800": "#00838f",
                "900": "#006064",
                "hex": "#00bcd4",
                "a700": "#00b8d4"
            },
            "teal": {
                "500": "#009688",
                "600": "#00897b",
                "700": "#00796b",
                "800": "#00695c",
                "900": "#004d40",
                "hex": "#009688",
                "a700": "#00bfa5"
            },
            "green": {
                "500": "#4caf50",
                "600": "#43a047",
                "700": "#388e3c",
                "800": "#2e7d32",
                "900": "#1b5e20",
                "a700": "#00c853"
            },
            "lightGreen": {
                "600": "#7cb342",
                "700": "#689f38",
                "800": "#558b2f",
                "900": "#33691e",
                "hex": "#8bc34a",
                "a700": "#64dd17"
            },
            "lime": {
                "700": "#afb42b",
                "800": "#9e9d24",
                "900": "#827717"
            },
            "yellow": {
                "800": "#f9a825",
                "900": "#f57f17"
            },
            "amber": {
                "900": "#ff6f00",
                "a700": "#ffab00"
            },
            "orange": {
                "700": "#f57c00",
                "800": "#ef6c00",
                "900": "#e65100",
                "a400": "#ff9100",
                "a700": "#ff6d00"
            },
            "deepOrange": {
                "500": "#ff5722",
                "600": "#f4511e",
                "700": "#e64a19",
                "800": "#d84315",
                "900": "#bf360c",
                "hex": "#ff5722",
                "a400": "#ff3d00",
                "a700": "#dd2c00"
            },
            "brown": {
                "400": "#8d6e63",
                "500": "#795548",
                "600": "#6d4c41",
                "700": "#5d4037",
                "800": "#4e342e",
                "hex": "#795548"
            },
            "grey": {
                "600": "#757575",
                "700": "#616161",
                "800": "#424242",
            },
            "blueGrey": {
                "500": "#607d8b",
                "600": "#546e7a",
                "700": "#455a64",
                "800": "#37474f",
            }
        };
        let colorList = colors[MaterialColor.pickRandomProperty(colors)];
        let newColorKey = MaterialColor.pickRandomProperty(colorList);
        return colorList[newColorKey];
    }


    /**
     * Pick a random property of object
     * @param obj
     * @return {*}
     */
    static pickRandomProperty(obj) {
        let result,count = 0;
        for (let prop in obj)
            if (Math.random() < 1 / ++count) result = prop;
        return result;
    }
}

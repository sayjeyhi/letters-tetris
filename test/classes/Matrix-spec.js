// import Matrix from "../../src/javascript/classes/Matrix";
// import MapStack from "../../src/javascript/classes/MapStack";
// // Happy 400
// //
// //
// describe("Matrix Class", () => {
// 	let foundWord = "";
// 	beforeEach(done => {
// 		const matrixArray = [
// 			// X:       0   1   2   3   4   5   6   7
// 			/* 0 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 0
// 			/* 1 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 1
// 			/* 2 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 2
// 			/* 3 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 3
// 			/* 4 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 4
// 			/* 5 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 5
// 			/* 6 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 6
// 			/* 7 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 7
// 			/* 8 */ [" ", " ", " ", " ", " ", " ", " ", " "], // 8
// 			/* 9 */ [" ", " ", " ", "e", "s", "t", " ", " "] // 9
// 			// X:       0   1   2   3   4   5   6   7
// 		];
// 		const matrix = new Matrix(matrixArray);
// 		const words = [{ word: "test" }];
// 		const lastChar = { char: "t", row: 9, column: 2 };
// 		const foundCallback = function(successObject) {
// 			console.log(successObject);
// 			foundWord = words[successObject.wordId].word;
// 			console.log(foundWord);
// 			done();
// 		};
// 		matrix.checkWords(
// 			words,
// 			lastChar,
// 			{ rtl: true, ltr: true },
// 			foundCallback
// 		);
// 	});

// 	it("Check words method should find words in matrix", () => {
// 		expect(foundWord).toBe("");
// 	});
// });
// //
// //
// //
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var sucessObjectReturned;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," "," "," "," "," "], //7
// //             /* 8 */   [" "," "," "," "," "," "," "," "], //8
// //             /* 9 */   [" "," "," ","e","s","t"," "," "], //9
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"test" }];
// //         var foundCallback = function (successObject) {
// //             if(successObject){
// //                 sucessObjectReturned = successObject;
// //             }
// //             done();
// //         };
// //         var lastChar = {char:'t',row:9,column:2};
// //         matrix.checkWords(words,lastChar,{rtl:true},foundCallback);
// //     });
// //
// //     it("Method Check words, Should not find words when check type is one direction: ", function() {
// //         expect(typeof sucessObjectReturned).toBe("undefined")
// //     })
// // });
// //
// //
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var foundWord = "";
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," "," "," "," "," "], //7
// //             /* 8 */   [" "," "," "," "," "," "," "," "], //8
// //             /* 9 */   [" "," "," "," ","م","ا"," ","س"], //9
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"سلام" }];
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             done();
// //         };
// //         var lastChar = {char:'ل',row:9,column:6};
// //         matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
// //     });
// //
// //     it("Method Check words, Should work with persian(or any utf8 characters): ", function() {
// //         expect(foundWord).toBe("سلام");
// //     })
// // });
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," "," "," "," "," "], //7
// //             /* 8 */   [" "," "," "," "," ","پ"," "," "], //8
// //             /* 9 */   [" "," "," "," ","م","ا"," ","س"], //9
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"سلام" }];
// //         var foundCallback = function (successObject) {
// //             falledCharacter = successObject.fallingCharacters[0];
// //             done();
// //         };
// //         var lastChar = {char:'ل',row:9,column:6};
// //         matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
// //     });
// //
// //     it("Characters should fall: ", function() {
// //         var falledSuccessfuly =
// //             falledCharacter.oldX===5 &&
// //             falledCharacter.oldY===8 &&
// //             falledCharacter.newX===5 &&
// //             falledCharacter.newY===9
// //         expect(falledSuccessfuly).toBeTruthy();
// //     })
// // });
// //
// //
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter,foundWord;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," "," "," "," "," "], //7
// //             /* 8 */   [" "," "," "," "," ","a"," "," "], //8
// //             /* 9 */   [" "," "," "," ","a","b","c"," "], //9
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"ad" }];
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             falledCharacter = successObject.fallingCharacters[0];
// //             done();
// //         };
// //         var lastChar = {char:'d',row:8,column:6};
// //
// //         matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
// //     });
// //
// //     it("should find characters with height fall: ", function() {
// //         expect(foundWord).toBeTruthy("ad");
// //     })
// // });
// //
// //
// //
// //
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter,foundWord;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," "," "," "," "," "], //7
// //             /* 8 */   [" "," ","b","b"," "," "," "," "], //8
// //             /* 9 */   [" "," ","a","a"," "," "," "," "], //9
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"ba" }];
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             done();
// //         };
// //
// //         var lastChar = {char:'b',row:9,column:1};
// //         matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
// //     });
// //
// //     it("Characters should fall: ", function() {
// //         // var falledSuccessfuly =
// //         //     falledCharacter.oldX===5 &&
// //         //     falledCharacter.oldY===8 &&
// //         //     falledCharacter.newX===5 &&
// //         //     falledCharacter.newY===9
// //         expect(foundWord).toBeTruthy("ad");
// //     })
// // });
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter,foundWord;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," "," "," "], //5
// //             /* 6 */   [" "," "," ","a"," "," "," "," "], //6
// //             /* 7 */   [" "," "," ","b"," "," "," "," "], //7
// //             /* 8 */   [" "," "," ","a"," "," "," "," "], //8
// //             /* 9 */   [" "," "," ","a"," "," "," "," "], //9
// //             /* 10 */  [" "," "," ","b","b"," "," "," "],//10
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"ba" }];
// //         var lastChar = {row:9,column:4,char:'b'};
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             done();
// //         };
// //         matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
// //     });
// //
// //     it("Characters should fall: ", function() {
// //         expect(foundWord).toBeTruthy("ad");
// //     })
// // });
// //
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter,foundWord;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," ","x"," "," "," "], //0
// //             /* 1 */   [" "," "," "," ","z"," "," "," "], //1
// //             /* 2 */   [" "," "," "," ","e"," "," "," "], //2
// //             /* 3 */   [" "," "," "," ","m"," "," "," "], //3
// //             /* 4 */   [" "," "," "," ","o"," "," "," "], //4
// //             /* 5 */   [" "," "," "," ","s"," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," ","e"," "," "," "], //7
// //             /* 8 */   [" "," "," "," ","s"," "," "," "], //8
// //             /* 9 */   [" "," "," "," ","t"," "," "," "], //9
// //             /* 10 */  [" "," "," "," ","b"," "," "," "],//10
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"test" }];
// //         var lastChar = {row:6,column:4,char:'t'};
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             done();
// //         };
// //         matrix.checkWords(words,lastChar,{ttd:true},foundCallback);
// //     });
// //
// //     it("Characters should fall: ", function() {
// //         expect(foundWord).toBeTruthy("test");
// //     })
// // });
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter,foundWord;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," ","x"," "," "," "], //0
// //             /* 1 */   [" "," "," "," ","z"," "," "," "], //1
// //             /* 2 */   [" "," "," "," ","e"," "," "," "], //2
// //             /* 3 */   [" "," "," "," ","m"," "," "," "], //3
// //             /* 4 */   [" "," "," "," ","o"," "," "," "], //4
// //             /* 5 */   [" "," "," "," ","s"," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," ","e"," "," "," "], //7
// //             /* 8 */   [" "," "," "," ","s"," "," "," "], //8
// //             /* 9 */   [" "," "," "," ","t"," "," "," "], //9
// //             /* 10 */  [" "," "," "," ","b"," "," "," "],//10
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"test" }];
// //         var lastChar = {row:6,column:4,char:'t'};
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             done();
// //         };
// //         matrix.checkWords(words,lastChar,{ttd:true},foundCallback);
// //     });
// //
// //     it("Characters should fall: ", function() {
// //         expect(foundWord).toBeTruthy("test");
// //     })
// // });
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var falledCharacter,foundWord;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," ","x"," "," "," "], //0
// //             /* 1 */   [" "," "," "," ","z"," "," "," "], //1
// //             /* 2 */   [" "," "," "," ","e"," "," "," "], //2
// //             /* 3 */   [" "," "," "," ","m"," "," "," "], //3
// //             /* 4 */   [" "," "," "," ","o"," "," "," "], //4
// //             /* 5 */   [" "," "," "," ","s"," "," "," "], //5
// //             /* 6 */   [" "," "," "," "," "," "," "," "], //6
// //             /* 7 */   [" "," "," "," ","s"," "," "," "], //7
// //             /* 8 */   [" "," "," "," ","e"," "," "," "], //8
// //             /* 9 */   [" "," "," "," ","t"," "," "," "], //9
// //             /* 10 */  [" "," "," "," ","b"," "," "," "],//10
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [{ word:"test" }];
// //         var lastChar = {row:6,column:4,char:'t'};
// //         var foundCallback = function (successObject) {
// //             foundWord = words[successObject.wordId].word;
// //             done();
// //         };
// //         matrix.checkWords(words,lastChar,{dtt:true},foundCallback);
// //     });
// //
// //     it("Characters should fall in {dtt:true}: ", function() {
// //         expect(foundWord).toBeTruthy("test");
// //     })
// // });
// //
// //
// //
// //
// // describe("Matrix Class", function() {
// //     var exploded;
// //     beforeEach(function(done) {
// //         var matrixArray = [
// //             // X:       0   1   2   3   4   5   6   7
// //             /* 0 */   [" "," "," "," "," "," "," "," "], //0
// //             /* 1 */   [" "," "," "," "," "," "," "," "], //1
// //             /* 2 */   [" "," "," "," "," "," "," "," "], //2
// //             /* 3 */   [" "," "," "," "," "," "," "," "], //3
// //             /* 4 */   [" "," "," "," "," "," "," "," "], //4
// //             /* 5 */   [" "," "," "," "," "," ","f"," "], //5
// //             /* 6 */   [" "," "," "," "," "," ","a"," "], //6
// //             /* 7 */   [" "," "," "," "," "," ","l"," "], //7
// //             /* 8 */   [" "," "," "," "," "," ","l"," "], //8
// //             /* 9 */   [" "," ","r","a","n","d","o"," "], //9
// //             /* 10 */  ["1","2","3","s","o","m","e"," "],//10
// //             // X:       0   1   2   3   4   5   6   7
// //         ];
// //         var matrix = new Matrix(matrixArray);
// //         var words = [];
// //         var lastChar = {row: 10, column:7, char:'Doesnt Matter',type:'bomb',typeSize:1};
// //         var foundCallback = function (successObject) {
// //             exploded = successObject;
// //             done();
// //         };
// //         matrix.checkWords(words,lastChar,{dtt:true},foundCallback);
// //     });
// //
// //     it("Bomb should delete characters near it: ", function() {
// //         let ex = exploded.explodedChars;
// //         let falled = exploded.fallingCharacters;
// //
// //
// //
// //         let didExplod =
// //             ex[0].y === 10 &&
// //             ex[0].x === 7 &&
// //             ex[1].y === 9 &&
// //             ex[1].x === 6 &&
// //             ex[2].y === 10 &&
// //             ex[2].x === 6;
// //         expect(didExplod).toBeTruthy();
// //
// //
// //         let didFall =
// //             falled[0].oldY === 8 &&
// //             falled[0].oldX === 6 &&
// //             falled[0].newY === 10 &&
// //             falled[0].newX === 6 &&
// //
// //             falled[1].oldY === 7 &&
// //             falled[1].oldX === 6 &&
// //             falled[1].newY === 9 &&
// //             falled[1].newX === 6 &&
// //
// //             falled[2].oldY === 6 &&
// //             falled[2].oldX === 6 &&
// //             falled[2].newY === 8 &&
// //             falled[2].newX === 6 &&
// //
// //             falled[3].oldY === 5 &&
// //             falled[3].oldX === 6 &&
// //             falled[3].newY === 7 &&
// //             falled[3].newX === 6
// //
// //         expect(didFall).toBeTruthy()
// //
// //     })
// // });

// //
// // describe('Matrix Class', () => {
// // 	const falledStack = new MapStack();
// // 	let falled;
// // 	const direction = { dtt: true, rtl: true, ltr: true, ttd: true };
// //
// //
// // 	const matrixArray = [
// // 		// X:       0   1   2   3   4   5   6   7
// // 		/* 0 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 0
// // 		/* 1 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 1
// // 		/* 2 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 2
// // 		/* 3 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 3
// // 		/* 4 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 4
// // 		/* 5 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 5
// // 		/* 6 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 6
// // 		/* 7 */ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 7
// // 		/* 8 */ [' ', ' ', ' ', 'o', 'z', ' ', ' ', ' '], // 8
// // 		/* 9 */ [' ', ' ', 'o', 'f', 'o', ' ', ' ', ' '], // 9
// // 		/* 10 */ [' ', ' ', 'e', 's', 't', 'o', ' ', ' ']// 10
// // 		// X:       0   1   2   3   4   5   6   7
// // 	];
// // 	const matrix = new Matrix(matrixArray);
// // 	const words = [{ word: 'test' }, { word: 'foo' }, { word: 'zoo' }];
// // 	const lastChar = { row: 10, column: 1, char: 't' };
// //
// // 	beforeEach(done => {
// // 		function checkSuccessWordStack(mapStack) {
// // 			const falledCharacter = mapStack.popItem();
// // 			if (falledCharacter === false) {
// // 				// Stack is empty, resume the game
// // 				console.log('Stack is empty');
// // 				done();
// // 				return;
// // 			}
// // 			const x = falledCharacter.x;
// // 			const y = falledCharacter.newY;
// // 			console.log(`checking y: ${y}  x: ${x}`);
// // 			if (matrix.isNotEmpty(y, x)) matrix.checkWords(words, { row: y, column: x, char: matrix.getCharacter(y, x) }, direction, foundCallback);
// // 			else {
// // 				checkSuccessWordStack(mapStack);
// // 			}
// // 		}
// //
// //
// // 		var foundCallback = function(successObject) {
// // 			if (!successObject) {
// // 				checkSuccessWordStack(falledStack);
// // 			}
// // 			falled = successObject.fallingCharacters;
// // 			// Animate Falled, THEN AFTER ANIMATION,
// // 			// MERGE STACK
// // 			// CALL STACK CHECK
// // 			// If not empty, Pop & Check words
// //
// // 			falledStack.merge(successObject.fallingCharacters);
// // 			checkSuccessWordStack(falledStack);
// // 			// done();
// // 		};
// // 		matrix.checkWords(words, lastChar, direction, foundCallback);
// // 	});
// //
// // 	it('Bomb should delete characters near it: ', () => {
// // 		// let ex = falled.explodedChars;
// // 		// let falled = falled.fallingCharacters;
// // 	});
// // });

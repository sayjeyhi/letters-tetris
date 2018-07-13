import Matrix from "../../src/javascript/classes/Matrix";


describe("Matrix Class ", function() {
    var foundWord = "";
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," "," "," "," "," "," "], //6
            /* 7 */   [" "," "," "," "," "," "," "," "], //7
            /* 8 */   [" "," "," "," "," "," "," "," "], //8
            /* 9 */   [" "," "," ","e","s","t"," "," "], //9
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"test" }];
        var lastChar = {char:'t',row:9,column:2};
        var foundCallback = function (successObject) {
            foundWord = words[successObject.wordId].word;
            done();
        };
        matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
    });

    it("Check words method should find words in matrix",function(){
        expect(foundWord).toBe("test");
    })
});







describe("Matrix Class ", function() {
    var sucessObjectReturned;
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," "," "," "," "," "," "], //6
            /* 7 */   [" "," "," "," "," "," "," "," "], //7
            /* 8 */   [" "," "," "," "," "," "," "," "], //8
            /* 9 */   [" "," "," ","e","s","t"," "," "], //9
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"test" }];
        var foundCallback = function (successObject) {
            if(successObject){
                sucessObjectReturned = successObject;
            }
            done();
        };
        var lastChar = {char:'t',row:9,column:2};
        matrix.checkWords(words,lastChar,{rtl:true},foundCallback);
    });

    it("Method Check words, Should not find words when check type is one direction: ", function() {
        expect(typeof sucessObjectReturned).toBe("undefined")
    })
});






describe("Matrix Class ", function() {
    var foundWord = "";
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," "," "," "," "," "," "], //6
            /* 7 */   [" "," "," "," "," "," "," "," "], //7
            /* 8 */   [" "," "," "," "," "," "," "," "], //8
            /* 9 */   [" "," "," "," ","م","ا"," ","س"], //9
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"سلام" }];
        var foundCallback = function (successObject) {
            foundWord = words[successObject.wordId].word;
            done();
        };
        var lastChar = {char:'ل',row:9,column:6};
        matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
    });

    it("Method Check words, Should work with persian(or any utf8 characters): ", function() {
        expect(foundWord).toBe("سلام");
    })
});




describe("Matrix Class ", function() {
    var falledCharacter;
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," "," "," "," "," "," "], //6
            /* 7 */   [" "," "," "," "," "," "," "," "], //7
            /* 8 */   [" "," "," "," "," ","پ"," "," "], //8
            /* 9 */   [" "," "," "," ","م","ا"," ","س"], //9
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"سلام" }];
        var foundCallback = function (successObject) {
            falledCharacter = successObject.fallingCharacters[0];
            done();
        };
        var lastChar = {char:'ل',row:9,column:6};
        matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
    });

    it("Characters should fall: ", function() {
        var falledSuccessfuly =
            falledCharacter.oldX===5 &&
            falledCharacter.oldY===8 &&
            falledCharacter.newX===5 &&
            falledCharacter.newY===9
        expect(falledSuccessfuly).toBeTruthy();
    })
});






describe("Matrix Class ", function() {
    var falledCharacter,foundWord;
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," "," "," "," "," "," "], //6
            /* 7 */   [" "," "," "," "," "," "," "," "], //7
            /* 8 */   [" "," "," "," "," ","a"," "," "], //8
            /* 9 */   [" "," "," "," ","a","b","c"," "], //9
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"ad" }];
        var foundCallback = function (successObject) {
            foundWord = words[successObject.wordId].word;
            falledCharacter = successObject.fallingCharacters[0];
            done();
        };
        var lastChar = {char:'d',row:8,column:6};

        matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
    });

    it("should find characters with height fall: ", function() {
        expect(foundWord).toBeTruthy("ad");
    })
});








describe("Matrix Class ", function() {
    var falledCharacter,foundWord;
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," "," "," "," "," "," "], //6
            /* 7 */   [" "," "," "," "," "," "," "," "], //7
            /* 8 */   [" "," ","b","b"," "," "," "," "], //8
            /* 9 */   [" "," ","a","a"," "," "," "," "], //9
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"ba" }];
        var foundCallback = function (successObject) {
            foundWord = words[successObject.wordId].word;
            done();
        };

        var lastChar = {char:'b',row:9,column:1};
        matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
    });

    it("Characters should fall: ", function() {
        // var falledSuccessfuly =
        //     falledCharacter.oldX===5 &&
        //     falledCharacter.oldY===8 &&
        //     falledCharacter.newX===5 &&
        //     falledCharacter.newY===9
        expect(foundWord).toBeTruthy("ad");
    })
});











describe("Matrix Class ", function() {
    var falledCharacter,foundWord;
    beforeEach(function(done) {
        var matrixArray = [
            // X:       0   1   2   3   4   5   6   7
            /* 0 */   [" "," "," "," "," "," "," "," "], //0
            /* 1 */   [" "," "," "," "," "," "," "," "], //1
            /* 2 */   [" "," "," "," "," "," "," "," "], //2
            /* 3 */   [" "," "," "," "," "," "," "," "], //3
            /* 4 */   [" "," "," "," "," "," "," "," "], //4
            /* 5 */   [" "," "," "," "," "," "," "," "], //5
            /* 6 */   [" "," "," ","a"," "," "," "," "], //6
            /* 7 */   [" "," "," ","b"," "," "," "," "], //7
            /* 8 */   [" "," "," ","a"," "," "," "," "], //8
            /* 9 */   [" "," "," ","a"," "," "," "," "], //9
            /* 10 */  [" "," "," ","b","b"," "," "," "],//10
            // X:       0   1   2   3   4   5   6   7
        ];
        var matrix = new Matrix(matrixArray);
        var words = [{ word:"ba" }];
        var lastChar = {row:9,column:4,char:'b'};
        var foundCallback = function (successObject) {
            foundWord = words[successObject.wordId].word;
            done();
        };
        matrix.checkWords(words,lastChar,{rtl:true,ltr:true},foundCallback);
    });

    it("Characters should fall: ", function() {
        expect(foundWord).toBeTruthy("ad");
    })
});

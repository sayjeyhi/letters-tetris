/**
 * @module Matrix
 */

import Helper from "./Helper";

/**
 * This class will hold values of characters, find successful created words, delete them and etc
 */
export default class Matrix {

    /**
     * @param matrix {Array} Matrix of characters
     * @property matrix {Array} Matrix of characters
     * @example
     *  let matrix = new Matrix([[' ',' ',' ',' '],
     *      [' ',' ',' ',' '],
     *      [' ',' ',' ',' '],
     *      [' ',' ',' ',' ']]
     *  );
     */
    constructor(matrix) {
        this.matrix = matrix;
        this.width = matrix[0].length;
        this.height = matrix.length;
    };


    /**
     * Set character on matrix
     * @param y {Number} - Column of matrix
     * @param x {Number} - Row of matrix
     * @param char {String} - Character to place in matrix
     */
    setCharacter(y,x,char){
        this.matrix[y][x]=char;
    }


    /**
     * Check word happens
     * @param {String[]} words - To search in strings
     * @param {Object} lastChar - Last character that has been set
     * @param {CheckTypes} checkType to search for strings in matrix from x,y point can have any of these values: L|R|T|D
     * @param {Function} successCallback - Returns founded characters, Falling characters and
     */
    checkWords(words,lastChar,checkType,successCallback){
        let rowId = lastChar.row,
            colId = lastChar.column,
            char = lastChar.char;

        this.setCharacter(rowId,colId,char);
        let rights = this._getRailingChars(rowId,colId,'R');
        let lefts = this._getRailingChars(rowId,colId,'L');
        let tops = this._getRailingChars(rowId,colId,'T');
        let downs = this._getRailingChars(rowId,colId,'D');

        const sentenceLTR = (lefts.chars + this.matrix[rowId][colId] + rights.chars); //Create valid sentence from left characters + current character + right characters
        const sentenceTTD = (tops.chars  + this.matrix[rowId][colId] + downs.chars);  //Create valid sentence from left characters + current character + right characters
        const sentenceRTL = (Helper.reverse(sentenceLTR)); //Reverse it to get
        const sentenceDTT = (Helper.reverse(sentenceTTD));

        debugger;

        let foundWord = false;
        for(let i=0, len=words.length; i < len; i++){
            if(!words[i]) continue;
            let pos,
                word = words[i].word
            ;

            if(checkType.ltr && (pos=sentenceLTR.indexOf(word)) !== -1){
                console.log(".LTR: Found valid word:"+ word +" In:" + sentenceLTR);
                let startFrom = colId-lefts.len+pos;
                foundWord=true;
                this._deleteCharacters(rowId,colId,i,{ltr:true},startFrom,word.length,successCallback);
            }else if(checkType.rtl && (pos=sentenceRTL.indexOf(word)) !== -1){
                console.log(".RTL: Found valid word:"+ word +" In:" + sentenceRTL);
                let startFrom = colId+rights.len-pos;
                foundWord=true;
                this._deleteCharacters(rowId,colId,i,{rtl:true},startFrom,word.length,successCallback);
            }else if (checkType.rtl && sentenceRTL.indexOf(word) !== -1){
                console.log("Found valid word:"+ word +" In:" + sentenceRTL)
            }else if (checkType.dtt && sentenceDTT.indexOf(word) !== -1){
                console.log("Found valid word:"+ word +" In:" + sentenceDTT)
            }
        }


        if(!foundWord){
            //No word has been found, call the callback, without param
            successCallback();
        }

    }



    /**
     * @typedef {Object} RailingChars
     * @property {Number} len  - Length to show how much did we walked in each direction to either reach to border or whiteSpace
     * @property {String} chars - String which shows which chars did we found
     */

    /**
     * @return {RailingChars}
     * @param {Number} y - Index of row in matrix
     * @param {Number} x - Index of column in matrix
     * @param {String} direction to search for strings in matrix from x,y point can have any of these values: L|R|T|D
     */
    _getRailingChars(y,x,direction){
        let railingChars='';//Found characters in each directions
        let len=0;//Determines how much did we move in each direction to get to space or end of direction

        let i=1;//i is just the iterator in loops
        switch(direction){
            case 'R':
                //Go in Right direction
                //i starts with 1 because we dont want the current character
                //This loop will go to right until it reaches the border OR next character is ' '
                //Rest of cases are just like this method but with differnt direction
                // from=1+x;
                for(i=1;i+x<this.width && this.matrix[y][i+x]!==' ';i++){
                    railingChars+=this.matrix[y][i+x];
                    len++;
                }
                break;
            case 'L':
                for(i=1;x-i>=0 && this.matrix[y][x-i]!==' ';i++){
                    railingChars=this.matrix[y][x-i] + railingChars;
                    len++;
                }
                break;
            case 'T':
                for(i=1;y-i>=0 && this.matrix[y-i][x]!==' ';i++){
                    railingChars+=this.matrix[y-i][x];
                    len++;
                }
                break;
            case 'D':
                for(i=1;y+i<this.height && this.matrix[y+i][x]!==' ';i++){
                    railingChars+=this.matrix[y+i][x];
                    len++;
                }
                break;
        }

        return {
            chars:railingChars,
            len:len
        }
    }

    /**
     * @typedef {Object} CheckTypes - An object representing in which direction should function search for words
     * @property {Boolean} rtl - Determines if should check Right To Left direction
     * @property {Boolean} ltr - Determines if should check Left To Right direction
     * @property {Boolean} ttd - Determines if should check Top To Down direction
     * @property {Boolean} dtt - Determines if should check Down To Top direction
     */

    /**
     * Delete characters from matrix
     * @param rowId {Number} - Row id of last checking character in matrix
     * @param colId {Number} - col id of last checking character in matrix
     * @param wordId {Number} - Id of founded word
     * @param checkType {CheckTypes} - An checkType Object to find direction
     * @param occurancePositionFrom {Number} - Start position of word
     * @param occurancePositionLenght {Number} - Length of word
     * @param deleteCallBack {Function} - Function to callback when foundWord and Falling words has been found
     */
    _deleteCharacters(rowId,colId,wordId,checkType,occurancePositionFrom,occurancePositionLenght,deleteCallBack){

        //Determines if we need to store date to call the callback function if it exists
        let hasCallback = Helper.isFunction(deleteCallBack);
        // successCallback(rowId,i,,c);
        let callbackObject = {
            wordId: wordId,
            wordCharacterPositions:[],//Array of {x,y}
            fallingCharacters:[]//Array of {oldX,oldY,newX,newY}
        };

        if(checkType.ltr){
            //Clear characters in matrix
            for(let c=0,i = occurancePositionFrom;i<occurancePositionFrom+occurancePositionLenght;i++,c++){
                this.matrix[rowId][i]=' ';
                if(hasCallback){
                    callbackObject.wordCharacterPositions.push({y:rowId,x:i});
                }

                //Move upper blocks to bottom
                for(let upIndex=rowId;this.matrix[upIndex-1][i] !== ' ' && upIndex>=0;upIndex--){
                    this.matrix[upIndex][i] = this.matrix[upIndex-1][i];
                    this.matrix[upIndex-1][i] = ' ';
                    if(hasCallback){
                        callbackObject.fallingCharacters.push({oldY:upIndex-1,oldX:i,newY:upIndex,newX:i});
                    }
                }
            }
        }else if (checkType.rtl){
            //Clear characters in matrix
            for(let c=0,i=occurancePositionFrom;i>occurancePositionFrom-occurancePositionLenght;--i,++c){
                this.matrix[rowId][i]=' ';

                if(hasCallback){
                    callbackObject.wordCharacterPositions.push({y:rowId,x:i});
                }

                //Move upper blocks to bottom
                for(let upIndex=rowId;this.matrix[upIndex-1][i] !== ' ' && upIndex>=0;upIndex--){
                    this.matrix[upIndex][i] = this.matrix[upIndex-1][i];
                    this.matrix[upIndex-1][i] = ' ';
                    if(hasCallback){
                        callbackObject.fallingCharacters.push({oldY:upIndex-1,oldX:i,newY:upIndex,newX:i});
                    }
                }
            }
        }else if (checkType.ttd){
            //TODO
        }else if (checkType.dtt){
            //TODO
        }
        deleteCallBack(callbackObject);
    }
}


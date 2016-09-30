/* ####################### CREATES A FILE READER CLASS #########################
 *
 * This class is a file reader handle for the specified file string */

var fileReader = function(file){
    this.fcount = 0;    // Keep track of the char position in the file
    var word = [];      // Store a group of char that can make a word
    var char = null;    // Current char being read
    var self = this;

    /* FIND: Look for a specified wrd word inside of the file and goes to the
     * position after it if it was found and return the position. If not,
     * it stays the initial position and returns -1. */
    this.find = function(wrd){
        var fcountB =  self.fcount;
        char = file[self.fcount];
        word = [];
        while(word !== wrd){
            char = file[self.fcount];
            self.fcount++;

            if(char !== " " && char !== "\n") word += char;
            else word = [];

            if(self.fcount > file.length){
                self.fcount = fcountB;
                return -1;
            }
        }
        return self.fcount;
    }

    /* SKIPLINE: Goes to the beginning of the next line and return the position */
    this.skipLine = function(){
        char = file[self.fcount];
        while (char !== "\n"){
            self.fcount++;
            char = file[self.fcount];
        }
        return self.fcount++;
    }

    /* SKIPCOMMENTS: Goes to the next line after a comments session started by
     * a given commentChar */
    this.skipComments = function(commentChar){
        char = file[self.fcount];
        while(char === commentChar){
            self.skipLine();
            char = file[self.fcount];
        }
        return self.fcount;
    }

    /* READWORD: Goes to the end of the next work and returns it */
    this.readWord = function(){
        word = [];
        while(file[self.fcount] !== " " && file[self.fcount] !== "\n"){
            word += file[self.fcount];
            self.fcount++;
        }
        return word;
    }

    /* READCHAR: Increment the position and return the char */
    this.readChar = function(){
        char = file[self.fcount];
        self.fcount++;
        return char;
    }

    /* SKIPSPACES: Goes to the next position where the char is not a space */
    this.skipSpaces = function(){
        while(file[self.fcount] === " " || file[self.fcount].charCodeAt() === 9) self.fcount++;
        return self.count;
    }
}

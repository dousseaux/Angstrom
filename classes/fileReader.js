/* ####################### CREATES A FILE READER CLASS #########################
 *
 * This class is a file reader handle for the specified file string */

var fileReader = function(file){
    this.fcount = 0;
    this.fcountB = 0;
    var word = [];
    var char = [];
    var self = this;

    this.find = function(wrd){
        self.fcountB =  self.fcount;
        char = file[self.fcount];
        word = [];
        while(word !== wrd){
            char = file[self.fcount];
            self.fcount++;

            if(char !== " " && char !== "\n") word += char;
            else word = [];

            if(self.fcount > file.length){
                self.fcount = self.fcountB;
                return -1;
            }
        }
        return self.fcount;
    }

    this.skipLine = function(){
        char = file[self.fcount];
        while (char !== "\n"){
            self.fcount++;
            char = file[self.fcount];
        }
        return self.fcount++;
    }

    this.skipComments = function(commentChar){
        char = file[self.fcount];
        while(char === commentChar){
            self.skipLine();
            char = file[self.fcount];
        }
        return self.fcount;
    }

    this.readWord = function(){
        word = [];
        while(file[self.fcount] !== " " && file[self.fcount] !== "\n"){
            word += file[self.fcount];
            self.fcount++;
        }
        return word;
    }

    this.readChar = function(){
        char = file[self.fcount];
        self.fcount++;
        return char;
    }

    this.skipSpaces = function(){
        while(file[self.fcount] === " " || file[self.fcount].charCodeAt() === 9) self.fcount++;
        return self.count;
    }
}

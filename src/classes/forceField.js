/* ######################### FORCE FIELD CLASS ##############################
 *
 * This class represents the properties of the force field being used that is made
 * by analyzing a group of parameter files passed in prms */

var forceField = function(prms){

    // This section reads and analyze all prms files and store the data properly
    var char = null;
    var word = [];
    var nonbondedpar = [];
    var nonbondedpar14 = [];
    var element1 = [];
    var element2 = [];
    var element3 = [];
    var value1 = 0;
    var value2 = 0;
    var value3 = 0;
    var reader = null;
    var prm = [];
    for(var p=0; p<prms.length; p++){
        prm = prms[p];
        reader = new fileReader(prm);
        // ########## READ BOND PARAMETERS
        if(reader.find("BONDS") !== -1){
            reader.skipLine();
            reader.skipComments("!");
            reader.skipLine();
            while (prm[reader.fcount-1] !== "\n" || prm[reader.fcount] !== "\n"){
                reader.skipSpaces();
                reader.skipComments("!");
                element1 = reader.readWord();
                reader.skipSpaces();
                element2 = reader.readWord();
                reader.skipSpaces();
                value1 = parseFloat(reader.readWord());
                reader.skipSpaces();
                value2 = parseFloat(reader.readWord());
                reader.skipLine();
                this.bonds[element1+element2] = {k: value1, b: value2};
            }
        }
        // ########## READ ANGLES PARAMETERS
        if(reader.find("ANGLES") !== -1){
            reader.skipLine();
            reader.skipComments("!");
            reader.skipLine();
            while (prm[reader.fcount-1] !== "\n" || prm[reader.fcount] !== "\n"){
                reader.skipSpaces();
                reader.skipComments("!");
                element1 = reader.readWord();
                reader.skipSpaces();
                element2 = reader.readWord();
                reader.skipSpaces();
                element3 = reader.readWord();
                reader.skipSpaces();
                value1 = parseFloat(reader.readWord());
                reader.skipSpaces();
                value2 = parseFloat(reader.readWord());
                reader.skipSpaces();
                char = reader.readChar();
                if(char === "!" || char === "\n") this.angles[element1+element2+element3] = {theta0: value2, n: 1.0, k: value1};
                else this.angles[element1+element2+element3] = {theta0: value2, n: 0.0, k: value1};
                reader.skipLine();
            }
        }
        // ########## READ NON BONDED PARAMETERS
        if(reader.find("NONBONDED") !== -1){
            reader.skipLine();
            reader.skipLine();
            reader.skipLine();
            reader.skipComments("!");
            reader.skipLine();
            while(prm[reader.fcount-1] !== "\n" || prm[reader.fcount] !== "\n"){
                reader.skipSpaces();
                if(prm[reader.fcount] === "!") reader.skipLine();
                element1 = reader.readWord();
                reader.skipSpaces();
                reader.readWord();
                reader.skipSpaces();
                value1 = parseFloat(reader.readWord());
                reader.skipSpaces();
                value2 = parseFloat(reader.readWord());
                nonbondedpar.push({type: element1, epsolon: value1, rmin: value2});
                reader.skipSpaces();
                char = reader.readChar();
                //console.log(element1 + "  |  " + char + "Hey"  + prm[reader.fcount] + prm[reader.fcount+1]);
                if(char !== "!" && char !== "\n"){
                    reader.readWord();
                    reader.skipSpaces();
                    value1 = parseFloat(reader.readWord());
                    reader.skipSpaces();
                    value2 = parseFloat(reader.readWord());
                    nonbondedpar14.push({type: element1, epsolon: value1, rmin: value2});
                }else  if(char === "\n") reader.fcount--;
                reader.skipLine();
            }
        }
        // ########## READ NBFIX PARAMETERS
        if(reader.find("NBFIX") !== -1){
            reader.skipLine();
            reader.skipComments("!");
            reader.skipLine();
            wcount = 0;
            word = [];
            for(reader.fcount; (prm[reader.fcount-1] !== "\n" || prm[reader.fcount] !== "\n") && reader.fcount < prm.length; reader.fcount++) {
                char = prm[reader.fcount];
                if(char === "!"){
                    reader.skipComments("!");
                    char = prm[reader.fcount];
                }
                if(char !== " " && char !== "\n"){
                    word += char;
                    if(prm[reader.fcount+1] === " " || prm[reader.fcount+1] === "\n" && word.length > 0){
                        switch(wcount){
                            case 0:
                                element1 = word;
                                wcount++;
                            break;

                            case 1:
                                element2 = word;
                                wcount++;
                            break;

                            case 2:
                                value1 = parseFloat(word);
                                wcount++;
                            break;

                            case 3:
                                value2 = parseFloat(word);
                                wcount = 0;
                                this.nonbonded[element1+element2] = {epsolon: value1, rmin: value2};
                                this.nonbonded[element2+element1] = {epsolon: value1, rmin: value2};
                            break;
                        }
                        word = [];
                        reader.fcount++;
                    }
                }
            }
        }
    }
    for(var i=0; i<nonbondedpar.length; i++){
        this.elementRadius[nonbondedpar[i].type] = nonbondedpar[i].rmin;
        for(var j=0; j<nonbondedpar.length; j++){
            if(!this.nonbonded[nonbondedpar[i].type+nonbondedpar[j].type]){
                this.nonbonded[nonbondedpar[i].type+nonbondedpar[j].type] = {
                epsolon: -Math.sqrt(nonbondedpar[i].epsolon*nonbondedpar[j].epsolon),
                rmin: nonbondedpar[i].rmin + nonbondedpar[j].rmin};
            }
        }
    }
}

forceField.prototype = {

    /* Associative arrays of the type :
     * bonds[element1+element2] = {k: value, b: value}
     * where k and b are the force field value for that type of bond from
     * the parameter file */
    bonds: new Array(),

    /* Associative arrays of the type :
     * angles[element1+element2+element3] = {theta0: value, n: values, k: value};
     * where k,b and n are the force field values for that type of angle from
     * the parameter file */
    angles: new Array(),

    /* Associative arrays of the type :
     * nonbonded[element1+element2] = {epsolon: value, rmin: value}
     * where epsolon and rmin are the force field values for that type of nonbonded
     * from the parameter file */
    nonbonded: new Array(),

    /* Associative arrays of the type :
     * elementRadius[element1] = radius
     * where radius is VDW radius from the force field values for that type */
    elementRadius: new Array(),
}

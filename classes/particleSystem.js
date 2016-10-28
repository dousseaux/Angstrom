// ----------------------------------- MOLECULE SYSTEM CLASS ---------------------------------
var particleSystem = function(pdb, psf){

    this.natoms = 0;
    this.nbonds = 0;
    this.nangles = 0;
    this.nsegs = 1;
    this.nresiduals = 1;
    this.nmolecules = 1;
    this.atomsPos = [];
    this.atomsNames = [];
    this.atomsTypes = [];
    this.atomsSegnames = [];
    this.atomsResidual = [];
    this.atomsMoleculeIndex = [];
    this.moleculesOffset = [];
    this.atomsCharge = [];
    this.atomsMass = [];
    this.atomsBonds = [];
    this.atomsAngles = [];
    this.bonds = [];
    this.angles = [];

    var char = null;
    var len = pdb.length;
    var word = [];
    var fcount = 0;
    var lcount = 0;
    var linesize = 0;
    var ref = 0;
    var bondIndex = [];
    var angleIndex = [];
    var moleculeIndex = 0;
    var residual = [];
    var first = true;
    var second = true;
    var element1 = null;
    var element2 = null;
    var element3 = null;
    var reader = new fileReader(psf);
    var diffResiduals = false;
    var diffSegnames = false;

    // ######################## READ AND ANALYZE PDB ##########################
    while (word !== "ATOM") {
        char = pdb[fcount];
        fcount++;
        if(char !== " " && char !== "\n") word += char;
        else word = [];
    }

    fcount -= 4;
    lcount = fcount + 50;
    for(lcount++; char !== "\n"; lcount++){
        char = pdb[lcount];
        linesize++;
    }
    linesize -= 3;

    while(fcount < len){
        // ##### Identify an atom element in the pdb file
        word = [];
        ref = fcount + 4;
        for(fcount; fcount < ref; fcount++){
            char = pdb[fcount];
            word += char;
        }
        if(word === "ATOM"){
            word = [];
            lcount = fcount;
            this.natoms++;

            fcount += 26;
            ref = fcount+8;
            for(fcount; fcount<ref; fcount++){
                char = pdb[fcount];
                if(char !== " " && char !== "\n") word += char;
            }
            this.atomsPos.push(parseFloat(word));
            word = [];

            fcount = ref
            ref = fcount+8;
            for(fcount; fcount<ref; fcount++){
                char = pdb[fcount];
                if(char !== " " && char !== "\n") word += char;
            }
            this.atomsPos.push(parseFloat(word));
            word = [];

            fcount = ref
            ref = fcount+8;
            for(fcount; fcount<ref; fcount++){
                char = pdb[fcount];
                if(char !== " " && char !== "\n") word += char;
            }
            this.atomsPos.push(parseFloat(word));
            this.atomsPos.push(1.0);
            fcount += linesize;
        }else fcount += linesize + 53;
    }

    // ######################## READ AND ANALYZE PSF ##########################

    this.moleculesOffset.push({firstp: 0, lastp: null});

    for(var i = 0; i<this.natoms; i++){
        bondIndex.push([]);
        angleIndex.push([]);
    }
    // ############# READ ATOM PROPERTIES
    reader.find("!NATOM");
    reader.skipLine();
    for(var i=0; i<this.natoms; i++){
        reader.skipSpaces();
        reader.readWord();
        reader.skipSpaces();
        this.atomsSegnames.push(reader.readWord());
        reader.skipSpaces();
        residual.push(parseFloat(reader.readWord()));
        reader.skipSpaces();
        this.atomsResidual.push(reader.readWord());
        reader.skipSpaces();
        this.atomsNames.push(reader.readWord());
        reader.skipSpaces();
        this.atomsTypes.push(reader.readWord());
        reader.skipSpaces();
        this.atomsCharge.push(parseFloat(reader.readWord()));
        reader.skipSpaces();
        this.atomsMass.push(parseFloat(reader.readWord()));
        reader.skipLine();

        if(residual[i] != residual[i-1] && i > 0){
            diffResiduals = true;
            this.nresiduals++;
        }

        if(this.atomsSegnames[i] != this.atomsSegnames[i-1] && i > 0) diffSegnames = true;

        if(diffResiduals || diffSegnames){
            this.moleculesOffset[moleculeIndex].lastp = i-1;
            this.moleculesOffset.push({firstp: i, lastp: null});
            this.nmolecules++;
            moleculeIndex++;
            diffSegnames = false;
            diffResiduals = false;
        }

        this.atomsMoleculeIndex.push(moleculeIndex);
    }

    this.moleculesOffset[moleculeIndex].lastp =  this.natoms-1;

    // ############# READ BONDS
    reader.find("!NBOND");
    reader.skipLine();
    word = [];
    for(reader.fcount; psf[reader.fcount] !== "\n" || psf[reader.fcount-1] !== "\n"; reader.fcount++) {
        char = psf[reader.fcount];
        if(char !== " " && char !== "\n"){
            word += char;
            if(psf[reader.fcount+1] === " " || psf[reader.fcount+1] === "\n" && word.length > 0){
                if(first){
                    element1 = parseFloat(word) - 1;
                    word = [];
                    first = !first;
                }else{
                    element2 = parseFloat(word) - 1;
                    word = [];
                    first = !first;
                    this.bonds.push(element1);
                    this.bonds.push(element2);
                    this.bonds.push(0);
                    bondIndex[element1].push(this.bonds.length/3);
                    bondIndex[element2].push(-this.bonds.length/3);
                }
                reader.fcount++;
            }
        }
    }
    for(var i = 0; i<this.natoms; i++){
        for(var j = 0; j<4; j++){
            if(Math.abs(bondIndex[i][j]))this.atomsBonds.push(bondIndex[i][j]);
            else this.atomsBonds.push(0);
        }
    }
    this.nbonds = this.bonds.length/3;
    // ############# READ ANGLES
    reader.find("!NTHETA");
    reader.skipLine();
    word = [];
    for(reader.fcount; psf[reader.fcount] !== "\n" || psf[reader.fcount-1] !== "\n"; reader.fcount++) {
        char = psf[reader.fcount];
        if(char !== " " && char !== "\n"){
            word += char;
            if(psf[reader.fcount+1] === " " || psf[reader.fcount+1] === "\n" && word.length > 0){
                if(first){
                    element1 = parseFloat(word)-1;
                    word = [];
                    first = !first;
                }else if(second){
                    element2 = parseFloat(word)-1;
                    word = [];
                    second = !second;
                }else{
                    element3 = parseFloat(word)-1;
                    word = [];
                    first = !first;
                    second = !second;
                    this.angles.push(element1);
                    this.angles.push(element2);
                    this.angles.push(element3);
                    angleIndex[element1].push(this.angles.length - 3);
                    angleIndex[element2].push(this.angles.length - 2);
                    angleIndex[element3].push(this.angles.length - 1);
                }
                reader.fcount++;
            }
        }
    }
    for(var i = 0; i<this.natoms; i++){
        for(var j = 0; j<8; j++){
            if(angleIndex[i][j]+1)this.atomsAngles.push(angleIndex[i][j]);
            else this.atomsAngles.push(-1);
        }
    }
    this.nangles = this.angles.length/3;
}

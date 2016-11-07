/* ######### NOT USED
this.uploadModel = function(){
    var reader = new FileReader();
    var file = self.view.uploader.files[self.view.uploader.files.length-1]
    reader.readAsText(file, "UTF-8");
    reader.onload = function(e){
        var temp = JSON.parse(e.target.result);
        self.data.id = temp.id;
        self.view.pause.click();
        self.gpucomp.state = true;
        self.id = temp.id;
        self.data.position = new Float32Array(objToArray(temp.position));
        self.data.mass = new Float32Array(objToArray(temp.mass));
        self.data.radius = new Float32Array(objToArray(temp.radius));
        self.data.velocity = new Float32Array(objToArray(temp.velocity));
        self.data.colors = new Float32Array(objToArray(temp.colors));
        updateTexture4d(self.gpucomp.gl, self.texsize, self.gpucomp.position, self.data.position);
        updateTexture4d(self.gpucomp.gl, self.texsize, self.gpucomp.velocity, self.data.velocity);
        updateTexture1d(self.gpucomp.gl, self.texsize, self.gpucomp.radius, self.data.radius);
        updateTexture1d(self.gpucomp.gl, self.texsize, self.gpucomp.mass, self.data.mass);
        updateTexture4d(self.gpucomp.gl, self.texsize, self.scene.spheres.colorTex, self.data.colors);
        self.scene.spheres.update();
        self.update();
        self.view.updateInfo();
        self.view.render();
        self.view.pause.click();
        delete temp;
        delete file;
    }
}

// ---------------------------------- ANALYSE PDB FILE --------------------------------
function analyzePDB(molsys, pdb){

    var char = null;
    var len = pdb.length;
    var word = [];

    var fcount = 0;
    var lcount = 0;
    var linesize = 0;
    var ref = 0;

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
        ref = fcount + 4
        for(fcount; fcount < ref; fcount++){
            char = pdb[fcount];
            word += char;
        }
        if(word === "ATOM"){
            word = [];
            lcount = fcount;
            molsys.natoms++;

            fcount += 26;
            ref = fcount+8;
            for(fcount; fcount<ref; fcount++){
                char = pdb[fcount];
                if(char !== " " && char !== "\n") word += char;
            }
            molsys.atomsPos.push(parseFloat(word));
            word = [];

            fcount = ref
            ref = fcount+8;
            for(fcount; fcount<ref; fcount++){
                char = pdb[fcount];
                if(char !== " " && char !== "\n") word += char;
            }
            molsys.atomsPos.push(parseFloat(word));
            word = [];

            fcount = ref
            ref = fcount+8;
            for(fcount; fcount<ref; fcount++){
                char = pdb[fcount];
                if(char !== " " && char !== "\n") word += char;
            }
            molsys.atomsPos.push(parseFloat(word));
            molsys.atomsPos.push(1.0);
            fcount += linesize;
        }else fcount += linesize + 53;
    }
}

// ---------------------------------- ANALYSE PSF FILE --------------------------------
function analyzePSF(molsys, psf){
    var char = null;
    var line = [];
    var word = [];
    var bondIndex = [];
    var angleIndex = [];
    var residualIndex = 0;
    var residual = [];
    var first = true;
    var second = true;
    var element1 = null;
    var element2 = null;
    var element3 = null;
    var reader = new fileReader(psf);

    molsys.residualsOffset.push({firstp: 0, lastp: null});

    for(var i = 0; i<molsys.natoms; i++){
        bondIndex.push([]);
        angleIndex.push([]);
    }
    // ############# READ ATOM PROPERTIES
    reader.find("!NATOM");
    reader.skipLine();
    for(var i=0; i<molsys.natoms; i++){
        reader.skipSpaces();
        reader.readWord();
        reader.skipSpaces();
        reader.readWord();
        reader.skipSpaces();
        residual.push(parseFloat(reader.readWord()));
        reader.skipSpaces();
        molsys.atomsResidual.push(reader.readWord());
        reader.skipSpaces();
        molsys.atomsNames.push(reader.readWord());
        reader.skipSpaces();
        molsys.atomsTypes.push(reader.readWord());
        reader.skipSpaces();
        molsys.atomsCharge.push(parseFloat(reader.readWord()));
        reader.skipSpaces();
        molsys.atomsMass.push(parseFloat(reader.readWord()));
        reader.skipLine();
        if(residual[i] != residual[i-1] && i > 0){
            molsys.residualsOffset[residualIndex].lastp = i-1;
            molsys.residualsOffset.push({firstp: i, lastp: null});
            molsys.nresiduals++;
            residualIndex++;
        }
        molsys.atomsResidualsIndex.push(residualIndex);
    }
    molsys.residualsOffset[residualIndex].lastp =  molsys.natoms-1;
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
                    molsys.bonds.push(element1);
                    molsys.bonds.push(element2);
                    molsys.bonds.push(0);
                    bondIndex[element1].push(molsys.bonds.length/3);
                    bondIndex[element2].push(-molsys.bonds.length/3);
                }
                reader.fcount++;
            }
        }
    }
    for(var i = 0; i<molsys.natoms; i++){
        for(var j = 0; j<4; j++){
            if(Math.abs(bondIndex[i][j]))molsys.atomsBonds.push(bondIndex[i][j]);
            else molsys.atomsBonds.push(0);
        }
    }
    molsys.nbonds = molsys.bonds.length/3;
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
                    molsys.angles.push(element1);
                    molsys.angles.push(element2);
                    molsys.angles.push(element3);
                    angleIndex[element1].push(molsys.angles.length - 3);
                    angleIndex[element2].push(molsys.angles.length - 2);
                    angleIndex[element3].push(molsys.angles.length - 1);
                }
                reader.fcount++;
            }
        }
    }
    for(var i = 0; i<molsys.natoms; i++){
        for(var j = 0; j<8; j++){
            if(angleIndex[i][j]+1)molsys.atomsAngles.push(angleIndex[i][j]);
            else molsys.atomsAngles.push(-1);
        }
    }
    molsys.nangles = molsys.angles.length/3;
}

// ---------------------------------- ANALYSE PRM FILE --------------------------------
function analyzePRM(forceField, prms){
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
                forceField.bonds[element1+element2] = {k: value1, b: value2};
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
                if(char === "!" || char === "\n") forceField.angles[element1+element2+element3] = {theta0: value2, n: 1.0, k: value1};
                else forceField.angles[element1+element2+element3] = {theta0: value2, n: 0.0, k: value1};
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
                                forceField.nonbonded[element1+element2] = {epsolon: value1, rmin: value2};
                                forceField.nonbonded[element2+element1] = {epsolon: value1, rmin: value2};
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
        forceField.elementRadius[nonbondedpar[i].type] = nonbondedpar[i].rmin;
        for(var j=0; j<nonbondedpar.length; j++){
            if(!forceField.nonbonded[nonbondedpar[i].type+nonbondedpar[j].type]){
                forceField.nonbonded[nonbondedpar[i].type+nonbondedpar[j].type] = {
                epsolon: -Math.sqrt(nonbondedpar[i].epsolon*nonbondedpar[j].epsolon),
                rmin: nonbondedpar[i].rmin + nonbondedpar[j].rmin};
            }
        }
    }
}

// -------------------------------------- SQUARE CLASS --------------------------------
var square = function(scene, shader){

    // VARIABLES
    this.gl = scene.gl;
    this.shader = shader;
    this.scene = scene;

    // CREATE MODEL MATRICES
    this.translation      = [];
    this.xrotation        = [];
    this.yrotation        = [];
    this.zrotation        = [];
    this.scalem           = [];

    // SCALE PARAMETERS
    this.scale = {x:1, y:1, z:1};
    // ROTATION ANGLES
    this.angle = {x:0, y:0, z:0};
    // TRANSLATION PARAMETERS
    this.translate = {x:0, y:0, z:0};

    this.shininess = 10;

    this.color = [0.5, 0.5, 0.5, 0.1];

    // INITIALIZE MODEL MATRIX
    modelMatrix(this);

    // LINK BUFFERS WITH SHADER ATTRIBUTES
    this.shaderVertexNormalAttribute = this.gl.getAttribLocation(this.shader, "vNormal");
    this.vertexPositionAttribute = this.gl.getAttribLocation(this.shader, "vertexPos");

    // SET SHADER VARIABLES POINTERS
    this.projectionMatrixUniform = this.gl.getUniformLocation(this.shader, "projectionMatrix");
    this.translationUniform = this.gl.getUniformLocation(this.shader, "translation");
    this.rotationxUniform = this.gl.getUniformLocation(this.shader, "xrotation");
    this.rotationyUniform = this.gl.getUniformLocation(this.shader, "yrotation");
    this.rotationzUniform = this.gl.getUniformLocation(this.shader, "zrotation");
    this.scaleUniform = this.gl.getUniformLocation(this.shader, "scale");
    this.viewMatrixUniform = this.gl.getUniformLocation(this.shader, "viewMatrix");
    this.lightUniform = this.gl.getUniformLocation(this.shader, "light");
    this.lightModeUniform = this.gl.getUniformLocation(this.shader, "lightmode");
    this.shininessUniform = this.gl.getUniformLocation(this.shader, "shininess");
    this.colorUniform = this.gl.getUniformLocation(this.shader, "color")

    var self = this;

    this.updateModel = function(){modelMatrix(self)};
    // DRAW OBJECT
    this.draw =  function() {

        // SET SHADER TO BE USED
        this.gl.useProgram(this.shader);

        // SET BUFFERS TO BE USED
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, scene.squareNormalBuffer);
        this.gl.vertexAttribPointer(this.shaderVertexNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.shaderVertexNormalAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, scene.squareVertexBuffer);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

        // LINK SHADER UNIFORMS WITH OBJECT VARIABLES
        this.gl.uniformMatrix4fv(this.translationUniform, false, this.translation);
        this.gl.uniformMatrix4fv(this.rotationxUniform, false, this.xrotation);
        this.gl.uniformMatrix4fv(this.rotationyUniform, false, this.yrotation);
        this.gl.uniformMatrix4fv(this.rotationzUniform, false, this.zrotation);
        this.gl.uniformMatrix4fv(this.scaleUniform, false, this.scalem);
        this.gl.uniformMatrix4fv(this.viewMatrixUniform, false, scene.viewMatrix);
        this.gl.uniformMatrix4fv(this.projectionMatrixUniform, false, this.scene.projectionMatrix);
        this.gl.uniform3fv(this.lightUniform, this.scene.light);
        this.gl.uniform1f(this.lightModeUniform, this.scene.lightmode);
        this.gl.uniform1f(this.shininessUniform, this.shininess);
        this.gl.uniform4fv(this.colorUniform, this.color);

        // DRAW
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}

square.prototype = {

}
*/

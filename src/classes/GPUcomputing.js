/* ######################### GPU COMPUTING CLASS ##############################
 *
 * This class makes is responsable for making the physics parallel calculation.
 * It uses textures for data input and output and shaders perform the calculation
 * in the GPU. Each shader has a specific purpose and has a single output that is
 * stored the framebuffer being used.
 * IMPORTANT: Since we need the last to positions calculate the new position, instead of
 * always copy the new position texture to the old one, we use the .state property
 * to create a cycle that alternates the current texture position being used. */

var GPUcomputing = function(world){

    /* ------------------- SQUARE VERTEX AND TEXTURE BUFFERS -------------------
     * Create the square that will be "rendered". It is a handle to render a texture
     * to the framebuffer */
    var vertex = [ -1,  1,  0, 1,
                    1,  1,  0, 1,
                   -1, -1,  0, 1,
                   -1, -1,  0, 1,
                    1,  1,  0, 1,
                    1, -1,  0, 1 ];

    var texPixels = [ 0, 1,
                      1, 1,
                      0, 0,
                      0, 0,
                      1, 1,
                      1, 0 ];

    var squareVertexBuffer = world.gl.createBuffer();
    var squareTexBuffer = world.gl.createBuffer();

    world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
    world.gl.bufferData(world.gl.ARRAY_BUFFER, new Float32Array(texPixels), world.gl.STATIC_DRAW);
    world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
    world.gl.bufferData(world.gl.ARRAY_BUFFER, new Float32Array(vertex), world.gl.STATIC_DRAW);


    // ------------- GET SHADERS UNIFORMS AND ATTRIBUTES POINTERS --------------
    // SHADER 0 - Calculate the angle forces
    var S0vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[0], "vTexPixels");
    var S0vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[0], "vertexPos");
    var S0texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[0], "texsize");
    var S0anglesTexUniform = world.gl.getUniformLocation(world.comp_shaders[0], "anglesTex");
    var S0theta0NKTexUniform = world.gl.getUniformLocation(world.comp_shaders[0], "theta0NKTex");
    var S0positionTexUniform = world.gl.getUniformLocation(world.comp_shaders[0], "positionsTex");
    // SHADER 1 - Calculate the bond forces
    var S1vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[1], "vTexPixels");
    var S1vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[1], "vertexPos");
    var S1texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[1], "texsize");
    var S1bondsTexUniform = world.gl.getUniformLocation(world.comp_shaders[1], "bondsTex");
    var S1kbTexUniform = world.gl.getUniformLocation(world.comp_shaders[1], "kbTex");
    var S1positionTexUniform = world.gl.getUniformLocation(world.comp_shaders[1], "positionTex");
    // SHADER 2 - Calculate the new position
    var S2vertexTexAttribute;
    var S2vertexPositionAttribute;
    var S2texsizeUniform;
    var S2positiveLimitUniform;
    var S2negativeLimitUniform;
    var S2bondForcesTexUniform;
    var S2angleForcesTexUniform;
    var S2bondIndexTexUniform;
    var S2atomBondsTexUniform;
    var S2angleIndexTexUniform;
    var S2atoms_massTexUniform;
    var S2atoms_chargeTexUniform;
    var S2atoms_typeCodesTexUniform;
    var S2positionsTexUniform;
    var S2positions0TexUniform;
    var S2e12r12r6TexUniform;
    var S2dtUniform;
    var S2epsolonRUniform;
    var S2kCoulombUniform;
    var S2maxVelocityUnifor;
    var S2dt2Uniform ;
    var S2natomsUniform;
    var S2ntypesUniform;
    this.getShader2Pointers = function(){
        S2vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[2], "vTexPixels");
        S2vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[2], "vertexPos");
        S2texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[2], "texsize");
        S2positiveLimitUniform = world.gl.getUniformLocation(world.comp_shaders[2], "positiveLimit");
        S2negativeLimitUniform = world.gl.getUniformLocation(world.comp_shaders[2], "negativeLimit");
        S2bondForcesTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "bondForcesTex");
        S2angleForcesTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "angleForcesTex");
        S2bondIndexTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "bondIndexTex");
        S2atomBondsTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "atomBondsTex");
        S2angleIndexTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "angleIndexTex");
        S2atoms_massTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "atoms_massTex");
        S2atoms_chargeTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "atoms_chargeTex");
        S2atoms_typeCodesTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "atoms_typeCodesTex");
        S2positionsTexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "positionsTex");
        S2positions0TexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "positions0Tex");
        S2e12r12r6TexUniform = world.gl.getUniformLocation(world.comp_shaders[2], "e12r12r6Tex");
        S2dtUniform = world.gl.getUniformLocation(world.comp_shaders[2], "dt");
        S2epsolonRUniform = world.gl.getUniformLocation(world.comp_shaders[2], "Er");
        S2kCoulombUniform = world.gl.getUniformLocation(world.comp_shaders[2], "Kc");
        S2maxVelocityUniform = world.gl.getUniformLocation(world.comp_shaders[2], "maxVelocity");
        S2dt2Uniform = world.gl.getUniformLocation(world.comp_shaders[2], "dt2");
        S2natomsUniform = world.gl.getUniformLocation(world.comp_shaders[2], "natoms");
        S2ntypesUniform = world.gl.getUniformLocation(world.comp_shaders[2], "ntypes");
    }
    // SHADER 3 - No purpose. General use for debugging
    var S3vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[3], "vTexPixels");
    var S3vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[3], "vertexPos");
    var S3texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[3], "texsize");
    var S3bondForcesTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "bondForcesTex");
    var S3angleForcesTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "angleForcesTex");
    var S3bondIndexTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "bondIndexTex");
    var S3atomBondsTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "atomBondsTex");
    var S3angleIndexTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "angleIndexTex");
    var S3atoms_massTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "atoms_massTex");
    var S3atoms_chargeTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "atoms_chargeTex");
    var S3atoms_typeCodesTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "atoms_typeCodesTex");
    var S3positionsTexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "positionsTex");
    var S3positions0TexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "positions0Tex");
    var S3e12r12r6TexUniform = world.gl.getUniformLocation(world.comp_shaders[3], "e12r12r6Tex");
    var S3dt2Uniform = world.gl.getUniformLocation(world.comp_shaders[3], "dt2");
    var S3natomsUniform = world.gl.getUniformLocation(world.comp_shaders[3], "natoms");
    var S3ntypesUniform = world.gl.getUniformLocation(world.comp_shaders[3], "ntypes");
    // SHADER 4 - Draw positions texture
    var vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[4], "vTexPixels");
    var vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[4], "vertexPos");
    var positionsTexUniform = world.gl.getUniformLocation(world.comp_shaders[4], "positionsTex");
    // SHADER 5 - Calculate angles energy
    var S5vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[5], "vTexPixels");
    var S5vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[5], "vertexPos");
    var S5texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[5], "texsize");
    var S5anglesTexUniform = world.gl.getUniformLocation(world.comp_shaders[5], "anglesTex");
    var S5theta0NKTexUniform = world.gl.getUniformLocation(world.comp_shaders[5], "theta0NKTex");
    var S5positionTexUniform = world.gl.getUniformLocation(world.comp_shaders[5], "positionsTex");
    // SHADER 6 - Calculate bonds energy
    var S6vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[6], "vTexPixels");
    var S6vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[6], "vertexPos");
    var S6texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[6], "texsize");
    var S6bondsTexUniform = world.gl.getUniformLocation(world.comp_shaders[6], "bondsTex");
    var S6kbTexUniform = world.gl.getUniformLocation(world.comp_shaders[6], "kbTex");
    var S6positionTexUniform = world.gl.getUniformLocation(world.comp_shaders[6], "positionTex");
    // SHADER 7 - Calculate non-bonded energy
    var S7vertexTexAttribute;
    var S7vertexPositionAttribute;
    var S7texsizeUniform;
    var S7positiveLimitUniform;
    var S7negativeLimitUniform;
    var S7bondForcesTexUniform;
    var S7angleForcesTexUniform;
    var S7bondIndexTexUniform;
    var S7atomBondsTexUniform;
    var S7angleIndexTexUniform;
    var S7atoms_massTexUniform;
    var S7atoms_chargeTexUniform;
    var S7atoms_typeCodesTexUniform;
    var S7positionsTexUniform;
    var S7positions0TexUniform;
    var S7e12r12r6TexUniform;
    var S7epsolonRUniform;
    var S7kCoulombUniform;
    var S7dtUniform;
    var S7natomsUniform;
    var S7ntypesUniform;
    this.getShader7Pointers = function(){
        S7vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[7], "vTexPixels");
        S7vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[7], "vertexPos");
        S7texsizeUniform = world.gl.getUniformLocation(world.comp_shaders[7], "texsize");
        S7positiveLimitUniform = world.gl.getUniformLocation(world.comp_shaders[7], "positiveLimit");
        S7negativeLimitUniform = world.gl.getUniformLocation(world.comp_shaders[7], "negativeLimit");
        S7bondForcesTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "bondForcesTex");
        S7angleForcesTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "angleForcesTex");
        S7bondIndexTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "bondIndexTex");
        S7atomBondsTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "atomBondsTex");
        S7angleIndexTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "angleIndexTex");
        S7atoms_massTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "atoms_massTex");
        S7atoms_chargeTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "atoms_chargeTex");
        S7atoms_typeCodesTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "atoms_typeCodesTex");
        S7positionsTexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "positionsTex");
        S7positions0TexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "positions0Tex");
        S7e12r12r6TexUniform = world.gl.getUniformLocation(world.comp_shaders[7], "e12r12r6Tex");
        S7epsolonRUniform = world.gl.getUniformLocation(world.comp_shaders[7], "Er");
        S7kCoulombUniform = world.gl.getUniformLocation(world.comp_shaders[7], "Kc");
        S7dtUniform = world.gl.getUniformLocation(world.comp_shaders[7], "dt");
        S7natomsUniform = world.gl.getUniformLocation(world.comp_shaders[7], "natoms");
        S7ntypesUniform = world.gl.getUniformLocation(world.comp_shaders[7], "ntypes");
    }
    // SHADER 8 - Set temperature by adding velocity.
    var S8vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[8], "vTexPixels");
    var S8vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[8], "vertexPos");
    var S8positionsTexUniform = world.gl.getUniformLocation(world.comp_shaders[8], "positionsTex");
    var S8velocitiesTexUniform = world.gl.getUniformLocation(world.comp_shaders[8], "velocitiesTex");
    var S8dtUniform = world.gl.getUniformLocation(world.comp_shaders[8], "dt");
    // SHADER 9 - Executes thermost
    var S9vertexTexAttribute = world.gl.getAttribLocation(world.comp_shaders[9], "vTexPixels");
    var S9vertexPositionAttribute = world.gl.getAttribLocation(world.comp_shaders[9], "vertexPos");
    var S9positionsTexUniform = world.gl.getUniformLocation(world.comp_shaders[9], "positionsTex");
    var S9positions0TexUniform = world.gl.getUniformLocation(world.comp_shaders[9], "positions0Tex");
    var S9lambdaUniform = world.gl.getUniformLocation(world.comp_shaders[9], "lambda");
    var S9dtUniform = world.gl.getUniformLocation(world.comp_shaders[9], "dt");

    /* INITIALIZE: Create the textures and framebuffers that will be used */
    this.initialize = function(){
        // ------------------------------ DATA TEXTURES ----------------------------
        this.atoms_mass = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_mass, 1);
        this.atoms_radius = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_radius, 1);
        this.bondsKB = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.bondsKB, 3);
        this.anglesTheta0NK = createDataTexture(world.gl, 4*world.texsize.x, world.texsize.y, world.data.anglesTheta0NK, 3);
        this.atoms_charge = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_charge, 1);
        this.atoms_bondIndex = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_bondIndex, 4);
        this.atoms_bonds = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_bonds, 4);
        this.atoms_angleIndex = createDataTexture(world.gl, 8*world.texsize.x, world.texsize.y, world.data.atoms_angleIndex, 1);
        this.bonds = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.bonds, 3);
        this.angles = createDataTexture(world.gl, 4*world.texsize.x, world.texsize.y, world.data.angles, 4);
        this.atoms_typeCodes = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_bondIndex, 1);
        this.nbE12R12R6 = createDataTexture(world.gl, world.ntypes, world.ntypes, world.data.nbE12R12R6, 3);

        this.atoms_position = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_position, 4);
        this.atoms_position1 = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_position, 4);
        this.atoms_position2 = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.atoms_position, 4);

        this.bondForces = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.bondForces, 4);
        this.angleForces = createDataTexture(world.gl, 4*world.texsize.x, world.texsize.y, world.data.angleForces, 4);
        this.nonbondedForces = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.nonbondedForces, 4);
        this.bondEnergy = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.bondEnergy, 4);
        this.angleEnergy = createDataTexture(world.gl, 4*world.texsize.x, world.texsize.y, world.data.angleEnergy, 4);
        this.nonbondedEnergy = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.nonbondedEnergy, 4);
        this.temperatureVelocity = createDataTexture(world.gl, world.texsize.x, world.texsize.y, world.data.temperatureVelocity, 3);

        // --------------------------- FRAME BUFFERS -------------------------------
        this.FBposition = createTextureFrameBuffer(world.gl, this.atoms_position);
        this.FBbondForces = createTextureFrameBuffer(world.gl, this.bondForces);
        this.FBangleForces = createTextureFrameBuffer(world.gl, this.angleForces);
        this.FBnbforces = createTextureFrameBuffer(world.gl, this.nonbondedForces);
        this.FBposition = createTextureFrameBuffer(world.gl, this.atoms_position);
        this.FBbondEnergy = createTextureFrameBuffer(world.gl, this.bondEnergy);
        this.FBangleEnergy = createTextureFrameBuffer(world.gl, this.angleEnergy);
        this.FBnbEnergy = createTextureFrameBuffer(world.gl, this.nonbondedEnergy);
    }

    /* UPDATETEXTUES: Update the non-static textures */
    this.updateTextures = function(){
        updateTexture1d(world.gl, world.texsize, this.atoms_mass, world.data.atoms_mass);
        updateTexture1d(world.gl, world.texsize, this.atoms_radius, world.data.atoms_radius);
        updateTexture3d(world.gl, world.texsize, this.bondsKB, world.data.bondsKB);
        updateTexture3d(world.gl, {x: 4*world.texsize.x, y: world.texsize.y}, this.anglesTheta0NK, world.data.anglesTheta0NK);
        updateTexture1d(world.gl, world.texsize, this.atoms_charge, world.data.atoms_charge);
        updateTexture4d(world.gl, world.texsize, this.atoms_bondIndex, world.data.atoms_bondIndex);
        updateTexture4d(world.gl, world.texsize, this.atoms_bonds, world.data.atoms_bonds);
        updateTexture1d(world.gl, {x: 8*world.texsize.x, y: world.texsize.y}, this.atoms_angleIndex, world.data.atoms_angleIndex);
        updateTexture3d(world.gl, world.texsize, this.bonds, world.data.bonds);
        updateTexture4d(world.gl, {x: 4*world.texsize.x, y: world.texsize.y}, this.angles, world.data.angles);
        updateTexture1d(world.gl, world.texsize, this.atoms_typeCodes, world.data.atoms_typeCodes);
        updateTexture3d(world.gl, {x: world.ntypes, y: world.ntypes}, this.nbE12R12R6, world.data.nbE12R12R6);

        updateTexture4d(world.gl, world.texsize, this.bondForces, world.data.bondForces);
        updateTexture4d(world.gl, {x: 4*world.texsize.x, y: world.texsize.y}, this.angleForces, world.data.angleForces);
        updateTexture4d(world.gl, world.texsize, this.nonbondedForces, world.data.nonbondedForces);
        updateTexture4d(world.gl, world.texsize, this.bondEnergy, world.data.bondEnergy);
        updateTexture4d(world.gl, {x: 4*world.texsize.x, y: world.texsize.y}, this.angleEnergy, world.data.angleEnergy);
        updateTexture4d(world.gl, world.texsize, this.nonbondedEnergy, world.data.nonbondedEnergy);
        updateTexture3d(world.gl, world.texsize, this.temperatureVelocity, world.data.temperatureVelocity);

        updateTexture4d(world.gl, world.texsize, this.atoms_position, world.data.atoms_position);
        updateTexture4d(world.gl, world.texsize, this.atoms_position1, world.data.atoms_position);
        updateTexture4d(world.gl, world.texsize, this.atoms_position2, world.data.atoms_position);

        updateTextureFrameBuffer(world.gl, this.FBposition, this.atoms_position);
        updateTextureFrameBuffer(world.gl, this.FBbondForces, this.bondForces);
        updateTextureFrameBuffer(world.gl, this.FBangleForces, this.angleForces);
        updateTextureFrameBuffer(world.gl, this.FBnbforces, this.nonbondedForces);
        updateTextureFrameBuffer(world.gl, this.FBposition, this.atoms_position);
        updateTextureFrameBuffer(world.gl, this.FBbondEnergy, this.bondEnergy);
        updateTextureFrameBuffer(world.gl, this.FBangleEnergy, this.angleEnergy);
        updateTextureFrameBuffer(world.gl, this.FBnbEnergy, this.nonbondedEnergy);
    }

    /* COMPUTE: Perform a step calculation in the simulation. This updates the
     * position of the particles in the world. */
    this.compute =  function() {

        world.gl.activeTexture(world.gl.TEXTURE0);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_mass);         // 0
        world.gl.activeTexture(world.gl.TEXTURE1);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.bondsKB);            // 1
        world.gl.activeTexture(world.gl.TEXTURE2);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.anglesTheta0NK);     // 2
        world.gl.activeTexture(world.gl.TEXTURE3);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_charge);       // 3
        world.gl.activeTexture(world.gl.TEXTURE4);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_bondIndex);    // 4
        world.gl.activeTexture(world.gl.TEXTURE5);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_bonds);        // 5
        world.gl.activeTexture(world.gl.TEXTURE6);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_angleIndex);   // 6
        world.gl.activeTexture(world.gl.TEXTURE7);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.bonds);              // 7
        world.gl.activeTexture(world.gl.TEXTURE8);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.angles);             // 8
        world.gl.activeTexture(world.gl.TEXTURE9);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_typeCodes);    // 9
        world.gl.activeTexture(world.gl.TEXTURE10);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.nbE12R12R6);         // 10
        world.gl.activeTexture(world.gl.TEXTURE11);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.bondForces);         // 11
        world.gl.activeTexture(world.gl.TEXTURE12);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.angleForces);        // 12

        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);

        switch(this.state){
            case 0:
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position1, 0);
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
                this.state++;
            break;

            case 1:
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position2, 0);
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
                this.state++;
            break;

            case 2:
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position, 0);
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
                this.state = 0;
            break;
        }

        world.gl.viewport(0, 0, 4*world.texsize.x, world.texsize.y);
        // ######## RENDER S0
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBangleForces);
        world.gl.useProgram(world.comp_shaders[0]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S0vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S0vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S0vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S0vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S0texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform1i(S0anglesTexUniform, 8);
        world.gl.uniform1i(S0theta0NKTexUniform, 2);
        world.gl.uniform1i(S0positionTexUniform, 14);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);

        world.gl.viewport(0, 0, world.texsize.x, world.texsize.y);
        // ######## RENDER S1
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBbondForces);
        world.gl.useProgram(world.comp_shaders[1]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S1vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S1vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S1vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S1vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S1texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform1i(S1bondsTexUniform, 7);
        world.gl.uniform1i(S1kbTexUniform, 1);
        world.gl.uniform1i(S1positionTexUniform, 14);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);

        // ######### RENDER S2
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
        world.gl.useProgram(world.comp_shaders[2]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S2vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S2vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S2vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S2vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S2texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform3fv(S2positiveLimitUniform, [world.positiveLimit.x, world.positiveLimit.y, world.positiveLimit.z]);
        world.gl.uniform3fv(S2negativeLimitUniform, [world.negativeLimit.x, world.negativeLimit.y, world.negativeLimit.z]);
        world.gl.uniform1i(S2bondForcesTexUniform, 11);
        world.gl.uniform1i(S2angleForcesTexUniform, 12);
        world.gl.uniform1i(S2bondIndexTexUniform, 4);
        world.gl.uniform1i(S2atomBondsTexUniform, 5);
        world.gl.uniform1i(S2angleIndexTexUniform, 6);
        world.gl.uniform1i(S2atoms_massTexUniform, 0);
        world.gl.uniform1i(S2atoms_chargeTexUniform, 3);
        world.gl.uniform1i(S2atoms_typeCodesTexUniform, 9);
        world.gl.uniform1i(S2positionsTexUniform, 14);
        world.gl.uniform1i(S2positions0TexUniform, 13);
        world.gl.uniform1i(S2e12r12r6TexUniform, 10);
        world.gl.uniform1f(S2maxVelocityUniform, world.constants.maxVelocity);
        world.gl.uniform1f(S2epsolonRUniform, world.constants.epsolonR);
        world.gl.uniform1f(S2kCoulombUniform, world.constants.kCoulomb);
        world.gl.uniform1f(S2dtUniform, world.constants.dt);
        world.gl.uniform1f(S2dt2Uniform, world.constants.dt2);
        world.gl.uniform1f(S2natomsUniform, world.natoms);
        world.gl.uniform1f(S2ntypesUniform, world.ntypes - 1);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);

        // ######### RENDER S3
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBnbforces);
        world.gl.useProgram(world.comp_shaders[3]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S3vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S3vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S3vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S3vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S3texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform1i(S3bondForcesTexUniform, 11);
        world.gl.uniform1i(S3angleForcesTexUniform, 12);
        world.gl.uniform1i(S3bondIndexTexUniform, 4);
        world.gl.uniform1i(S3atomBondsTexUniform, 5);
        world.gl.uniform1i(S3angleIndexTexUniform, 6);
        world.gl.uniform1i(S3atoms_massTexUniform, 0);
        world.gl.uniform1i(S3atoms_chargeTexUniform, 3);
        world.gl.uniform1i(S3atoms_typeCodesTexUniform, 9);
        world.gl.uniform1i(S3positionsTexUniform, 14);
        world.gl.uniform1i(S3positions0TexUniform, 13);
        world.gl.uniform1i(S3e12r12r6TexUniform, 10);
        world.gl.uniform1f(S3dt2Uniform, world.constants.dt2);
        world.gl.uniform1f(S3natomsUniform, world.natoms);
        world.gl.uniform1f(S3ntypesUniform, world.ntypes - 1);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);
    }

    /* DRAW: Draw the position texture in the screen */
    this.draw = function() {

        switch(this.state){
            case 0:
                world.gl.activeTexture(world.gl.TEXTURE0);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
            break;

            case 1:
                world.gl.activeTexture(world.gl.TEXTURE0);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
            break;

            case 2:
                world.gl.activeTexture(world.gl.TEXTURE0);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
            break;
        }

        //initViewport(world.gl, world.canvas);
        //world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, null);

        world.gl.useProgram(world.comp_shaders[4]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(this.vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(this.vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(this.vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform1i(this.positionsTexUniform, 0);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);
    }

    /* CALC_ENERGY: Calculate a the current energy of the system */
    this.calc_energy = function(){

        world.gl.activeTexture(world.gl.TEXTURE0);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_mass);         // 0
        world.gl.activeTexture(world.gl.TEXTURE1);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.bondsKB);            // 1
        world.gl.activeTexture(world.gl.TEXTURE2);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.anglesTheta0NK);     // 2
        world.gl.activeTexture(world.gl.TEXTURE3);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_charge);       // 3
        world.gl.activeTexture(world.gl.TEXTURE4);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_bondIndex);    // 4
        world.gl.activeTexture(world.gl.TEXTURE5);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_bonds);        // 5
        world.gl.activeTexture(world.gl.TEXTURE6);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_angleIndex);   // 6
        world.gl.activeTexture(world.gl.TEXTURE7);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.bonds);              // 7
        world.gl.activeTexture(world.gl.TEXTURE8);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.angles);             // 8
        world.gl.activeTexture(world.gl.TEXTURE9);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_typeCodes);    // 9
        world.gl.activeTexture(world.gl.TEXTURE10);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.nbE12R12R6);         // 10
        world.gl.activeTexture(world.gl.TEXTURE11);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.bondForces);         // 11
        world.gl.activeTexture(world.gl.TEXTURE12);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.angleForces);        // 12

        switch(this.state){
            case 0:
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
            break;

            case 1:
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
            break;

            case 2:
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
            break;
        }

        world.gl.viewport(0, 0, 4*world.texsize.x, world.texsize.y);
        // ######## RENDER S5
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBangleEnergy);
        world.gl.useProgram(world.comp_shaders[5]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S5vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S5vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S5vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S5vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S5texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform1i(S5anglesTexUniform, 8);
        world.gl.uniform1i(S5theta0NKTexUniform, 2);
        world.gl.uniform1i(S5positionTexUniform, 14);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);

        world.gl.viewport(0, 0, world.texsize.x, world.texsize.y);
        // ######## RENDER S6
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBbondEnergy);
        world.gl.useProgram(world.comp_shaders[6]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S6vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S6vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S6vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S6vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S6texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform1i(S6bondsTexUniform, 7);
        world.gl.uniform1i(S6kbTexUniform, 1);
        world.gl.uniform1i(S6positionTexUniform, 14);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);

        // ######### RENDER S7
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBnbEnergy);
        world.gl.useProgram(world.comp_shaders[7]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S7vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S7vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S7vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S7vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform2fv(S7texsizeUniform, [world.texsize.x, world.texsize.y]);
        world.gl.uniform3fv(S7positiveLimitUniform, [world.positiveLimit.x, world.positiveLimit.y, world.positiveLimit.z]);
        world.gl.uniform3fv(S7negativeLimitUniform, [world.negativeLimit.x, world.negativeLimit.y, world.negativeLimit.z]);
        world.gl.uniform1i(S7bondForcesTexUniform, 11);
        world.gl.uniform1i(S7angleForcesTexUniform, 12);
        world.gl.uniform1i(S7bondIndexTexUniform, 4);
        world.gl.uniform1i(S7atomBondsTexUniform, 5);
        world.gl.uniform1i(S7angleIndexTexUniform, 6);
        world.gl.uniform1i(S7atoms_massTexUniform, 0);
        world.gl.uniform1i(S7atoms_chargeTexUniform, 3);
        world.gl.uniform1i(S7atoms_typeCodesTexUniform, 9);
        world.gl.uniform1i(S7positionsTexUniform, 14);
        world.gl.uniform1i(S7positions0TexUniform, 13);
        world.gl.uniform1i(S7e12r12r6TexUniform, 10);
        world.gl.uniform1f(S7dtUniform, world.constants.dt);
        world.gl.uniform1f(S7epsolonRUniform, world.constants.epsolonR);
        world.gl.uniform1f(S7kCoulombUniform, world.constants.kCoulomb);
        world.gl.uniform1f(S7natomsUniform, world.natoms);
        world.gl.uniform1f(S7ntypesUniform, world.ntypes - 1);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);

        getFrameData4d(world.gl, {x: 4*world.texsize.x, y: world.texsize.y}, this.FBangleEnergy, world.data.angleEnergy);
        getFrameData4d(world.gl, world.texsize, this.FBbondEnergy, world.data.bondEnergy);
        getFrameData4d(world.gl, world.texsize, this.FBnbEnergy, world.data.nonbondedEnergy);
        getFrameData4d(world.gl, world.texsize, this.FBposition, world.data.atoms_position);

        var diff = {x:0, y:0, z:0};
        var k = 15;

        world.kEnergy = 0;
        world.eEnergy = 0;
        world.vdwEnergy = 0;
        world.bondEnergy = 0;
        world.angleEnergy = 0;
        world.wallEnergy = 0;

        for(var i=0; i<world.nangles; i++) world.angleEnergy += world.data.angleEnergy[12*i];
        for(var i=0; i<world.nbonds; i++) world.bondEnergy += world.data.bondEnergy[4*i];
        for(var i=0; i<world.natoms; i++){
            diff.x = 0; diff.y = 0; diff.z = 0;

            if(world.data.atoms_position[4*i] > world.positiveLimit.x) diff.x = (world.data.atoms_position[4*i] - world.positiveLimit.x);
            else if(world.data.atoms_position[4*i] < world.negativeLimit.x) diff.x = (world.data.atoms_position[4*i] - world.negativeLimit.x);
            if(world.data.atoms_position[4*i + 1] > world.positiveLimit.y) diff.y = (world.data.atoms_position[4*i + 1] - world.positiveLimit.y);
            else if(world.data.atoms_position[4*i + 1] < world.negativeLimit.y) diff.y = (world.data.atoms_position[4*i + 1] - world.negativeLimit.y);
            if(world.data.atoms_position[4*i + 2] > world.positiveLimit.z) diff.z = (world.data.atoms_position[4*i + 2] - world.positiveLimit.z);
            else if(world.data.atoms_position[4*i + 2] < world.negativeLimit.z) diff.z = (world.data.atoms_position[4*i + 2] - world.negativeLimit.z);

            world.wallEnergy += 0.5*k*(diff.x*diff.x + diff.y*diff.y + diff.z*diff.z);
            world.eEnergy += world.data.nonbondedEnergy[4*i];
            world.vdwEnergy += world.data.nonbondedEnergy[4*i + 1];
            world.kEnergy += world.data.nonbondedEnergy[4*i + 2];

            //console.log({id: i, x: world.data.atoms_position[4*i].toFixed(2), y: world.data.atoms_position[4*i + 1].toFixed(2), z: world.data.atoms_position[4*i + 2].toFixed(2)});
            //console.log({id: i, ele: world.data.nonbondedEnergy[4*i].toFixed(2), vdw: world.data.nonbondedEnergy[4*i + 1].toFixed(2), kinect: world.data.nonbondedEnergy[4*i + 2].toFixed(2)});
         }

         world.energy = world.kEnergy + world.vdwEnergy + world.eEnergy + world.angleEnergy + world.bondEnergy + world.wallEnergy;
         world.temperature = 2*world.kEnergy/(3*world.natoms*world.constants.kTemp);
         world.energyTempCount = 0;
    }

    /* SETTEMPERATURE: Set the temperature of the system by adding velocity to
     * the atoms */
    this.setTemperature = function(){

        world.gl.activeTexture(world.gl.TEXTURE0);
        world.gl.bindTexture(world.gl.TEXTURE_2D, this.temperatureVelocity);
        switch(this.state){
            case 0:
                world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position2, 0);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
            break;

            case 1:
                world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position, 0);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
            break;

            case 2:
                world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position1, 0);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
            break;
        }

        // ######### RENDER S8
        world.gl.viewport(0, 0, world.texsize.x, world.texsize.y);
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
        world.gl.useProgram(world.comp_shaders[8]);
        // BUFFERS
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
        world.gl.vertexAttribPointer(S8vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S8vertexTexAttribute);
        world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
        world.gl.vertexAttribPointer(S8vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
        world.gl.enableVertexAttribArray(S8vertexPositionAttribute);
        // UNIFORMS
        world.gl.uniform1i(S8velocitiesTexUniform, 0);
        world.gl.uniform1i(S8positionsTexUniform, 14);
        world.gl.uniform1f(S8dtUniform, world.constants.dt);
        world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);
    }

    /* EXECTHERMOSTAT: Regulates the temperature of the system by executing
     * #***# thermostat equation. In order to regulate the temperature properly
     * it must be executed continuasly */
    this.execThermostat = function(){
        world.thermostatCount = 0;

        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);

        switch(this.state){
            case 0:
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position1, 0);
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
                this.state++;
            break;

            case 1:
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position2, 0);
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
                this.state++;
            break;

            case 2:
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position, 0);
                world.gl.activeTexture(world.gl.TEXTURE13);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position1);
                world.gl.activeTexture(world.gl.TEXTURE14);
                world.gl.bindTexture(world.gl.TEXTURE_2D, this.atoms_position2);
                this.state = 0;
            break;
        }

        var lambda = Math.sqrt(1 + world.constants.timeStep/world.thermosTau * (world.temperature0/world.temperature - 1));
        if(world.temperature === 0) lambda = 1;

        if(lambda < 0.995 && !world.isMartine) world.setTemperature();
        else{
            // ######### RENDER S8
            world.gl.viewport(0, 0, world.texsize.x, world.texsize.y);
            world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
            world.gl.useProgram(world.comp_shaders[9]);
            // BUFFERS
            world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareTexBuffer);
            world.gl.vertexAttribPointer(S9vertexTexAttribute, 2, world.gl.FLOAT, false, 0, 0);
            world.gl.enableVertexAttribArray(S9vertexTexAttribute);
            world.gl.bindBuffer(world.gl.ARRAY_BUFFER, squareVertexBuffer);
            world.gl.vertexAttribPointer(S9vertexPositionAttribute, 4, world.gl.FLOAT, false, 0, 0);
            world.gl.enableVertexAttribArray(S9vertexPositionAttribute);
            // UNIFORMS
            world.gl.uniform1i(S9positions0TexUniform, 13);
            world.gl.uniform1i(S9positionsTexUniform, 14);
            world.gl.uniform1f(S9lambdaUniform, lambda);
            world.gl.drawArrays(world.gl.TRIANGLES, 0, 6);
        }
    }

    /* PARTICLEPOSITIONTODATA: Export the position of a particle from the texture
     * to the data object in the world */
    this.particlePositionToData = function(id){
        var arr = new Float32Array(4);
        var row = parseInt(id/world.texsize.x);
        getFramePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.FBposition, arr);
        world.data.atoms_position[4*id] = arr[0];
        world.data.atoms_position[4*id + 1] = arr[1];
        world.data.atoms_position[4*id + 2] = arr[2];
    }

    /* PARTICLESPOSITIONTODATA: Export the position of a interval of particles
     * from the texture to the data object in the world */
    this.particlesPositionToData = function(first, last){
        var row1 = parseInt(first/world.texsize.x);
        var row2 = parseInt(last/world.texsize.x);
        if(row1-row2 === 0 ){
            var arr = new Float32Array(4*(last-first + 1));
            getFramePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.FBposition, arr);
            world.data.atoms_position.set(arr, 4*first);
        }else{
            var arr = new Float32Array(world.texsize.x*4*(row2-row1+1));
            getFramePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.FBposition, arr);
            world.data.atoms_position.set(arr, 4*world.texsize.x*row1);
        }


    }

    /* PARTICLEPOSITIONTOTEXTURE: Import the position of a particles from the
     * data object in the world to the texture */
    this.particlePositionToTexture = function(id){
        var arr = new Float32Array(4);
        arr[0] = world.data.atoms_position[4*id];
        arr[1] = world.data.atoms_position[4*id + 1];
        arr[2] = world.data.atoms_position[4*id + 2];
        var row = parseInt(id/world.texsize.x);
        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
        switch(this.state){
            case 0:
                updateTexturePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.atoms_position2, arr);
                updateTexturePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.atoms_position, arr);
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position, 0);
            break;

            case 1:
                updateTexturePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.atoms_position, arr);
                updateTexturePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.atoms_position1, arr);
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position1, 0);
            break;

            case 2:
                updateTexturePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.atoms_position1, arr);
                updateTexturePixel4d(world.gl, {x: id - row*world.texsize.x, y: row}, this.atoms_position2, arr);
                world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position2, 0);
            break;
        }
    }

    /* PARTICLESPOSITIONTOTEXTURE: Import the position of a interval of particles
     * from the data object in the world to the texture */
    this.particlesPositionToTexture = function(first, last){

        var row1 = parseInt(first/world.texsize.x);
        var row2 = parseInt(last/world.texsize.x);

        world.gl.bindFramebuffer(world.gl.FRAMEBUFFER, this.FBposition);
        if(row1-row2 === 0){
            var arr = world.data.atoms_position.slice(4*first, 4*(last+1));
            switch(this.state){
                case 0:
                    updateTexturePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.atoms_position2, arr);
                    updateTexturePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.atoms_position, arr);
                    world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position, 0);
                break;

                case 1:
                    updateTexturePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.atoms_position, arr);
                    updateTexturePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.atoms_position1, arr);
                    world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position1, 0);
                break;

                case 2:
                    updateTexturePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.atoms_position1, arr);
                    updateTexturePixels4d(world.gl, {x: first - row1*world.texsize.x, y: row1}, {x: last-first+1, y: 1}, this.atoms_position2, arr);
                    world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position2, 0);
                break;
            }
        }else{
            var arr = world.data.atoms_position.slice(4*world.texsize.x*row1, world.texsize.x*4*(row2+1));
            switch(this.state){
                case 0:
                    updateTexturePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.atoms_position2, arr);
                    updateTexturePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.atoms_position, arr);
                    world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position, 0);
                break;

                case 1:
                    updateTexturePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.atoms_position, arr);
                    updateTexturePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.atoms_position1, arr);
                    world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position1, 0);
                break;

                case 2:
                    updateTexturePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.atoms_position1, arr);
                    updateTexturePixels4d(world.gl, {x:0, y: row1}, {x: world.texsize.x, y: row2 - row1 + 1}, this.atoms_position2, arr);
                    world.gl.framebufferTexture2D(world.gl.FRAMEBUFFER, world.gl.COLOR_ATTACHMENT0, world.gl.TEXTURE_2D, this.atoms_position2, 0);
                break;
            }
        }
    }
}

GPUcomputing.prototype = {

    state: 0,

    // ------------------------------ DATA TEXTURES ----------------------------
    atoms_mass: null,
    atoms_radius: null,
    bondsKB: null,
    anglesTheta0NK: null,
    atoms_charge: null,
    atoms_bondIndex: null,
    atoms_bonds: null,
    atoms_angleIndex: null,
    bonds: null,
    angles: null,
    atoms_typeCodes: null,
    bondForces: null,
    angleForces: null,
    atoms_position: null,
    atoms_position1: null,
    atoms_position2: null,
    nbE12R12R6: null,
    nonbondedForces: null,
    bondEnergy: null,
    angleEnergy: null,
    nonbondedEnergy: null,
    temperatureVelocity: null,

    // --------------------------- FRAME BUFFERS -------------------------------
    FBposition: null,
    FBbondForces: null,
    FBangleForces: null,
    FBnbforces: null,
    FBposition: null,
    FBbondEnergy: null,
    FBangleEnergy: null,
    FBnbEnergy: null,
}

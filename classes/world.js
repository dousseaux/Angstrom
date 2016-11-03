var World = function() {
    // ######### WEBGL INITIALIZATION
    this.canvas = document.getElementById("screen");
    this.gl = initWebGL(this.canvas);
    initViewport(this.gl, this.canvas);

    // ######### LOAD WEBGL EXTENSIONS
    this.gl.getExtension("OES_texture_float");           // Enables using GL_FLOAT type for textures
    this.gl.getExtension("OES_texture_float_linear");    // Enables using GL_FLOAT type for textures

    // ######### DEFINE OBJECTS
    this.scene = new scene(this.gl, this.canvas);       // See scene class in proteinSimulation.js file
    this.elements = new elements();                     // See elements class in proteinSimulation.js file

    var self = this; // Points to itself

    /* Function that keeps looping to itself that makes the simulation run continuously.
     * It is first called in the of the setup method */
    this.animate = function(){
        self.update();
        self.renderCount++;
        if(self.renderCount === self.renderFrequency) self.draw();
        self.animationFrameId = window.requestAnimationFrame(self.animate);
    }

    this.resetBoostFactor = function(){
        if(self.constants.boostFactor > 0){
            cancelAnimationFrame(self.animationFrameId);
            self.constants.boostFactor--;
        }else{
            clearTimeout(self.resetBoostFactorTimer);
            self.constants.boostFactor = parseInt(self.view.boostFactor.value);
            self.renderFrequency *= self.constants.boostFactor;
            self.renderCount = 0;
            for(var i=0; i<self.constants.boostFactor; i++) self.animate();
        }
    }
};

World.prototype = {

    canvas: null,                                 // Points to the canvas html element
    gl: null,                                     // Points to the WebGL context

    // ######### GENERAL PROPERTIES
    size0: "auto",                                // Initial world size
    size: {x: 10, y: 10, z: 10},                  // World size
    positiveLimit: {x: 0, y: 0, z: 0},            // Positive limits of the world
    negativeLimit: {x: 0, y: 0, z: 0},            // Negative Limts of the world
    texsize: {x: 1, y: 1},                        // Height and Width of the textures
    atomResolution: 15,                           // Resolution of the atom 3d sphere
    bondResolution: 15,                           // Resolution of the bond 3d cylinder
    axisLength: 0.5,                              // The length of the central axis
    gridcolor: [0.25,0.5,0.75, 1.0],              // Color of the grids
    gridwidth: 1.25,                              // Width of the grids
    selectionColor: [1.4,0.5,0.1,1.0],            // Color of the particles when selected
    selected: [],                                 // Array with the ID of the particles selected
    time: 0,                                      // Current simulation time
    vizualizationMode: false,                     // Specify if should only vizualize
    isMartine: false,                             // Specify wheter is martine force field or not
    initializeGPUComp: true,                      // Specify wheter should intialize GPUcomp shaders on particles adding or not
    animationFrameId: null,                       // Store the id of all animation frames
    resetBoostFactorTimer: null,                  // Timer handle to stop all the current Animation Frames

    // ######### PHYSICS PROPERTIES
    energy: 0,                                    // Total energy of the world
    kEnergy: 0,                                   // Kinect ------------------
    eEnergy: 0,                                   // Electrostatice-----------
    vdwEnergy: 0,                                 // Van der Waals -----------
    bondEnergy: 0,                                // Bond --------------------
    angleEnergy: 0,                               // Angle -------------------
    wallEnergy: 0,                                // Wall --------------------
    temperature: 0,                               // World temperature
    temperature0: 0,                              // World initial temoperature
    thermosTau: 100,                              // Tau parameter of the thermostat
    exclude13: false,                             // Weather or not should use 1-3 bond exclusions

    // ######### FREQUENCIES
    sampleFrequency: 5,                           // Frequency for data sampling
    renderFrequency: 5,                           // Frequency for image rendering
    energyTempFrequency: 10,                      // Frequency for Energy and Temperature calculation
    thermostatFrequency: 2,                       // Frequency to execute the Thermost algorithm

    // ######### COUNTERS
    sampleCount: 0,                               // Handle to the sample frequency
    renderCount: 0,                               // Handle to the render frequency
    energyTempCount: 0,                           // Handle to the Energy and Temperature calculation frequency
    thermostatCount: 0,                           // Handle to the Thermost algorithm execution

    // ######### FLAGS
    sample: false,                                // Enables data sampling
    exec_thermostat: false,                       // Enables execution of the thermostat algorithm
    renderComputation: false,                     // Enables GPU (Physics) computation
    drawAtoms: true,                              // Enables atoms (spheres) drawing
    drawBonds: true,                              // Enables bonds (cylinders) drawing
    drawGrids: true,                              // Enables grids drawing

    // ######### SIMULATION PROPERTIES
    steps: 0,                                     // Counts the steps calculated (progress of the simulation)
    maxSteps: 100000,                             // Maximum number of steps to end the simulation

    // ######### MODES
    colorMode: "atoms",                           /* Color rule used to color the particles. Modes:
                                                         * - atoms: color by atom type.
                                                         * - residuals: color by residuals type.
                                                         * - single: a single color for all.
                                                         * - selected: colors only the selected atoms. */

    drawingMode: "bas",                           /* Mode that the particles and bonds will be drawn. Modes:
                                                         * - bas: Ball and sticks. Particles are sized to a scale of the vdw radius and bonds are displayed.
                                                         * - vdw: Bonds are not displayed. Particles are sized according to their vdw radius.
                                                         * - bonds: Only bonds are displayed.
                                                         * - licorice: Bonds and spheres a sized to the same radius. */

    sampleMode: "energy",                          /* Mode that sets the way that data will be sampled and output in a file. Modes:
                                                          * - energy: The data sampled will be all the Energies.
                                                          * - trajectory: The data sampled will be the position of each atom along the simulation. */


    // ######### TRACKERS
    nmols: 0,                                     // Track the number of molecules in the world
    natoms: 0,                                    // Track the number of atoms in the world
    nbonds: 0,                                    // Track the number of bonds in the world
    nangles: 0,                                   // Track the number of angles in the world
    ntypes: 0,                                    // Track the number of types in the world
    nresiduals: 0,                                // Track the number of residuals in the world
    nmolecules: 0,                                // Track the number of moelcules in the world

    // ######### DEFINE OBJECTS
    scene: null,                                  // See scene class in proteinSimulation.js file
    elements: null,                               // See elements class in proteinSimulation.js file
    view: null,                                   // See view class in view.js file
    atoms: null,                                  // See atoms class in proteinSimulation.js file
    bonds: null,                                  // See bonds class in proteinSimulation.js file
    lines: null,                                  // See lines class in proteinSimulation.js file
    particleSystem: null,                         // See particleSystem class in proteinSimulation.js file
    forceField: null,                             // See forceField class in proteinSimulation.js file

    // ######### DEFINE SHADERS PRGRAM OBJECTS
    comp_shaders: [],                             // Store all the computation shaders program
    atomshader: null,                             // Store the atoms (spheres) shader program
    bondshader: null,                             // Store the bonds (cylinders) shader program
    lineshader: null,                             // Store the lines shader program

    // ######### STANDARD MOLECULES TO ADD
    molecules: {
        water: null,
        methane: null,
        sodium: null,
        chloride: null,
        octane: null,
        lipid: null,
    },

    // ######### CONSTANTS
    constants: {
        boostFactor: 0,                               // Specify how many threads of update will be fired
        timeFactor: 48.88821,
        timeStep: 1,            // ns
        dt: 0,
        dt2: 0,
        maxVelocity: 0,
        kCoulomb: 332.0636,
        epsolonR: 1,
        kTemp: 0.0019872041,    // kcal/(mol*K)
    },

    /* DATA: Intialization of the Data object. Used to store all the simulation data used
     * in the shader (passed through data textures and updated through framebuffers),
     * or only data retrieved from the information files (PDB, PSF, FORCE FIELD).
     * See information on Documentation/dataObject. */
    data: {
        // VARIABLE DATA
        atoms_position: new Float32Array(0),
        bondForces: new Float32Array(0),
        angleForces: new Float32Array(0),
        nonbondedForces: new Float32Array(0),
        bondEnergy: new Float32Array(0),
        angleEnergy: new Float32Array(0),
        nonbondedEnergy: new Float32Array(0),

        // CONSTANT DATA
        atoms_mass: new Float32Array(0),
        atoms_radius: new Float32Array(0),
        bondsKB: new Float32Array(0),
        anglesTheta0NK: new Float32Array(0),
        atoms_charge: new Float32Array(0),
        atoms_bondIndex: new Float32Array(0),
        atoms_bonds: new Float32Array(0),
        atoms_angleIndex: new Float32Array(0),
        bonds: new Float32Array(0),
        angles: new Float32Array(0),
        atoms_typeCodes: new Float32Array(0),
        temperatureVelocity: new Float32Array(0),
        nbE12R12R6: new Float32Array(0),

        // INFORMATION DATA
        atoms_types: [],
        atoms_residuals: [],
        atoms_segnames: [],
        atoms_moleculesIndex: [],
        molecules_Offset: [],
        out: [],
    },

    /* SETUP: Set the initial configurations, estanciate the objects abd starts
     * the simulation loop by calling animate(). */
    setup: function() {
        // ######### LOAD AND CREATE SHADERS - See files for information
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader0').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader1').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader2').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader3').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader4').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader5').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader6').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader7').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader8').text));
        this.comp_shaders.push(createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader9').text));
        this.atomshader = createShaderProgram(this.gl, document.getElementById('SVertexShader').text, document.getElementById('SFragmentShader').text);
        this.bondshader = createShaderProgram(this.gl, document.getElementById('BVertexShader').text, document.getElementById('BFragmentShader').text);
        this.lineshader = createShaderProgram(this.gl, document.getElementById('LVertexShader').text, document.getElementById('LFragmentShader').text);

        this.time -= ((new Date).getTime()/1000);

        // ####### CREATE GPU COMPUTATION, ATOMS AND BONDS OBJECT.
        this.gpucomp = new GPUcomputing(this);
        this.atoms = new atoms(this, this.atomshader);
        this.bonds = new bonds(this, this.bondshader);

        this.constants.dt = this.constants.timeStep / this.constants.timeFactor;
        this.constants.dt2 = this.constants.dt*this.constants.dt;
        this.constants.maxVelocity = 0.2/this.constants.dt;

        this.scene.lightmode = 1;
        this.atoms.sphereLongitude = this.atomResolution;
        this.atoms.sphereLatitude = this.atomResolution;
        this.bonds.precision = this.bondResolution;
        this.view.pause.click();

        var pdb_content = document.getElementById("pdb").text;
        var psf_content = document.getElementById("psf").text;
        var prm_content = [document.getElementById("prm0").text];
        if(document.getElementById("prm1").text !== "") prm_content.push(document.getElementById("prm1").text);
        if(document.getElementById("prm2").text !== "") prm_content.push(document.getElementById("prm2").text);

        this.initializeGPUComp = true;

        if(this.view.isAddEnabled){

            this.view.add.style.display = "inline-block";
            this.molecules.water = new particleSystem(document.getElementById("waterPDB").text, document.getElementById("waterPSF").text);

            if(!this.isMartine){
                this.view.addOctane.style.display = "none";
                this.view.addLipid.style.display = "none";
                this.molecules.methane = new particleSystem(document.getElementById("methanePDB").text, document.getElementById("methanePSF").text);
                this.molecules.sodium = new particleSystem(document.getElementById("sodiumPDB").text, document.getElementById("sodiumPSF").text);
                this.molecules.chloride = new particleSystem(document.getElementById("chloridePDB").text, document.getElementById("chloridePSF").text);
                this.molecules.dinitrogen = new particleSystem(document.getElementById("dinitrogenPDB").text, document.getElementById("dinitrogenPSF").text);
                this.molecules.dioxygen = new particleSystem(document.getElementById("dioxygenPDB").text, document.getElementById("dioxygenPSF").text);
                this.molecules.carbon_dioxide = new particleSystem(document.getElementById("carbon_dioxidePDB").text, document.getElementById("carbon_dioxidePSF").text);
            }else {
                this.view.addMethane.style.display = "none";
                this.view.addSodium.style.display = "none";
                this.view.addChloride.style.display = "none";
                this.view.addDinitrogen.style.display = "none";
                this.view.addDioxygen.style.display = "none";
                this.view.addCarbon_dioxide.style.display = "none";
                document.getElementById("water_img").src = "images/sodium.png";
                this.molecules.octane = new particleSystem(document.getElementById("octanePDB").text, document.getElementById("octanePSF").text);
                this.molecules.lipid = new particleSystem(document.getElementById("lipidPDB").text, document.getElementById("lipidPSF").text);
            }

            prm_content.push(document.getElementById("defaultPRM0").text);
            prm_content.push(document.getElementById("defaultPRM1").text);
            prm_content.push(document.getElementById("defaultPRM2").text);

            this.forceField = new forceField(prm_content);
            this.view.pinAddMenu.onclick();

        }else{

            this.defaultMol = new particleSystem(pdb_content, psf_content)
            this.forceField = new forceField(prm_content);

            if(!this.vizualizationMode){
                this.addMols(this.defaultMol, [0,0,0]);
            }else{
                this.view.pause.style.display = "none";
                this.view.restart.style.display = "none";
                this.view.home.style.display = "none";
                this.view.mouseMode.style.display = "none";
                this.view.add.style.display = "none";
                this.view.energyTemp.style.display = "none";
                this.view.energyInfo.style.display = "none";
                this.view.hideOnAdd[0].style.display = "none";
                this.view.hideOnAdd[1].style.display = "none";
                this.view.structureInfo.style.left = 10;
                this.vizualizeMols(this.defaultMol);
            }
        }

        this.center();
        this.view.setDefaults();

        for(var i=0; i<this.constants.boostFactor; i++) this.animate();

        window.setInterval(this.view.updateScreenInfo, 100);

        this.view.isPaused = true;
        this.view.pause.innerHTML = "play_arrow";
    },

    /* RESET: Set the initial configurations again, delete the old data and load
     * back the inial data. */
    reset: function(){

        if(!this.view.isPaused) this.view.pause.click();

        delete this.data;
        delete this.atoms;
        delete this.bonds;

        this.data = {
            // VARIABLE DATA
            atoms_position: new Float32Array(0),
            bondForces: new Float32Array(0),
            angleForces: new Float32Array(0),
            nonbondedForces: new Float32Array(0),
            bondEnergy: new Float32Array(0),
            angleEnergy: new Float32Array(0),
            nonbondedEnergy: new Float32Array(0),

            // CONSTANT DATA
            atoms_mass: new Float32Array(0),
            atoms_radius: new Float32Array(0),
            bondsKB: new Float32Array(0),
            anglesTheta0NK: new Float32Array(0),
            atoms_charge: new Float32Array(0),
            atoms_bondIndex: new Float32Array(0),
            atoms_bonds: new Float32Array(0),
            atoms_angleIndex: new Float32Array(0),
            bonds: new Float32Array(0),
            angles: new Float32Array(0),
            atoms_typeCodes: new Float32Array(0),
            temperatureVelocity: new Float32Array(0),
            nbE12R12R6: new Float32Array(0),

            // INFORMATION DATA
            atoms_types: [],
            atoms_residuals: [],
            atoms_segnames: [],
            atoms_moleculesIndex: [],
            molecules_Offset: [],
            out: [],
        };

        this.nmols = 0;
        this.natoms = 0;
        this.nbonds = 0;
        this.nangles = 0;
        this.ntypes = 0;
        this.nresiduals = 0;
        this.nmolecules = 0;

        this.temperature = this.temperature0;

        this.setup();
    },

    /* UPDATE: Call the calculation and sampling function according to the their
     * frequency or stop simulation if it reached the steps limit. */
    update: function(){
        if(this.steps <= this.maxSteps && !this.view.isPaused){
            this.sampleCount++;
            this.energyTempCount++;
            this.thermostatCount++;
            this.gpucomp.compute();
            if(this.sampleCount === this.sampleFrequency && this.sample) this.sampleData();
            if(this.energyTempCount === this.energyTempFrequency) this.gpucomp.calc_energy();
            if(this.thermostatCount === this.thermostatFrequency && this.exec_thermostat) this.gpucomp.execThermostat();
            this.steps++;
        }else if(!this.view.isPaused){
            //this.view.restart.click();
            this.view.pause.click();
            this.time += ((new Date).getTime()/1000);
            if(this.sample) this.outputData();
        }
    },

    /* DRAW: Render the particles and scene according to the drawing mode */
    draw: function() {
        this.scene.draw();
        if(this.renderComputation) this.gpucomp.draw();
        else{
            if(this.drawGrids)this.lines.draw();
            if(this.drawAtoms)this.atoms.draw();
            if(this.drawBonds)this.bonds.draw();
        }
        this.renderCount = 0;
    },

    /* SAMPLEDATA: Sample the data according to the sample mode and store it on
     * the out array of the data object */
    sampleData: function(){
        this.sampleCount = 0;
        if(this.steps > 0){
            if(this.sampleMode === "trajectory"){
                getFrameData4d(this.gl, this.texsize, this.gpucomp.FBposition, this.data.atoms_position);
                this.data.out.push("STEP " + this.steps);
                this.data.out.push("");
                this.data.out.push("");
                for(var i=0; i<this.natoms; i++) {
                    this.data.out.push(this.data.atoms_position[4*i].toFixed(5));
                    this.data.out.push("  " + this.data.atoms_position[4*i+1].toFixed(5));
                    this.data.out.push("  " + this.data.atoms_position[4*i+2].toFixed(5));
                }
            }else if(this.sampleMode === "energy"){
                this.data.out.push(this.steps);
                this.data.out.push("  " + this.energy).toFixed(5);
                this.data.out.push("  " + this.temperature).toFixed(5);
                this.data.out.push("  " + this.kEnergy).toFixed(5);
                this.data.out.push("  " + this.eEnergy).toFixed(5);
                this.data.out.push("  " + this.vdwEnergy).toFixed(5);
                this.data.out.push("  " + this.angleEnergy).toFixed(5);
                this.data.out.push("  " + this.bondEnergy).toFixed(5);
                this.data.out.push("  " + this.wallEnergy).toFixed(5);
            }
        }
    },

    /* OUTPUTDATA: Output the sampled data into file after the simulation is over */
    outputData: function(){
        var doc_str = [];
        var columns = 0;

        doc_str += "STEPS EXECUTED: " + this.maxSteps + "\r\n";
        doc_str += "TIME STEP: " + this.constants.timeStep + " fs\r\n";
        doc_str += "NUMBER OF ATOMS: " + this.natoms + "\r\n";
        doc_str += "BOX SIZE: " + this.size.x + " " + this.size.y + " " + this.size.z + "\r\n";
        doc_str += "EXECUTION TIME: " + this.time.toFixed(5) + " seconds\r\n\r\n"

        if(this.sampleMode === "trajectory") columns = 3;
        else if(this.sampleMode === "energy"){
            columns = 9;
            doc_str += "HEADER:\r\nSTEP  ENERGY  TEMPERATURE  KINECT  ELECTROSTATIC  VDW  ANGLE  BOND  WALL\r\n"
        }

        var rows = this.data.out.length / columns;

        for(var i=0; i<rows; i++){
            for(var j=0; j<columns; j++) doc_str += this.data.out[i*columns + j];
            doc_str += "\r\n";
        }

        this.view.saveDoc(doc_str, "dat", this.view.outputName.value);
    },

    /* ADDMOLS: Add a object of type particleSystem to the world centered at the position pos. */
    addMols: function(particleSystem, pos) {

        var unpause = this.view.isPaused;
        this.view.isPaused = true;

        this.gpucomp.particlesPositionToData(0, this.natoms-1);

        while(this.natoms + particleSystem.natoms > this.texsize.x*this.texsize.y){
            if(this.texsize.x === this.texsize.y) this.texsize.x *= 2;
            else this.texsize.y *= 2;
        }

        var temp = {
            atoms_position: new Float32Array(this.data.atoms_position),
            bondForces: new Float32Array(this.data.bondForces),
            angleForces: new Float32Array(this.data.angleForces),
            nonbondedForces: new Float32Array(this.data.nonbondedForces),
            bondEnergy: new Float32Array(this.data.bondEnergy),
            angleEnergy: new Float32Array(this.data.angleEnergy),
            nonbondedEnergy: new Float32Array(this.data.nonbondedEnergy),
            atoms_mass: new Float32Array(this.data.atoms_mass),
            atoms_radius: new Float32Array(this.data.atoms_radius),
            bondsKB: new Float32Array(this.data.bondsKB),
            anglesTheta0NK: new Float32Array(this.data.anglesTheta0NK),
            atoms_charge: new Float32Array(this.data.atoms_charge),
            atoms_bondIndex: new Float32Array(this.data.atoms_bondIndex),
            atoms_bonds: new Float32Array(this.data.atoms_bonds),
            atoms_angleIndex: new Float32Array(this.data.atoms_angleIndex),
            bonds: new Float32Array(this.data.bonds),
            angles: new Float32Array(this.data.angles),
            atoms_typeCodes: new Float32Array(this.data.atoms_typeCodes),
            temperatureVelocity: new Float32Array(this.data.temperatureVelocity),
        }

        this.data.atoms_position = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.bondForces = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.angleForces = new Float32Array(this.texsize.x*this.texsize.y*16);
        this.data.nonbondedForces = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.bondEnergy = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.angleEnergy = new Float32Array(this.texsize.x*this.texsize.y*16);
        this.data.nonbondedEnergy = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.atoms_mass = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.atoms_radius = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.bondsKB = new Float32Array(this.texsize.x*this.texsize.y*3);
        this.data.anglesTheta0NK = new Float32Array(this.texsize.x*this.texsize.y*12);
        this.data.atoms_charge = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.atoms_bondIndex = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.atoms_bonds = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.atoms_angleIndex = new Float32Array(this.texsize.x*this.texsize.y*8);
        this.data.bonds = new Float32Array(this.texsize.x*this.texsize.y*3);
        this.data.angles = new Float32Array(this.texsize.x*this.texsize.y*16);
        this.data.atoms_typeCodes = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.temperatureVelocity = new Float32Array(this.texsize.x*this.texsize.y*3);

        this.data.atoms_position.set(temp.atoms_position);
        this.data.bondForces.set(temp.bondForces);
        this.data.angleForces.set(temp.angleForces);
        this.data.nonbondedForces.set(temp.nonbondedForces);
        this.data.bondEnergy.set(temp.bondEnergy);
        this.data.angleEnergy.set(temp.angleEnergy);
        this.data.nonbondedEnergy.set(temp.nonbondedEnergy);
        this.data.atoms_mass.set(temp.atoms_mass);
        this.data.atoms_radius.set(temp.atoms_radius);
        this.data.bondsKB.set(temp.bondsKB);
        this.data.anglesTheta0NK.set(temp.anglesTheta0NK);
        this.data.atoms_charge.set(temp.atoms_charge);
        this.data.atoms_bondIndex.set(temp.atoms_bondIndex);
        this.data.atoms_bonds.set(temp.atoms_bonds);
        this.data.atoms_angleIndex.set(temp.atoms_angleIndex);
        this.data.bonds.set(temp.bonds);
        this.data.angles.set(temp.angles);
        this.data.atoms_typeCodes.set(temp.atoms_typeCodes);
        this.data.temperatureVelocity.set(temp.temperatureVelocity);

        delete temp;

        if(this.initializeGPUComp) this.gpucomp.initialize();

        this.atoms.update();
        this.bonds.update();

        // UPDATE ATOMS MASSES
        this.data.atoms_mass.set(particleSystem.atomsMass, this.natoms);
        // UPDATE ATOMS CHARGES
        this.data.atoms_charge.set(particleSystem.atomsCharge, this.natoms);
        //UPDATE BONDS
        for(var i=0; i<particleSystem.nbonds; i++){
            this.data.bonds[(this.nbonds + i)*3] = particleSystem.bonds[i*3] + this.natoms;
            this.data.bonds[(this.nbonds + i)*3 + 1] = particleSystem.bonds[i*3 + 1] + this.natoms;
            this.data.bonds[(this.nbonds + i)*3 + 2] = particleSystem.bonds[i*3 + 2] + this.natoms;
        }
        // UPDATE ANGLES
        for(var i=0; i<particleSystem.nangles; i++){
            for(var j=0; j<3; j++){
                this.data.angles[(this.nangles + i)*12 + j*4] = particleSystem.angles[i*3] + this.natoms;
                this.data.angles[(this.nangles + i)*12 + j*4 + 1] = particleSystem.angles[i*3 + 1] + this.natoms;
                this.data.angles[(this.nangles + i)*12 + j*4 + 2] = particleSystem.angles[i*3 + 2] + this.natoms;
                this.data.angles[(this.nangles + i)*12 + j*4 + 3] = j+1;
            }
        }
        for(var i=0; i<particleSystem.natoms; i++){
            // UPDATE AtempTOMS POSITIONS
            this.data.atoms_position[4*(this.natoms + i)] = particleSystem.atomsPos[4*i] + pos[0];
            this.data.atoms_position[4*(this.natoms + i) + 1] = particleSystem.atomsPos[4*i + 1] + pos[1];
            this.data.atoms_position[4*(this.natoms + i) + 2] = particleSystem.atomsPos[4*i + 2] + pos[2];
            this.data.atoms_position[4*(this.natoms + i) + 3] = particleSystem.atomsPos[4*i + 3];
            // UPDATE RESIDUALS INDEX
            this.data.atoms_moleculesIndex.push(particleSystem.atomsMoleculeIndex[i] + this.nmolecules);
            // UPDATE BOND INDEXES
            var k;
            for(var j=0; j<4; j++){
                k = 4*(this.natoms+i) + j;
                if(particleSystem.atomsBonds[i*4 + j] !== 0){
                    this.data.atoms_bondIndex[k] = particleSystem.atomsBonds[i*4 + j] + Math.sign(particleSystem.atomsBonds[i*4 + j])*this.nbonds;
                    if(this.data.atoms_bondIndex[k] > 0.0) this.data.atoms_bonds[k] = this.data.bonds[3*(this.data.atoms_bondIndex[k]-1) + 1];
                    else this.data.atoms_bonds[k] = this.data.bonds[3*(-this.data.atoms_bondIndex[k]-1)];
                }else{
                    this.data.atoms_bondIndex[k] = 0;
                    this.data.atoms_bonds[k] = -1;
                }
            }
            // UPDATE ANGLE INDEXES
            for(var j=0; j<8; j++){
                if(particleSystem.atomsAngles[i*8 + j] !== -1) this.data.atoms_angleIndex[8*(this.natoms + i) + j] = particleSystem.atomsAngles[i*8 + j] + 3*this.nangles;
                else this.data.atoms_angleIndex[8*(this.natoms + i) + j] = -1;
            }
            // UPDATE TYPE LIST AND CODE
            if(isNaN(this.elements.types.code[particleSystem.atomsTypes[i]])){
                this.elements.types.list.push(particleSystem.atomsTypes[i]);
                this.elements.types.radius.push(this.forceField.elementRadius[particleSystem.atomsTypes[i]]);
                this.elements.types.code[particleSystem.atomsTypes[i]] = this.elements.types.list.length - 1;
            }
            // UPDATE ATOM TYPE CODE
            this.data.atoms_typeCodes[this.natoms + i] = this.elements.types.code[particleSystem.atomsTypes[i]];
            this.data.atoms_radius[this.natoms + i] = this.elements.types.radius[this.elements.types.code[particleSystem.atomsTypes[i]]];
            //if(this.data.atoms_radius[this.natoms + i] < 1) this.data.atoms_radius[i + this.natoms] = 1;
        }
        // UPDATE TYPES
        this.data.atoms_types = this.data.atoms_types.concat(particleSystem.atomsTypes);
        // UPDATE RESIDUALS
        this.data.atoms_residuals = this.data.atoms_residuals.concat(particleSystem.atomsResidual);
        // UPDATE SEGNAMES
        this.data.atoms_segnames = this.data.atoms_segnames.concat(particleSystem.atomsSegnames);

        for(var i=0; i<particleSystem.nmolecules; i++){
            this.data.molecules_Offset.push({firstp: particleSystem.moleculesOffset[i].firstp + this.natoms,
                                             lastp: particleSystem.moleculesOffset[i].lastp + this.natoms});
        }

        // UPDATE NBFIX EPSOLON*12, RMIN^12, RMIN^6
        var row = this.elements.types.list.length*3;
        var column = this.elements.types.list.length;
        var par = null;
        var index = null;

        for(var i=0; i<particleSystem.nbonds; i++){
            element1 = particleSystem.atomsTypes[particleSystem.bonds[3*i]];
            element2 = particleSystem.atomsTypes[particleSystem.bonds[3*i + 1]];
            if(this.forceField.bonds[element1+element2]){
                this.data.bondsKB[3*(i+this.nbonds)] = this.forceField.bonds[element1+element2].k;
                this.data.bondsKB[3*(i+this.nbonds) + 1] = this.forceField.bonds[element1+element2].b;
            }else{
                this.data.bondsKB[3*(i+this.nbonds)] = this.forceField.bonds[element2+element1].k;
                this.data.bondsKB[3*(i+this.nbonds) + 1] = this.forceField.bonds[element2+element1].b;
            }
        }

        for(var i=0; i<particleSystem.nangles; i++){
            element1 = particleSystem.atomsTypes[particleSystem.angles[3*i]];
            element2 = particleSystem.atomsTypes[particleSystem.angles[3*i + 1]];
            element3 = particleSystem.atomsTypes[particleSystem.angles[3*i + 2]];
            if(this.forceField.angles[element1+element2+element3]){
                for(var j=0; j<3; j++){
                    this.data.anglesTheta0NK[9*(i+this.nangles) + 3*j] = this.forceField.angles[element1+element2+element3].theta0;
                    this.data.anglesTheta0NK[9*(i+this.nangles) + 3*j + 1] = this.forceField.angles[element1+element2+element3].n;
                    this.data.anglesTheta0NK[9*(i+this.nangles) + 3*j + 2] = this.forceField.angles[element1+element2+element3].k;
                }
            }else{
                for(var j=0; j<3; j++){
                    this.data.anglesTheta0NK[9*(i+this.nangles) + 3*j] = this.forceField.angles[element3+element2+element1].theta0;
                    this.data.anglesTheta0NK[9*(i+this.nangles) + 3*j + 1] = this.forceField.angles[element3+element2+element1].n;
                    this.data.anglesTheta0NK[9*(i+this.nangles) + 3*j + 2] = this.forceField.angles[element3+element2+element1].k;
                }
            }
        }

        this.data.nbE12R12R6 = new Float32Array(row*column);
        for(var i=0; i<this.elements.types.list.length; i++){
            for(var j=0; j<this.elements.types.list.length; j++){
                par = this.forceField.nonbonded[this.elements.types.list[i]+this.elements.types.list[j]];
                index = this.elements.types.code[this.elements.types.list[i]]*row + this.elements.types.code[this.elements.types.list[j]]*3;
                this.data.nbE12R12R6[index]     = par.epsolon*12;
                this.data.nbE12R12R6[index + 1] = Math.pow(par.rmin,12);
                this.data.nbE12R12R6[index + 2] = Math.pow(par.rmin,6);
            }
        }

        // UPDATE TRACKERS
        this.nmols++;
        this.natoms += particleSystem.natoms;
        this.nbonds += particleSystem.nbonds;
        this.nangles += particleSystem.nangles;
        this.nresiduals += particleSystem.nresiduals;
        this.nmolecules += particleSystem.nmolecules;
        this.ntypes = this.elements.types.list.length;

        // ADD NATOM TO SHADER CODE AND COMPILE SHADER
        if(this.exclude13){
            this.comp_shaders[2] = createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader2').text.addAt(4617,this.natoms));
            this.comp_shaders[7] = createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader7').text.addAt(2342,this.natoms));
        }else{
            this.comp_shaders[2] = createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader2_noex13').text.addAt(3469,this.natoms));
            this.comp_shaders[7] = createShaderProgram(this.gl, document.getElementById('CVertexShader').text, document.getElementById('CFragmentShader7_noex13').text.addAt(1218,this.natoms));
        }

        this.gpucomp.getShader2Pointers();
        this.gpucomp.getShader7Pointers();
        this.gpucomp.updateTextures();

        var temp = this.temperature0;
        this.temperature0 = this.temperature;
        this.setTemperature();
        this.gpucomp.calc_energy();
        this.temperature0 = temp;

        // UPDATE SELECTION
        this.select("clear");
        this.select("all");

        this.view.particles.innerHTML = " | Atoms: " + this.natoms;

        this.view.structureInfo.innerHTML = "<tr><td>Molecules</td><td>"+ this.nmolecules +"</td></tr>" +
                                            "<tr><td>Bonds</td><td>"+ this.nbonds +"</td></tr>" +
                                            "<tr><td>Angles</td><td>"+ this.nangles +"</td></tr>" +
                                            "<tr><td>Residuals</td><td>"+ this.nresiduals +"</td></tr>" +
                                            "<tr><td>Types</td><td>"+ this.ntypes +"</td></tr>";

        this.initializeGPUComp = false;

        this.view.isPaused = unpause;
    },

    /* VIZUALIZEMOLS: Add a object of type particleSystem to the world but not for simulation */
    vizualizeMols: function(particleSystem) {

        var unpause = this.view.isPaused;
        this.view.isPaused = true;

        this.gpucomp.particlesPositionToData(0, this.natoms-1);

        while(this.natoms + particleSystem.natoms > this.texsize.x*this.texsize.y){
            if(this.texsize.x === this.texsize.y) this.texsize.x *= 2;
            else this.texsize.y *= 2;
        }

        var temp = {
            atoms_position: new Float32Array(this.data.atoms_position),
            bondForces: new Float32Array(this.data.bondForces),
            angleForces: new Float32Array(this.data.angleForces),
            nonbondedForces: new Float32Array(this.data.nonbondedForces),
            bondEnergy: new Float32Array(this.data.bondEnergy),
            angleEnergy: new Float32Array(this.data.angleEnergy),
            nonbondedEnergy: new Float32Array(this.data.nonbondedEnergy),
            atoms_mass: new Float32Array(this.data.atoms_mass),
            atoms_radius: new Float32Array(this.data.atoms_radius),
            bondsKB: new Float32Array(this.data.bondsKB),
            anglesTheta0NK: new Float32Array(this.data.anglesTheta0NK),
            atoms_charge: new Float32Array(this.data.atoms_charge),
            atoms_bondIndex: new Float32Array(this.data.atoms_bondIndex),
            atoms_bonds: new Float32Array(this.data.atoms_bonds),
            atoms_angleIndex: new Float32Array(this.data.atoms_angleIndex),
            bonds: new Float32Array(this.data.bonds),
            angles: new Float32Array(this.data.angles),
            atoms_typeCodes: new Float32Array(this.data.atoms_typeCodes),
            temperatureVelocity: new Float32Array(this.data.temperatureVelocity),
        }

        this.data.atoms_position = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.bondForces = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.angleForces = new Float32Array(this.texsize.x*this.texsize.y*16);
        this.data.nonbondedForces = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.bondEnergy = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.angleEnergy = new Float32Array(this.texsize.x*this.texsize.y*16);
        this.data.nonbondedEnergy = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.atoms_mass = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.atoms_radius = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.bondsKB = new Float32Array(this.texsize.x*this.texsize.y*3);
        this.data.anglesTheta0NK = new Float32Array(this.texsize.x*this.texsize.y*12);
        this.data.atoms_charge = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.atoms_bondIndex = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.atoms_bonds = new Float32Array(this.texsize.x*this.texsize.y*4);
        this.data.atoms_angleIndex = new Float32Array(this.texsize.x*this.texsize.y*8);
        this.data.bonds = new Float32Array(this.texsize.x*this.texsize.y*3);
        this.data.angles = new Float32Array(this.texsize.x*this.texsize.y*16);
        this.data.atoms_typeCodes = new Float32Array(this.texsize.x*this.texsize.y);
        this.data.temperatureVelocity = new Float32Array(this.texsize.x*this.texsize.y*3);

        this.data.atoms_position.set(temp.atoms_position);
        this.data.bondForces.set(temp.bondForces);
        this.data.angleForces.set(temp.angleForces);
        this.data.nonbondedForces.set(temp.nonbondedForces);
        this.data.bondEnergy.set(temp.bondEnergy);
        this.data.angleEnergy.set(temp.angleEnergy);
        this.data.nonbondedEnergy.set(temp.nonbondedEnergy);
        this.data.atoms_mass.set(temp.atoms_mass);
        this.data.atoms_radius.set(temp.atoms_radius);
        this.data.bondsKB.set(temp.bondsKB);
        this.data.anglesTheta0NK.set(temp.anglesTheta0NK);
        this.data.atoms_charge.set(temp.atoms_charge);
        this.data.atoms_bondIndex.set(temp.atoms_bondIndex);
        this.data.atoms_bonds.set(temp.atoms_bonds);
        this.data.atoms_angleIndex.set(temp.atoms_angleIndex);
        this.data.bonds.set(temp.bonds);
        this.data.angles.set(temp.angles);
        this.data.atoms_typeCodes.set(temp.atoms_typeCodes);
        this.data.temperatureVelocity.set(temp.temperatureVelocity);

        delete temp;

        if(this.initializeGPUComp) this.gpucomp.initialize();

        this.atoms.update();
        this.bonds.update();

        // UPDATE ATOMS MASSES
        this.data.atoms_mass.set(particleSystem.atomsMass, this.natoms);
        // UPDATE ATOMS CHARGES
        this.data.atoms_charge.set(particleSystem.atomsCharge, this.natoms);
        //UPDATE BONDS
        for(var i=0; i<particleSystem.nbonds; i++){
            this.data.bonds[(this.nbonds + i)*3] = particleSystem.bonds[i*3] + this.natoms;
            this.data.bonds[(this.nbonds + i)*3 + 1] = particleSystem.bonds[i*3 + 1] + this.natoms;
            this.data.bonds[(this.nbonds + i)*3 + 2] = particleSystem.bonds[i*3 + 2] + this.natoms;
        }
        // UPDATE ANGLES
        for(var i=0; i<particleSystem.nangles; i++){
            for(var j=0; j<3; j++){
                this.data.angles[(this.nangles + i)*12 + j*4] = particleSystem.angles[i*3] + this.natoms;
                this.data.angles[(this.nangles + i)*12 + j*4 + 1] = particleSystem.angles[i*3 + 1] + this.natoms;
                this.data.angles[(this.nangles + i)*12 + j*4 + 2] = particleSystem.angles[i*3 + 2] + this.natoms;
                this.data.angles[(this.nangles + i)*12 + j*4 + 3] = j+1;
            }
        }
        for(var i=0; i<particleSystem.natoms; i++){
            // UPDATE ATOMS POSITIONS
            this.data.atoms_position[4*(this.natoms + i)] = particleSystem.atomsPos[4*i];
            this.data.atoms_position[4*(this.natoms + i) + 1] = particleSystem.atomsPos[4*i + 1];
            this.data.atoms_position[4*(this.natoms + i) + 2] = particleSystem.atomsPos[4*i + 2];
            this.data.atoms_position[4*(this.natoms + i) + 3] = particleSystem.atomsPos[4*i + 3];
            // UPDATE RESIDUALS INDEX
            this.data.atoms_moleculesIndex.push(particleSystem.atomsMoleculeIndex[i] + this.nmolecules);
            // UPDATE BOND INDEXES
            var k;
            for(var j=0; j<4; j++){
                k = 4*(this.natoms+i) + j;
                if(particleSystem.atomsBonds[i*4 + j] !== 0){
                    this.data.atoms_bondIndex[k] = particleSystem.atomsBonds[i*4 + j] + Math.sign(particleSystem.atomsBonds[i*4 + j])*this.nbonds;
                    if(this.data.atoms_bondIndex[k] > 0.0) this.data.atoms_bonds[k] = this.data.bonds[3*(this.data.atoms_bondIndex[k]-1) + 1];
                    else this.data.atoms_bonds[k] = this.data.bonds[3*(-this.data.atoms_bondIndex[k]-1)];
                }else{
                    this.data.atoms_bondIndex[k] = 0;
                    this.data.atoms_bonds[k] = -1;
                }
            }
            // UPDATE ANGLE INDEXES
            for(var j=0; j<8; j++){
                if(particleSystem.atomsAngles[i*8 + j] !== -1) this.data.atoms_angleIndex[8*(this.natoms + i) + j] = particleSystem.atomsAngles[i*8 + j] + 3*this.nangles;
                else this.data.atoms_angleIndex[8*(this.natoms + i) + j] = -1;
            }
            // UPDATE TYPE LIST AND CODE
            if(isNaN(this.elements.types.code[particleSystem.atomsTypes[i]])){
                this.elements.types.list.push(particleSystem.atomsTypes[i]);
                if(this.forceField.elementRadius[particleSystem.atomsTypes[i]])
                    this.elements.types.radius.push(this.forceField.elementRadius[particleSystem.atomsTypes[i]]);
                else this.elements.types.radius.push(this.elements.atoms_radius[particleSystem.atomsTypes[i][0]]);

                this.elements.types.code[particleSystem.atomsTypes[i]] = this.elements.types.list.length - 1;
            }
            // UPDATE ATOM TYPE CODE
            this.data.atoms_typeCodes[this.natoms + i] = this.elements.types.code[particleSystem.atomsTypes[i]];
            this.data.atoms_radius[this.natoms + i] = this.elements.types.radius[this.elements.types.code[particleSystem.atomsTypes[i]]];
            //if(this.data.atoms_radius[this.natoms + i] < 1) this.data.atoms_radius[i + this.natoms] = 1;
        }
        // UPDATE TYPES
        this.data.atoms_types = this.data.atoms_types.concat(particleSystem.atomsTypes);
        // UPDATE RESIDUALS
        this.data.atoms_residuals = this.data.atoms_residuals.concat(particleSystem.atomsResidual);
        // UPDATE SEGNAMES
        this.data.atoms_segnames = this.data.atoms_segnames.concat(particleSystem.atomsSegnames);

        for(var i=0; i<particleSystem.nmolecules; i++){
            this.data.molecules_Offset.push({firstp: particleSystem.moleculesOffset[i].firstp + this.natoms,
                                             lastp: particleSystem.moleculesOffset[i].lastp + this.natoms});
        }

        // UPDATE TRACKERS
        this.nmols++;
        this.natoms += particleSystem.natoms;
        this.nbonds += particleSystem.nbonds;
        this.nangles += particleSystem.nangles;
        this.nresiduals += particleSystem.nresiduals;
        this.nmolecules += particleSystem.nmolecules;
        this.ntypes = this.elements.types.list.length;

        this.gpucomp.updateTextures();

        // UPDATE SELECTION
        this.select("clear");
        this.select("all");

        this.view.particles.innerHTML = " | Atoms: " + this.natoms;

        this.view.structureInfo.innerHTML = "<tr><td>Molecules</td><td>"+ this.nmolecules +"</td></tr>" +
                                            "<tr><td>Bonds</td><td>"+ this.nbonds +"</td></tr>" +
                                            "<tr><td>Angles</td><td>"+ this.nangles +"</td></tr>" +
                                            "<tr><td>Residuals</td><td>"+ this.nresiduals +"</td></tr>" +
                                            "<tr><td>Types</td><td>"+ this.ntypes +"</td></tr>";

        this.initializeGPUComp = false;

        this.view.isPaused = unpause;
    },

    /* SELECT: Filters all the particles in ther world according to the selection
     * parameters and add a graphical representation of them in the screen */
    select: function(selection, par, n){
        if(selection === "clear"){
            this.atoms.items = 0;
            this.bonds.items = 0;
            this.atoms.atoms = [];
            this.bonds.bonds = [];
            this.atoms.fastAdd(0, 0);
            this.bonds.fastAdd(0, 0);
        }else if(selection === "all"){
            if(this.drawAtoms)this.atoms.fastAdd(0, this.natoms);
            if(this.drawBonds)this.bonds.fastAdd(0, this.nbonds);
        }else if(selection === "atom" || selection === "selected"){
            if(this.drawAtoms)this.atoms.addIDs(par);
            if(this.drawBonds){
                var bonds = [];
                for(var i = 0; i<par.length; i++){
                    for(var j = 0; j<4; j++){
                        if(this.data.atoms_bondIndex[4*par[i] + j] !== 0){
                            bonds.push(Math.abs(this.data.atoms_bondIndex[4*par[i] + j])-1);
                        }
                    }
                }
                this.bonds.addIDs(bonds);
            }
        }else if(selection === "natoms"){
            if(this.drawAtoms)this.atoms.fastAdd(par, n);
            if(this.drawBonds){
                var bonds = [];
                for(var i = par; i<par+n; i++){
                    for(var j = 0; j<4; j++){
                        if(this.data.atoms_bondIndex[4*i + j] !== 0){
                            bonds.push(Math.abs(this.data.atoms_bondIndex[4*i + j])-1);
                        }
                    }
                }
                this.bonds.addIDs(bonds);
            }
        }else if(selection === "type"){
            var atoms = [];
            var count = 0;
            for(var i=0; i<this.natoms; i++){
                for(var j=0; j<par.length; j++){
                    if(this.data.atoms_types[i][0] === par[j][0]){
                        atoms.push(i);
                        count++;
                    }
                }
            }
            this.view.selectionView.innerHTML += " | " + count + " atoms | " + (count/this.natoms*100).toFixed(2) + "%";
            if(this.drawAtoms)this.atoms.addIDs(atoms);
            if(this.drawBonds){
                var bonds = [];
                for(var i = 0; i<atoms.length; i++){
                    for(var j = 0; j<4; j++){
                        if(this.data.atoms_bondIndex[4*atoms[i] + j] !== 0){
                            bonds.push(Math.abs(this.data.atoms_bondIndex[4*atoms[i] + j])-1);
                        }
                    }
                }
                this.bonds.addIDs(bonds);
            }
        }else if(selection === "residual"){
            var atoms = [];
            for(var i=0; i<this.natoms; i++){
                for(var j=0; j<par.length; j++) if(this.data.atoms_residuals[i] === par[j]) atoms.push(i);
            }
            if(this.drawAtoms)this.atoms.addIDs(atoms);
            if(this.drawBonds){
                var bonds = [];
                for(var i = 0; i<atoms.length; i++){
                    for(var j = 0; j<4; j++){
                        if(this.data.atoms_bondIndex[4*atoms[i] + j] !== 0){
                            bonds.push(Math.abs(this.data.atoms_bondIndex[4*atoms[i] + j])-1);
                        }
                    }
                }
                this.bonds.addIDs(bonds);
            }
        }
    },

    /* RECENTER: Recenter the camera and adjust the axis */
    recenter: function(){
        this.scene.camera = {x: this.scene.look.x, y: this.scene.look.y, z: this.scene.look.z  + this.size.x + this.size.y + this.size.z*2};
        this.scene.camera_rot = {x: this.scene.camera.x, y: this.scene.camera.y, z: this.scene.camera.z};
        this.scene.camera_rot = {x: this.scene.camera.x, y: this.scene.camera.y, z: this.scene.camera.z};
        this.scene.updateCamera();
    },

    /* CENTER: Sets where the camera is looking, the camera initial position and
     * the world size. All according to the particles initial position */
    center: function(){
        var xmean = 0;
        var ymean = 0;
        var zmean = 0;
        var xmax = 0;
        var ymax = 0;
        var zmax = 0;
        var x = 0;
        var y = 0;
        var z = 0;
        var mx = 0;
        var my = 0;
        var mz = 0;

        for(var i=0; i<this.natoms; i++){
            x = this.data.atoms_position[i*4];
            y = this.data.atoms_position[i*4 + 1];
            z = this.data.atoms_position[i*4 + 2];

            mx = Math.sign(x)*x;
            my = Math.sign(y)*y;
            mz = Math.sign(z)*z;

            if(mx > xmax) xmax = mx;
            if(my > ymax) ymax = my;
            if(mz > zmax) zmax = mz;

            xmean += x;
            ymean += y;
            zmean += z;
        }

        xmean /= this.natoms;
        ymean /= this.natoms;
        zmean /= this.natoms;

        if(isNaN(xmean)) xmean = 0;
        if(isNaN(ymean)) ymean = 0;
        if(isNaN(zmean)) zmean = 0;

        xmax -= Math.abs(xmean);
        ymax -= Math.abs(ymean);
        zmax -= Math.abs(zmean);

        xmax = (xmax + 1)*1.15;
        ymax = (ymax + 1)*1.15;
        zmax = (zmax + 1)*1.15;

        if(xmax < 2.5) xmax = 5;
        if(ymax < 2.5) ymax = 5;
        if(zmax < 2.5) zmax = 5;

        this.scene.camera = {x: xmean, y: ymean, z: zmean + xmax + ymax + 2*zmax};
        this.scene.look = {x: xmean, y: ymean, z: zmean};

        if(this.size0 === "auto") this.size = {x: xmax, y: ymax, z: zmax};
        else{
            var str = this.size0;
            var word = [];
            var arr = [];
            var n = 0;
            for(var i=0; i<=str.length && n<3; i++){
                if(str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
                else{
                    if(!isNaN(parseFloat(word))){
                        arr.push(parseFloat(word));
                        n++;
                    }
                    word = [];
                }
            }
            this.size.x = arr[0];
            this.size.y = arr[1];
            this.size.z = arr[2];
        }

        this.scene.far = parseInt(30*Math.sign(zmax)*zmax);
        this.scene.near = 1;
        this.scene.top = 2*Math.sign(ymax)*ymax;
        this.scene.right = 2*Math.sign(zmax)*xmax;
        this.scene.bottom = -this.scene.top;
        this.scene.left = -this.scene.right;

        if(this.scene.far < 1) this.scene.far = 1000;
        if(!this.scene.camera.z || this.scene.camera.z-this.scene.look.z < 1) this.scene.camera.z = 10;

        this.positiveLimit = {x: this.size.x + this.scene.look.x, y: this.size.y + this.scene.look.y, z: this.size.z + this.scene.look.z};
        this.negativeLimit = {x: -this.size.x + this.scene.look.x, y: -this.size.y + this.scene.look.y, z: -this.size.z + this.scene.look.z};

        this.scene.camera_rot = {x: this.scene.camera.x, y: this.scene.camera.y, z: this.scene.camera.z};
        this.scene.updateCamera();
        this.scene.updateProjection();

        if(this.drawGrids) this.addLines();
    },

    /* ADDLINES: Add the box and axis lines to the graphics vizualization */
    addLines: function(){

        var linepos = [];
        this.lines = [];

        if(this.drawGrids){
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y + this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y + this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y + this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y - this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y + this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y + this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y - this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y - this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y + this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y - this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y + this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y + this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y - this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y - this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y - this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y - this.size.y, this.scene.look.z + this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y + this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y + this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y - this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y - this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y - this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x + this.size.x, this.scene.look.y + this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y - this.size.y, this.scene.look.z - this.size.z, 1);
            linepos.push(this.scene.look.x - this.size.x, this.scene.look.y + this.size.y, this.scene.look.z - this.size.z, 1);
        }

        linepos.push(this.scene.look.x + this.axisLength, this.scene.look.y, this.scene.look.z , 1);
        linepos.push(this.scene.look.x - this.axisLength, this.scene.look.y, this.scene.look.z , 1);
        linepos.push(this.scene.look.x, this.scene.look.y + this.axisLength, this.scene.look.z , 1);
        linepos.push(this.scene.look.x, this.scene.look.y - this.axisLength, this.scene.look.z , 1);
        linepos.push(this.scene.look.x, this.scene.look.y , this.scene.look.z + this.axisLength, 1);
        linepos.push(this.scene.look.x, this.scene.look.y , this.scene.look.z - this.axisLength, 1);

        this.lines = new lines(this.scene, linepos, this.lineshader, this.gridcolor, this.gridwidth);
    },

    /* SETTEMPERATURE: Set the temperature to the world temperature propertie by
     * adding movement to the particles. It is not a thermostat */
    setTemperature: function(){
        var stdev = 0;
        for(var i=0; i<this.natoms; i++){
            stdev = Math.sqrt(this.constants.kTemp*this.temperature0/this.data.atoms_mass[i]);
            this.data.temperatureVelocity[3*i] = gaussianRandom(0, stdev);
            this.data.temperatureVelocity[3*i + 1] = gaussianRandom(0, stdev);
            this.data.temperatureVelocity[3*i + 2] = gaussianRandom(0, stdev);
        }
        updateTexture3d(this.gl, this.texsize, this.gpucomp.temperatureVelocity, this.data.temperatureVelocity);
        this.gpucomp.setTemperature();
    }
};

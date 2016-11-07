// ----------------------------- CREATE A VIEW TO -------------------------------------
var view = function(world) {

    this.mouse = null;
    this.keys = {
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40,
        SPACE: 32,
        A: 65,
        S: 83,
        D: 68,
        W: 87,
        PAGEUP: 33,
        PAGEDOWN: 34,
        CTRL: 17,
        SHIFT: 16,
        ENTER: 13
    };
    this.isFull = false;
    this.isPaused = false;
    this.isHomeMenuFix = false;
    this.isWorldMenuFix = false;
    this.isSettingsFix = false;
    this.isAddEnabled = false;
    this.renderIntervalID = null;
    this.updateInfoIntervalID = null;
    this.rescaleSize0 = 50;

    var hovercolor = "#ff5500";
    var normalcolor = "#42157c";
    var self = this;
    var bodystyle = window.getComputedStyle(document.body);
    this.windowSize = {
        x: parseFloat(bodystyle.width),
        y: parseFloat(bodystyle.height)
    };

    // ----------------------------- VIEW ELEMENTS -------------------------------
    this.selectionMode = document.getElementById("selectionMode");
    this.selectionPar1 = document.getElementById("selectionPar1");
    this.selectionPar2 = document.getElementById("selectionPar2");
    this.selectionView = document.getElementById("selectionView");
    this.canvas = document.getElementById("screen");
    this.logo = document.getElementById("logo");
    this.pause = document.getElementById("pause");
    this.restart = document.getElementById("restart");
    this.recenter = document.getElementById("recenter");
    this.home = document.getElementById("home");
    this.worldIcon = document.getElementById("worldIcon");
    this.analysis = document.getElementById("analysis");
    this.settings = document.getElementById("settings");
    this.add = document.getElementById("add");
    this.mouseMode = document.getElementById("mouseMode");
    this.snapshot = document.getElementById("snapshot");
    this.goFull = document.getElementById("goFull");
    this.info = document.getElementById("info");
    this.homeMenu = document.getElementById("homeMenu");
    this.worldMenu = document.getElementById("worldMenu");
    this.analysisMenu = document.getElementById("analysisMenu");
    this.settingsMenu = document.getElementById("settingsMenu");
    this.addMenu = document.getElementById("addMenu");
    this.infoMenu = document.getElementById("infoMenu");
    this.side = document.getElementById("side");
    this.menu = document.getElementById("menu");
    this.header = document.getElementById("header");
    this.container = document.getElementById("container");
    this.pinHomeMenu = document.getElementById("pinHomeMenu");
    this.pinWorldMenu = document.getElementById("pinWorldMenu");
    this.pinAnalysisMenu = document.getElementById("pinAnalysisMenu");
    this.pinSettingsMenu = document.getElementById("pinSettingsMenu");
    this.pinAddMenu = document.getElementById("pinAddMenu");
    this.time = document.getElementById("time");
    this.particles = document.getElementById("particles");
    this.particlesInfo = document.getElementById("particlesInfo");
    this.structureInfo = document.getElementById("structureInfo");
    this.energyInfo = document.getElementById("energyInfo");
    this.activeWalls = document.getElementById("activeWalls");
    this.activeEdges = document.getElementById("activeEdges");
    this.loading = document.getElementById("loading");
    this.loadingIcon = document.getElementById("loadingIcon");
    this.temperature = document.getElementById("temperature");
    this.rescaleSize = document.getElementById("rescaleSize");
    this.size = document.getElementById("size");
    this.loadingMessage = document.getElementById("loadingMessage");
    this.drawingMode = document.getElementById("drawingMode");
    this.colorMode = document.getElementById("colorMode");
    this.atomRadius = document.getElementById("atomRadius");
    this.bondRadius = document.getElementById("bondRadius");
    this.atomResolution = document.getElementById("atomResolution");
    this.bondResolution = document.getElementById("bondResolution");
    this.downloader = document.getElementById("downloader");
    this.backgroundColor = document.getElementById("backgroundColor");
    this.customColor = document.getElementById("customColor");
    this.gridColor = document.getElementById("gridColor");
    this.typeColor = document.getElementById("typeColor");
    this.typeSelection = document.getElementById("typeSelection");
    this.residueColor = document.getElementById("residueColor");
    this.residueSelection = document.getElementById("residueSelection");
    this.activeGrids = document.getElementById("activeGrids");
    this.farClip = document.getElementById("farClip");
    this.nearClip = document.getElementById("nearClip");
    this.projectionMode = document.getElementById("projectionMode");
    this.lightMode = document.getElementById("lightMode");
    this.perspectiveAngle = document.getElementById("perspectiveAngle");
    this.lightMode = document.getElementById("lightMode");
    this.lightPosition = document.getElementById("lightPosition");
    this.ambientColor = document.getElementById("ambientColor");
    this.diffuseColor = document.getElementById("diffuseColor");
    this.specularColor = document.getElementById("specularColor");
    this.shininess = document.getElementById("shininess");
    this.energyTemp = document.getElementById("energyTemp");
    this.status = document.getElementById("status");
    this.temperatureSlider = document.getElementById("temperatureSlider");
    this.temperatureLabel = document.getElementById("temperatureLabel");
    this.activeThermostat = document.getElementById("activeThermostat");
    this.radiusScale = document.getElementById("radiusScale");
    this.timeStep = document.getElementById("timeStep");
    this.energyFrequency = document.getElementById("energyFrequency");
    this.thermostatFrequency = document.getElementById("thermostatFrequency");
    this.renderFrequency = document.getElementById("renderFrequency");
    this.sampleMode = document.getElementById("sampleMode");
    this.sampleFrequency = document.getElementById("sampleFrequency");
    this.activeSampling = document.getElementById("activeSampling");
    this.duration = document.getElementById("duration");
    this.clearSelection = document.getElementById("clearSelection");
    this.outputName = document.getElementById("outputName");
    this.particlesToAdd = document.getElementById("particlesToAdd");
    this.hideOnAdd = document.getElementsByClassName("hideOnAdd");
    this.addWater = document.getElementById("addWater");
    this.addMethane = document.getElementById("addMethane");
    this.addSodium = document.getElementById("addSodium");
    this.addChloride = document.getElementById("addChloride");
    this.addDinitrogen = document.getElementById("addDinitrogen");
    this.addDioxygen = document.getElementById("addDioxygen");
    this.addCarbon_dioxide = document.getElementById("addCarbon_dioxide");
    this.addOctane = document.getElementById("addOctane");
    this.addLipid = document.getElementById("addLipid");
    this.boostFactor = document.getElementById("boostFactor");

    if (document.getElementById("saveModel")) {
        this.saveModel = document.getElementById("saveModel");
        this.uploadModel = document.getElementById("uploadModel");
        this.uploader = document.getElementById("uploader");
        this.uploadModel.onclick = function() {
            self.uploader.click()
        };
        this.saveModel.onclick = world.saveModel;
        this.uploader.onchange = world.uploadModel;
    }

    // ---------------------- MOUSE AND TOUCH HANDLERS ---------------------------
    this.mouse = new mouse(world);
    this.analysisMenu.onmousedown = world.scene.canvas.onmousedown;
    this.analysisMenu.onmousemove = world.scene.canvas.onmousemove;
    this.analysisMenu.onmouseup = world.scene.canvas.onmouseup;
    this.analysisMenu.onwheel = world.scene.canvas.onwheel;
    this.analysisMenu.ontouchstart = world.scene.canvas.ontouchstart;
    this.analysisMenu.ontouchend = world.scene.canvas.ontouchend;
    this.analysisMenu.ontouchmove = world.scene.canvas.ontouchmove;

    window.onresize = function() {
            self.resize();
        }
        // ------------------------- KEYBOARD HANDLERS -------------------------------
    window.onkeydown = function(e) {
        if (e.keyCode === 108 || e.keyCode === 76) {
            //getFrameData4d(world.gl, {x: 4*world.texsize.x, y: world.texsize.y}, world.gpucomp.FBangleForces, world.data.angleForces);
            getFrameData4d(world.gl, world.texsize, world.gpucomp.FBnbforces, world.data.nonbondedForces);
            //getFrameData4d(world.gl, {x: 3*world.texsize.x, y: world.texsize.y}, world.gpucomp.FBangleEnergy, world.data.angleEnergy);
            //getFrameData4d(world.gl, world.texsize, world.gpucomp.FBposition, world.data.atoms_position);
            console.log(world.data.nonbondedForces);
        } else if (e.keyCode === 114) {
            self.restart.click();
        } else if (e.keyCode === 112 || e.keyCode === 80) {
            self.pause.click();
        } else if (e.keyCode === 68 || e.keyCode === 100) {
            world.renderComputation = !world.renderComputation;
        } else if (e.keyCode === 69 || e.keyCode === 101) {
            world.gpucomp.calc_energy();
        } else if (e.keyCode === 109 || e.keyCode === 77) {
            if (self.mouse.mode === "select") self.mouse.mode = "move";
            else self.mouse.mode = "select";
        } else if (e.keyCode === 116 || e.keyCode === 84) {
            world.temperature = parseFloat(window.prompt("Temperature", "defaultText"));
            world.setTemperature();
        }
    }

    // ------------------------- ON CHANGE HANDLERS ------------------------------
    this.selectionPar1.onkeypress = function(e) {
        if (e.keyCode === self.keys.ENTER) {

            if (self.selectionPar1.value) {

                if (self.selectionMode.value === "atoms") {
                    var str = self.selectionPar1.value;
                    var word = [];
                    var atoms = [];
                    for (var i = 0; i <= str.length; i++) {
                        if (!isNaN(parseInt(str[i]))) word += str[i];
                        else {
                            if (!isNaN(parseInt(word))) atoms.push(parseInt(word) - 1);
                            word = [];
                        }
                    }
                    self.selectionView.innerHTML += "<br>Atoms " + self.selectionPar1.value;
                    world.select("atom", atoms);
                }

                if (self.selectionMode.value === "type") {
                    var str = self.selectionPar1.value;
                    var word = [];
                    var types = [];
                    for (var i = 0; i <= str.length; i++) {
                        if (str[i] !== "," && str[i] !== " " && str[i]) word += str[i];
                        else {
                            if (isNaN(word)) types.push(word);
                            word = [];
                        }
                    }
                    self.selectionView.innerHTML += "<br>Types " + self.selectionPar1.value;
                    world.select("type", types);
                }

                if (self.selectionMode.value === "residual") {
                    var str = self.selectionPar1.value;
                    var word = [];
                    var residuals = [];
                    for (var i = 0; i <= str.length; i++) {
                        if (str[i] !== "," && str[i] !== " " && str[i]) word += str[i];
                        else {
                            if (isNaN(word)) residuals.push(word);
                            word = [];
                        }
                    }
                    self.selectionView.innerHTML += "<br>Residuals " + self.selectionPar1.value;
                    world.select("residual", residuals);
                }

                if (self.selectionMode.value === "natoms") {
                    world.select("natoms", parseInt(self.selectionPar1.value) - 1, parseInt(self.selectionPar2.value) - parseInt(self.selectionPar1.value) + 1);
                    self.selectionView.innerHTML += "<br>Atoms " + self.selectionPar1.value + " - " + self.selectionPar2.value;
                }
            }
        }
    }
    this.selectionPar2.onkeypress = function(e) {
        if (e.keyCode === self.keys.ENTER) {
            if (self.selectionMode.value === "natoms")
                world.select("natoms", parseInt(self.selectionPar1.value) - 1, parseInt(self.selectionPar2.value) - parseInt(self.selectionPar1.value) + 1);
        }
    }
    this.selectionMode.onchange = function(e) {
        self.selectionPar1.disabled = true;
        self.selectionPar2.style.display = "none";
        if (self.selectionMode.value === "atoms" || self.selectionMode.value === "type" || self.selectionMode.value === "residual") {
            self.selectionPar1.disabled = false;
            self.selectionPar1.type = "text";
        }
        if (self.selectionMode.value === "natoms") {
            self.selectionPar1.disabled = false;
            self.selectionPar2.style.display = "inline-block";
            self.selectionPar1.type = "number";
            self.selectionPar2.type = "number";
        }
        if (self.selectionMode.value === "clear") {
            world.select("clear");
            self.selectionView.innerHTML = " ";
        }
        if (self.selectionMode.value === "all") {
            world.select("all");
            self.selectionView.innerHTML += "<br>All";
        }
        if (self.selectionMode.value === "selected") {
            world.select("selected", world.selected);
            self.selectionView.innerHTML += "<br>Mouse Selected";
        }

    }
    this.colorMode.onchange = function(e) {
        world.colorMode = self.colorMode.value;
        world.atoms.paint(world.atoms.atoms);
        world.bonds.paint(world.bonds.bonds)
    }
    this.drawingMode.onchange = function(e) {
        if (self.drawingMode.value == "bonds") {
            world.drawBonds = true;
            world.drawAtoms = false;
            self.bondRadius.value = 0.2;
            self.bondRadius.onchange();
        } else if (self.drawingMode.value == "vdw") {
            world.drawBonds = false;
            world.drawAtoms = true;
            world.atoms.minradius = 0.4;
            world.atoms.radiusScale = 1.0;
        } else if (self.drawingMode.value == "bas") {
            world.drawBonds = true;
            world.drawAtoms = true;
            world.atoms.radiusScale = 0.2;
            world.atoms.minradius = 0.25;
            self.bondRadius.value = 0.125;
            self.bondRadius.onchange();
        } else if (self.drawingMode.value == "licorice") {
            world.drawBonds = true;
            world.drawAtoms = true;
            world.atoms.radiusScale = 0.0;
            world.atoms.minradius = 0.2;
            self.bondRadius.value = 0.2;
            self.bondRadius.onchange();
            self.bondResolution.value = 28;
            self.atomResolution.value = 28;
            self.bondResolution.onchange();
            self.atomResolution.onchange();
        }
    }
    this.bondRadius.onchange = function(e) {
        if (!isNaN(parseFloat(self.bondRadius.value))) world.bonds.radius = self.bondRadius.value;
    }
    this.atomResolution.onchange = function(e) {
        if (parseInt(self.atomResolution.value) > 28) {
            world.atoms.sphereLatitude = 28;
            world.atoms.sphereLongitude = 28;
        } else if (parseInt(self.atomResolution.value) == 23 ||
            parseInt(self.atomResolution.value) == 25 ||
            parseInt(self.atomResolution.value) == 27) {
            world.atoms.sphereLatitude = parseInt(self.atomResolution.value) + 1;
            world.atoms.sphereLongitude = parseInt(self.atomResolution.value) + 1;
        } else {
            world.atoms.sphereLatitude = parseInt(self.atomResolution.value);
            world.atoms.sphereLongitude = parseInt(self.atomResolution.value);
        }


        world.atoms.updateResolution();
    }
    this.bondResolution.onchange = function(e) {
        world.bonds.precision = parseInt(self.bondResolution.value);
        world.bonds.updateResolution();
    }
    this.backgroundColor.onchange = function(e) {
        var str = self.backgroundColor.value;
        if (str[0] !== "#") {
            var word = [];
            var ncolor = 0;
            for (var i = 0; i <= str.length; i++) {
                if (str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
                else {
                    if (!isNaN(parseFloat(word))) {
                        world.scene.backgroundColor[ncolor] = parseFloat(word) / 255;
                        ncolor++;
                    }
                    word = [];
                }
            }
        } else {
            world.scene.backgroundColor[0] = parseInt(str[1].concat(str[2]), 16) / 255;
            world.scene.backgroundColor[1] = parseInt(str[3].concat(str[4]), 16) / 255;
            world.scene.backgroundColor[2] = parseInt(str[5].concat(str[6]), 16) / 255;
        }
    }
    this.typeColor.onchange = function(e) {
        var str = self.typeColor.value;
        if (str[0] !== "#") {
            var word = [];
            var ncolor = 0;
            for (var i = 0; i <= str.length; i++) {
                if (str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
                else {
                    if (!isNaN(parseFloat(word))) {
                        world.elements.atom_colors[self.typeSelection.value][ncolor] = parseFloat(word) / 255;
                        ncolor++;
                    }
                    word = [];
                }
            }
        } else {
            world.elements.atom_colors[self.typeSelection.value][0] = parseInt(str[1].concat(str[2]), 16) / 255;
            world.elements.atom_colors[self.typeSelection.value][1] = parseInt(str[3].concat(str[4]), 16) / 255;
            world.elements.atom_colors[self.typeSelection.value][2] = parseInt(str[5].concat(str[6]), 16) / 255;
        }
        world.atoms.paint(world.atoms.atoms);
        world.bonds.paint(world.bonds.bonds)
    }
    this.residueColor.onchange = function(e) {
        var str = self.residueColor.value;
        if (str[0] !== "#") {
            var word = [];
            var ncolor = 0;
            for (var i = 0; i <= str.length; i++) {
                if (str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
                else {
                    if (!isNaN(parseFloat(word))) {
                        world.elements.residual_colors[self.residueSelection.value][ncolor] = parseFloat(word) / 255;
                        ncolor++;
                    }
                    word = [];
                }
            }
        } else {
            world.elements.residual_colors[self.residueSelection.value][0] = parseInt(str[1].concat(str[2]), 16) / 255;
            world.elements.residual_colors[self.residueSelection.value][1] = parseInt(str[3].concat(str[4]), 16) / 255;
            world.elements.residual_colors[self.residueSelection.value][2] = parseInt(str[5].concat(str[6]), 16) / 255;
        }
        self.colorMode.onchange();
    }
    this.customColor.onchange = function(e) {
        var str = self.customColor.value;
        if (str[0] !== "#") {
            var word = [];
            var ncolor = 0;
            for (var i = 0; i <= str.length; i++) {
                if (str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
                else {
                    if (!isNaN(parseFloat(word))) {
                        world.elements.single_color[ncolor] = parseFloat(word) / 255;
                        ncolor++;
                    }
                    word = [];
                }
            }
        } else {
            world.elements.single_color[0] = parseInt(str[1].concat(str[2]), 16) / 255;
            world.elements.single_color[1] = parseInt(str[3].concat(str[4]), 16) / 255;
            world.elements.single_color[2] = parseInt(str[5].concat(str[6]), 16) / 255;
        }
        self.colorMode.onchange();
    }
    this.gridColor.onchange = function(e) {
        var str = self.customColor.value;
        if (str[0] !== "#") {
            var word = [];
            var ncolor = 0;
            for (var i = 0; i <= str.length; i++) {
                if (str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
                else {
                    if (!isNaN(parseFloat(word))) {
                        world.gridcolor[ncolor] = parseFloat(word) / 255;
                        ncolor++;
                    }
                    word = [];
                }
            }
        } else {
            world.gridcolor[0] = parseInt(str[1].concat(str[2]), 16) / 255;
            world.gridcolor[1] = parseInt(str[3].concat(str[4]), 16) / 255;
            world.gridcolor[2] = parseInt(str[5].concat(str[6]), 16) / 255;
        }
    }
    this.nearClip.onchange = function(e) {
        world.scene.near = parseFloat(self.nearClip.value);
        world.scene.updateProjection();
    }
    this.farClip.onchange = function(e) {
        world.scene.far = parseFloat(self.farClip.value);
        world.scene.updateProjection();
    }
    this.projectionMode.onchange = function(e) {
        world.scene.projectionMode = parseInt(self.projectionMode.value);
        world.scene.updateProjection();
        world.recenter();
    }
    this.perspectiveAngle.onchange = function(e) {
        world.scene.fov = parseFloat(self.perspectiveAngle.value);
        world.scene.updateProjection();
    }
    this.lightMode.onchange = function(e) {
        world.scene.lightmode = parseInt(self.lightMode.value);
    }
    this.ambientColor.onchange = function(e) {
        world.atoms.ambientColor[0] = parseInt(self.ambientColor.value) / 255;
        world.atoms.ambientColor[1] = parseInt(self.ambientColor.value) / 255;
        world.atoms.ambientColor[2] = parseInt(self.ambientColor.value) / 255;
        world.bonds.ambientColor[0] = world.atoms.ambientColor[0];
        world.bonds.ambientColor[1] = world.atoms.ambientColor[1];
        world.bonds.ambientColor[2] = world.atoms.ambientColor[2];
    }
    this.diffuseColor.onchange = function(e) {
        world.atoms.diffuseColor[0] = parseInt(self.diffuseColor.value) / 255;
        world.atoms.diffuseColor[1] = parseInt(self.diffuseColor.value) / 255;
        world.atoms.diffuseColor[2] = parseInt(self.diffuseColor.value) / 255;
        world.bonds.diffuseColor[0] = world.atoms.diffuseColor[0];
        world.bonds.diffuseColor[1] = world.atoms.diffuseColor[1];
        world.bonds.diffuseColor[2] = world.atoms.diffuseColor[2];
    }
    this.specularColor.onchange = function(e) {
        world.atoms.specularColor[0] = parseInt(self.specularColor.value) / 255;
        world.atoms.specularColor[1] = parseInt(self.specularColor.value) / 255;
        world.atoms.specularColor[2] = parseInt(self.specularColor.value) / 255;
        world.bonds.specularColor[0] = world.atoms.specularColor[0];
        world.bonds.specularColor[1] = world.atoms.specularColor[1];
        world.bonds.specularColor[2] = world.atoms.specularColor[2];
    }
    this.shininess.onchange = function(e) {
        world.atoms.shininess = parseFloat(self.shininess.value);
        world.bonds.shininess = parseFloat(self.shininess.value);
    }
    this.temperature.onchange = function(e) {
        world.temperature0 = parseFloat(self.temperature.value);
        self.temperatureSlider.value = world.temperature0;
        self.temperatureLabel.innerHTML = world.temperature0;
        world.setTemperature();
    }
    this.rescaleSize.oninput = function(e) {
        if (parseFloat(self.rescaleSize.value) - self.rescaleSize0 > 0) {
            world.size.x *= 1.1;
            world.size.y *= 1.1;
            world.size.z *= 1.1;
        } else {
            world.size.x *= 0.9;
            world.size.y *= 0.9;
            world.size.z *= 0.9;
        }
        self.rescaleSize0 = parseFloat(self.rescaleSize.value)
        world.positiveLimit = {
            x: world.size.x + world.scene.look.x,
            y: world.size.y + world.scene.look.y,
            z: world.size.z + world.scene.look.z
        };
        world.negativeLimit = {
            x: -world.size.x + world.scene.look.x,
            y: -world.size.y + world.scene.look.y,
            z: -world.size.z + world.scene.look.z
        };
        self.size.value = world.size.x.toFixed(0) + " " + world.size.y.toFixed(0) + " " + world.size.z.toFixed(0);
        if (world.drawGrids) world.addLines();
    }
    this.temperatureSlider.oninput = function(e) {
        world.temperature0 = parseFloat(self.temperatureSlider.value);
        self.temperatureLabel.innerHTML = world.temperature0;
        self.temperature.value = world.temperature0;
        world.setTemperature();
    }
    this.size.onchange = function(e) {
        var str = self.size.value;
        var word = [];
        var arr = [];
        var n = 0;
        for (var i = 0; i <= str.length && n < 3; i++) {
            if (str[i] !== " " && str[i] !== "," && str[i]) word += str[i];
            else {
                if (!isNaN(parseFloat(word))) {
                    arr.push(parseFloat(word));
                    n++;
                }
                word = [];
            }
        }

        world.size.x = arr[0];
        world.size.y = arr[1];
        world.size.z = arr[2];
        world.positiveLimit = {
            x: world.size.x + world.scene.look.x,
            y: world.size.y + world.scene.look.y,
            z: world.size.z + world.scene.look.z
        };
        world.negativeLimit = {
            x: -world.size.x + world.scene.look.x,
            y: -world.size.y + world.scene.look.y,
            z: -world.size.z + world.scene.look.z
        };
        if (world.drawGrids) world.addLines();
    }
    this.radiusScale.onchange = function(e) {
        world.atoms.radiusScale = parseFloat(self.radiusScale.value);
    }
    this.timeStep.onchange = function(e) {
        world.constants.timeStep = parseFloat(self.timeStep.value)
        world.constants.dt = world.constants.timeStep / world.constants.timeFactor;
        world.constants.dt2 = world.constants.dt * world.constants.dt;
        world.constants.maxVelocity = 0.2 / world.constants.dt;
    }
    this.energyFrequency.onchange = function(e) {
        world.energyTempCount = 0;
        world.energyTempFrequency = parseFloat(self.energyFrequency.value);
    }
    this.renderFrequency.onchange = function(e) {
        world.renderCount = 0;
        world.renderFrequency = parseFloat(self.renderFrequency.value);
    }
    this.thermostatFrequency.onchange = function(e) {
        world.thermostatCount = 0;
        world.thermostatFrequency = parseFloat(self.thermostatFrequency.value);
    }
    this.sampleMode.onchange = function(e) {
        world.sampleMode = self.sampleMode.value;
    }
    this.duration.onchange = function(e) {
        world.maxSteps = parseFloat(self.duration.value) * 1000 / world.constants.timeStep;
    }
    this.sampleFrequency.onchange = function(e) {
        world.sampleFrequency = parseFloat(self.sampleFrequency.value);
    }
    this.boostFactor.onchange = function(e) {
            world.renderFrequency /= world.constants.boostFactor;
            world.resetBoostFactorTimer = window.setInterval(world.resetBoostFactor, 30);
        }
        // --------------------------- CLICK HANDLERS --------------------------------
    this.pause.onclick = function() {
        if (self.isPaused === false) {
            self.isPaused = true;
            self.pause.innerHTML = "play_arrow";
        } else if (world.natoms > 0) {
            self.isPaused = false;
            self.pause.innerHTML = "pause";
        }
    }
    this.restart.onclick = function() {
        world.reset();
    }
    this.recenter.onclick = function() {
        world.recenter();
    };
    this.pinHomeMenu.onclick = function() {
        if (!self.isAddMenuFix && !self.isWorldMenuFix && !self.isSettingsFix) {
            self.isHomeMenuFix = !self.isHomeMenuFix;
            if (self.isHomeMenuFix) {
                self.homeMenu.style.display = "inline-block";
                self.pinHomeMenu.innerHTML = "close";
                self.homeMenu.style.backgroundColor = "#222222";
                self.homeMenu.style.borderLeft = "4px solid #42157c";
                self.homeMenu.style.zIndex = "1";
            } else {
                self.pinHomeMenu.innerHTML = "chevron_right";
                self.homeMenu.style.backgroundColor = "rgba(30,30,30,0.97)"
                self.homeMenu.style.display = "none";
                self.homeMenu.style.borderLeft = "none";
                self.homeMenu.style.zIndex = "2";
            }
            self.resize();
        } else alert("There is already one tab fixed.");
    }
    this.pinWorldMenu.onclick = function() {
        if (!self.isHomeMenuFix && !self.isAddMenuFix && !self.isSettingsFix) {
            self.isWorldMenuFix = !self.isWorldMenuFix;
            if (self.isWorldMenuFix) {
                self.worldMenu.style.display = "inline-block";
                self.pinWorldMenu.innerHTML = "close";
                self.worldMenu.style.backgroundColor = "#222222";
                self.worldMenu.style.borderLeft = "4px solid #42157c";
                self.worldMenu.style.zIndex = "1";
            } else {
                self.pinWorldMenu.innerHTML = "chevron_right";
                self.worldMenu.style.backgroundColor = "rgba(30,30,30,0.97)"
                self.worldMenu.style.display = "none";
                self.worldMenu.style.borderLeft = "none";
                self.worldMenu.style.zIndex = "2";
            }
            self.resize();
        } else alert("There is already one tab fixed.");
    }
    this.pinSettingsMenu.onclick = function() {
        if (!self.isHomeMenuFix && !self.isWorldMenuFix && !self.isAddMenuFix) {
            self.isSettingsFix = !self.isSettingsFix;
            if (self.isSettingsFix) {
                self.pinSettingsMenu.innerHTML = "close";
                self.settingsMenu.style.backgroundColor = "#222222";
                self.settingsMenu.style.borderLeft = "4px solid #42157c";
                self.settingsMenu.style.zIndex = "1";
            } else {
                self.pinSettingsMenu.innerHTML = "chevron_right";
                self.settingsMenu.style.backgroundColor = "rgba(30,30,30,0.97)"
                self.settingsMenu.style.display = "none";
                self.settingsMenu.style.borderLeft = "none";
                self.settingsMenu.style.zIndex = "2";
            }
            self.resize();
        } else alert("There is already one tab fixed.");
    }
    this.pinAnalysisMenu.onclick = function() {
        self.isSimuInfoFix = !self.isSimuInfoFix;
        if (self.isSimuInfoFix) {
            self.pinAnalysisMenu.innerHTML = "close";
            self.analysisMenu.style.backgroundColor = "transparent";
        } else {
            self.pinAnalysisMenu.innerHTML = "chevron_right";
            self.analysisMenu.style.backgroundColor = "rgba(30,30,30,0.4)";
            self.analysisMenu.style.display = "none";
        }
    }
    this.pinAddMenu.onclick = function() {
        if (!self.isHomeMenuFix && !self.isWorldMenuFix && !self.isSettingsFix) {
            self.isAddMenuFix = !self.isAddMenuFix;
            if (self.isAddMenuFix) {
                self.addMenu.style.display = "inline-block";
                self.pinAddMenu.innerHTML = "close";
                self.addMenu.style.backgroundColor = "#222222";
                self.addMenu.style.borderLeft = "4px solid #42157c";
                self.addMenu.style.zIndex = "1";
            } else {
                self.pinAddMenu.innerHTML = "chevron_right";
                self.addMenu.style.backgroundColor = "rgba(30,30,30,0.97)"
                self.addMenu.style.display = "none";
                self.addMenu.style.borderLeft = "none";
                self.addMenu.style.zIndex = "2";
            }
            self.resize();
        } else alert("There is already one tab fixed.");
    }
    this.snapshot.onclick = function() {
        world.draw();
        self.downloader.href = self.canvas.toDataURL("image/png", 1.0);
        self.downloader.download = "protein.png";
        self.downloader.click();

    }
    this.activeGrids.onclick = function() {
        if (!world.lines.draw) {
            world.drawGrids = true;
            world.addLines();
            self.activeGrids.innerHTML = "<i class='material-icons'>check</i>";
        } else {
            world.lines = [];
            world.drawGrids = false;
            self.activeGrids.innerHTML = "";
        }
    }
    this.mouseMode.onclick = function() {
        if (self.mouse.mode === "select") {
            self.mouse.mode = "move";
            self.mouseMode.innerHTML = "touch_app";
            self.mouseMode.style.margin = "0 0";
            self.mouseMode.style.fontSize = "40px";
            self.canvas.style.cursor = "grab";
            self.analysisMenu.style.cursor = "grab";
        } else {
            self.mouse.mode = "select";
            self.mouseMode.innerHTML = "pan_tool";
            self.mouseMode.style.margin = "2.5px 0";
            self.mouseMode.style.fontSize = "35px";
            self.canvas.style.cursor = "default";
            self.analysisMenu.style.cursor = "default";
        }
    }
    this.goFull.onclick = function() {
        var element = document.getElementById("container");
        if (self.isFull === false) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }

        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
    this.activeThermostat.onclick = function() {
        if (!world.exec_thermostat) {
            world.thermostatCount = 0;
            world.exec_thermostat = true;
            self.activeThermostat.innerHTML = "<i class='material-icons'>check</i>";
        } else {
            world.exec_thermostat = false;
            self.activeThermostat.innerHTML = "";
        }
    }
    this.activeSampling.onclick = function() {
        if (!world.sample) {
            world.sampleCount = 0;
            world.sample = true;
            self.activeSampling.innerHTML = "<i class='material-icons'>check</i>";
        } else {
            world.sample = false;
            self.activeSampling.innerHTML = "";
        }
    }
    this.clearSelection.onclick = function() {
        for (var i = 0; i < world.selected.length; i++) {
            document.getElementById("pInfo" + world.selected[i]).remove();
            world.atoms.paint([world.selected[i]]);
        }
        world.selected = [];
    }
    this.addWater.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.water, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addMethane.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.methane, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addSodium.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.sodium, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addChloride.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.chloride, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addDinitrogen.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.dinitrogen, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addDioxygen.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.dioxygen, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addCarbon_dioxide.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.carbon_dioxide, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addOctane.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.octane, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }
    this.addLipid.onclick = function() {
        for (var i = 0; i < parseInt(particlesToAdd.value); i++)
            world.addMols(world.molecules.lipid, getPositionOutOfTheBox(world.size, world.positiveLimit, world.negativeLimit));
    }

    // ---------------------- MOUSE OVER AND OUT HANDLERS ------------------------
    this.side.onmouseover = function() {
        self.worldIcon.style.color = normalcolor;
        self.analysis.style.color = normalcolor;
        self.settings.style.color = normalcolor;
        self.home.style.color = normalcolor;
        self.add.style.color = normalcolor;
        self.info.style.color = normalcolor;
        if (!self.isHomeMenuFix) self.homeMenu.style.display = "none";
        if (!self.isWorldMenuFix) self.worldMenu.style.display = "none";
        if (!self.isSimuInfoFix) self.analysisMenu.style.display = "none";
        if (!self.isSettingsFix) self.settingsMenu.style.display = "none";
        if (!self.isAddMenuFix) self.addMenu.style.display = "none";
        self.infoMenu.style.display = "none";
    }
    this.canvas.onmouseover = function() {
        self.worldIcon.style.color = normalcolor;
        self.analysis.style.color = normalcolor;
        self.settings.style.color = normalcolor;
        self.home.style.color = normalcolor;
        self.add.style.color = normalcolor;
        self.info.style.color = normalcolor;
        if (!self.isHomeMenuFix) self.homeMenu.style.display = "none";
        if (!self.isWorldMenuFix) self.worldMenu.style.display = "none";
        if (!self.isSettingsFix) self.settingsMenu.style.display = "none";
        self.infoMenu.style.display = "none";
    }
    this.analysisMenu.onmouseover = this.canvas.onmouseover;
    this.pause.onmouseover = function() {
        self.side.onmouseover();
        if (self.isPaused) self.pause.style.color = hovercolor;
        else self.pause.style.color = hovercolor;
    }
    this.pause.onmouseout = function() {
        self.pause.style.color = normalcolor;
    }
    this.restart.onmouseover = function() {
        self.side.onmouseover();
        self.restart.style.color = hovercolor;
    }
    this.restart.onmouseout = function() {
        self.restart.style.color = normalcolor;
    }
    this.recenter.onmouseover = function() {
        self.side.onmouseover();
        self.recenter.style.color = hovercolor;
    }
    this.recenter.onmouseout = function() {
        self.recenter.style.color = normalcolor;
    }
    this.home.onmouseover = function() {
        self.side.onmouseover();
        self.home.style.color = hovercolor;
        self.homeMenu.style.display = "block";
    }
    this.worldIcon.onmouseover = function() {
        self.side.onmouseover();
        self.worldIcon.style.color = hovercolor;
        self.worldMenu.style.display = "block";
    }
    this.analysis.onmouseover = function() {
        self.side.onmouseover();
        self.analysis.style.color = hovercolor;
        analysisMenu.style.display = "block";
    }
    this.settings.onmouseover = function() {
        self.side.onmouseover();
        self.settings.style.color = hovercolor;
        settingsMenu.style.display = "block";
    }
    this.add.onmouseover = function() {
        self.side.onmouseover();
        self.add.style.color = hovercolor;
        self.addMenu.style.display = "block";
    }
    this.mouseMode.onmouseover = function() {
        self.side.onmouseover();
        self.mouseMode.style.color = hovercolor;
    }
    this.mouseMode.onmouseout = function() {
        self.mouseMode.style.color = normalcolor;
    }
    this.snapshot.onmouseover = function() {
        self.side.onmouseover();
        self.snapshot.style.color = hovercolor;
    }
    this.snapshot.onmouseout = function() {
        self.snapshot.style.color = normalcolor;
    }
    this.goFull.onmouseover = function() {
        self.side.onmouseover();
        if (!self.isFull) self.goFull.style.color = hovercolor;
        else self.goFull.style.color = hovercolor;
    }
    this.goFull.onmouseout = function() {
        self.goFull.style.color = normalcolor;
    }
    this.canvas.onmouseout = function() {
        self.mouse.selected = null;
        self.mouse.hold = false;
    }
    this.info.onmouseover = function() {
        self.side.onmouseover();
        self.info.style.color = hovercolor;
        self.infoMenu.style.display = "block";
    }

    // --------------------------- RESIZE ELMENTS --------------------------------
    this.resize = function() {

        var bodystyle = window.getComputedStyle(document.body);
        this.windowSize = {
            x: parseFloat(bodystyle.width),
            y: parseFloat(bodystyle.height)
        };

        var containerstyle = window.getComputedStyle(self.container);
        var menustyle = window.getComputedStyle(self.menu);

        if (self.isFull) {
            self.container.style.width = window.screen.availWidth - parseInt(containerstyle.borderWidth);
            self.container.style.height = window.screen.availHeight - 2*parseInt(containerstyle.borderWidth);
        } else {
            self.container.style.width = self.windowSize.x - parseInt(containerstyle.marginLeft) - parseInt(containerstyle.marginRight) - parseInt(containerstyle.borderWidth);
            self.container.style.height = self.windowSize.y - parseInt(containerstyle.marginTop) - parseInt(containerstyle.marginBottom) - 2*parseInt(containerstyle.borderWidth);
        }

        self.canvas.height = parseInt(self.container.style.height);
        self.canvas.width = parseInt(self.container.style.width) - parseInt(menustyle.width) - 2*parseInt(containerstyle.borderWidth);
        self.menu.style.height = self.canvas.height;
        self.side.style.height = self.canvas.height;
        self.menu.style.marginLeft = 0;

        self.homeMenu.style.marginLeft = self.canvas.width - 300;
        self.worldMenu.style.marginLeft = self.canvas.width - 300;
        self.settingsMenu.style.marginLeft = self.canvas.width - 300;
        self.addMenu.style.marginLeft = self.canvas.width - 300;

        self.analysisMenu.style.width = self.canvas.width;
        self.infoMenu.style.width = self.canvas.width;

        self.homeMenu.style.height = self.canvas.height;
        self.worldMenu.style.height = self.canvas.height;
        self.analysisMenu.style.height = self.canvas.height;
        self.settingsMenu.style.height = self.canvas.height;
        self.addMenu.style.height = self.canvas.height;
        self.infoMenu.style.height = self.canvas.height;

        if (self.isWorldMenuFix || self.isSettingsFix || self.isAddMenuFix || self.isHomeMenuFix) {
            var style = null;

            if (self.isHomeMenuFix) {
                self.homeMenu.style.marginLeft = self.canvas.width - parseInt(containerstyle.borderWidth) - 300;
                style = window.getComputedStyle(self.homeMenu);
            } else if (self.isWorldMenuFix) {
                self.worldMenu.style.marginLeft = self.canvas.width - parseInt(containerstyle.borderWidth) - 300;
                style = window.getComputedStyle(self.worldMenu);
            } else if (self.isSettingsFix) {
                self.settingsMenu.style.marginLeft = self.canvas.width - parseInt(containerstyle.borderWidth) - 300;
                style = window.getComputedStyle(self.settingsMenu);
            } else if (self.isAddMenuFix) {
                self.addMenu.style.marginLeft = self.canvas.width - parseInt(containerstyle.borderWidth) - 300;
                style = window.getComputedStyle(self.addMenu);
            }

            self.menu.style.marginLeft = parseInt(style.width) + parseInt(containerstyle.borderWidth);
            self.canvas.width -= parseInt(style.width) + parseInt(containerstyle.borderWidth);
            self.analysisMenu.style.width = self.canvas.width;
        }

        world.scene.aspect = self.canvas.width / self.canvas.height;
        world.scene.updateProjection();
        initViewport(world.gl, world.canvas);
    }

    // ------------------------ SCREEN RESIZING HANDLERS -------------------------
    document.onwebkitfullscreenchange = function() {
        self.isFull = !self.isFull;
        self.resize();

        if (!self.isFull) goFull.innerHTML = "fullscreen";
        else goFull.innerHTML = "fullscreen_exit";
    }
    document.onmozfullscreenchange = document.onwebkitfullscreenchange;
    document.onfullscreenchange = document.onmozfullscreenchange;
    document.MSFullscreenChange = document.onfullscreenchange;

    this.setDefaults = function() {

        this.boostFactor.value = world.constants.boostFactor;
        this.timeStep.value = world.constants.timeStep;
        this.temperature.value = world.temperature0;
        this.temperature.onchange();
        if (world.exec_thermostat) this.activeThermostat.innerHTML = "<i class='material-icons'>check</i>";
        if (world.drawGrids) this.activeGrids.innerHTML = "<i class='material-icons'>check</i>";
        this.energyFrequency.value = world.energyTempFrequency;
        this.thermostatFrequency.value = world.thermostatFrequency;
        this.renderFrequency.value = world.renderFrequency;
        this.sampleFrequency.value = world.sampleFrequency;
        if (world.mouseMode === "move") {
            self.mouseMode.innerHTML = "pan_tool";
            self.mouseMode.style.margin = "2.5px 0";
            self.mouseMode.style.fontSize = "35px";
            self.canvas.style.cursor = "default";
            self.analysisMenu.style.cursor = "default";
        }
        this.colorMode.value = world.colorMode;
        this.drawingMode.value = world.drawingMode;
        if (self.drawingMode.value == "bonds") {
            world.drawBonds = true;
            world.drawAtoms = false;
            self.bondRadius.value = 0.2;
            self.bondRadius.onchange();
        } else if (self.drawingMode.value == "vdw") {
            world.drawBonds = false;
            world.drawAtoms = true;
            world.atoms.minradius = 0.4;
            world.atoms.radiusScale = 1.0;
        } else if (self.drawingMode.value == "bas") {
            world.drawBonds = true;
            world.drawAtoms = true;
            world.atoms.radiusScale = 0.2;
            world.atoms.minradius = 0.25;
            self.bondRadius.value = 0.125;
            self.bondRadius.onchange();
        } else if (self.drawingMode.value == "licorice") {
            world.drawBonds = true;
            world.drawAtoms = true;
            world.atoms.radiusScale = 0.0;
            world.atoms.minradius = 0.2;
            self.bondRadius.value = 0.2;
            self.bondRadius.onchange();
        }
        this.bondResolution.value = world.bonds.precision;
        this.atomResolution.value = world.atoms.sphereLongitude;
        this.size.value = world.size.x.toFixed(2) + " " + world.size.y.toFixed(2) + " " + world.size.z.toFixed(2);

        this.bondRadius.value = world.bonds.radius;
        this.backgroundColor.value = parseInt(255 * world.scene.backgroundColor[0]) + ", " + parseInt(255 * world.scene.backgroundColor[1]) + ", " +
            parseInt(255 * world.scene.backgroundColor[2]) + ", " + parseInt(255 * world.scene.backgroundColor[3]);
        this.typeColor.value = parseInt(255 * world.elements.atom_colors[this.typeSelection.value][0]) + ", " +
            parseInt(255 * world.elements.atom_colors[this.typeSelection.value][1]) + ", " +
            parseInt(255 * world.elements.atom_colors[this.typeSelection.value][2]) + ", " +
            parseInt(255 * world.elements.atom_colors[this.typeSelection.value][3]);
        this.residueColor.value = parseInt(255 * world.elements.residual_colors[this.residueSelection.value][0]) + ", " +
            parseInt(255 * world.elements.residual_colors[this.residueSelection.value][1]) + ", " +
            parseInt(255 * world.elements.residual_colors[this.residueSelection.value][2]) + ", " +
            parseInt(255 * world.elements.residual_colors[this.residueSelection.value][3]);
        this.customColor.value = parseInt(255 * world.elements.single_color[0]) + ", " +
            parseInt(255 * world.elements.single_color[1]) + ", " +
            parseInt(255 * world.elements.single_color[2]) + ", " +
            parseInt(255 * world.elements.single_color[3]);
        this.farClip.value = world.scene.far;
        this.nearClip.value = world.scene.near;
        this.perspectiveAngle.value = world.scene.fov;
        this.shininess.value = world.atoms.shininess;
        this.ambientColor.value = parseInt(255 * world.atoms.ambientColor[0]);
        this.diffuseColor.value = parseInt(255 * world.atoms.diffuseColor[0]);
        this.specularColor.value = parseInt(255 * world.atoms.specularColor[0]);
        this.radiusScale.value = world.atoms.radiusScale;
        self.duration.value = world.maxSteps * world.constants.timeStep / 1000;

        self.bondResolution.onchange();
        self.atomResolution.onchange();
    }
    this.show = function(){
        this.loading.style.display = 'none';
        this.loading.style.animationPlayState = 'paused';
        this.container.style.visibility = 'visible';
    }
    this.showInfo = function(id) {
        this.particlesInfo.innerHTML += '<tr id="pInfo' + id + '">' +
            "<td>" + id + "</td>" +
            "<td>" + world.data.atoms_types[id] + "</td>" +
            "<td>" + world.data.atoms_segnames[id] + "</td>" +
            "<td>" + world.data.atoms_mass[id].toFixed(2) + "</td>" +
            "<td>" + world.data.atoms_charge[id].toFixed(2) + "</td>" +
            "</tr>";

    }
    this.saveDoc = function(str, format, name) {
        self.downloader.href = "data:text/" + format + "; charset=utf-8," + encodeURIComponent(str);
        self.downloader.download = name;
        self.downloader.click();
    }
    this.updateScreenInfo = function() {
        self.energyTemp.innerHTML = " | Energy: " + world.energy.toFixed(3) + " | Temperature: " + world.temperature.toFixed(2);
        self.time.innerHTML = "Time: " + (world.steps * world.constants.timeStep / 1000).toFixed(1) + " | Steps: " + world.steps;
        this.energyInfo.innerHTML = "<tr><td>Angle</td><td>" + world.angleEnergy.toFixed(2) + "</td></tr>" +
            "<tr><td>Bond</td><td>" + world.bondEnergy.toFixed(2) + "</td></tr>" +
            "<tr><td>Eletrostatic</td><td>" + world.eEnergy.toFixed(2) + "</td></tr>" +
            "<tr><td>Van der Waals</td><td>" + world.vdwEnergy.toFixed(2) + "</td></tr>" +
            "<tr><td>Kinect</td><td>" + world.kEnergy.toFixed(2) + "</td></tr>" +
            "<tr><td>Wall</td><td>" + world.wallEnergy.toFixed(2) + "</td></tr>";
    }
    this.resize();
}

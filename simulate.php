<head>
    <title>Angstrom</title>
    <link href="https://fonts.googleapis.com/css?family=Poiret+One" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Noto+Sans' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href='style/header.css' rel='stylesheet' type="text/css">
    <link href='style/simulate.css' rel='stylesheet' type="text/css">
</head>

<body>

    <div id="header">
      <div id="background"></div>
      <a href="index.php"><img id="logo" src="images/logo.png"></a>
      <div id="menu">
          <b> <a href="">ABOUT</a> | <a href="">TUTORIALS</a> | <a href="">DOCUMENTATION</a> | <a href="">GITHUB</a> </b>
      </div>
    </div>

    <div id="submission">
        <form id="form1" action="application.php" method="post">

            <input id="createpsf" type="hidden" name="createpsf" value="false">
            <input id="pdbfile" type="hidden" name="pdb">
            <input id="psffile" type="hidden" name="psf">
            <input id="prmfile0" type="hidden" name="prm0">
            <input id="prmfile1" type="hidden" name="prm1">
            <input id="prmfile2" type="hidden" name="prm2">
            <input id="information" type="hidden" name="information" value="information_default.html">

            <input id="timeStep" type="hidden" name="timeStep" value="1">
            <input id="maxSteps" type="hidden" name="maxSteps" value="1000000">
            <input id="temperature" type="hidden" name="temperature" value="10">
            <input id="thermostat" type="hidden" name="thermostat" value="0">
            <input id="energyFrequency" type="hidden" name="energyFrequency" value="10">
            <input id="thermostatFrequency" type="hidden" name="thermostatFrequency" value="2">
            <input id="renderFrequency" type="hidden" name="renderFrequency" value="3">
            <input id="mouseMode" type="hidden" name="mouseMode" value="select">
            <input id="drawingMode" type="hidden" name="drawingMode" value="bas">
            <input id="colorMode" type="hidden" name="colorMode" value="atoms">
            <input id="atomResolution" type="hidden" name="atomResolution" value="10">
            <input id="bondResolution" type="hidden" name="bondResolution" value="10">
            <input id="worldSize" type="hidden" name="worldSize" value="auto">
            <input id="exclude13" type="hidden" name="exclude13" value="1">
            <input id="epsolonR" type="hidden" name="epsolonR" value="1">
            <input id="boostFactor" type="hidden" name="boostFactor" value="3">
            <input id="martine" type="hidden" name="martine" value="false">
            <input id="enableAdd" type="hidden" name="enableAdd" value="false">

            <br>PDB.org URL/ID:<input id="pdburl" type="text" name="url">
        </form>
        <button id="upload">LOAD</button>
        <br> <i id="loadingIcon"class="material-icons">alarm</i>
    </div>

    <div id="container">


        <!-- ######################## EXAMPLE HERE  #########################

             In order to create a box link like this just copy the following
             div and edit where especified. Then go to the javascript code in the
             bottom of the file. There you will create a new onclick function for
             the created div ID and set the simulation configurations there.
             Follow the comments there.                                     -->
        <div class="item" id="someID">
            <img class="itemImg" src="images/water.png">
            <h2>NAME HERE</h2>
            <div class="information">
                <br>
                <p class="itemDescription">SOME INFORMATION HERE (SEE HTML FOR INSTRUCTIONS)</p>
            </div>
            <p class="itemRecommendation">SIZE HERE</p>
            <a class="itemLink" href="">SOME LINK HERE</a>
        </div>

        <!-- ####################### END OF EXAMPLE ######################## -->

        <div class="item" id="buildCharmm">
            <img class="itemImg" src="images/buildCharmm.png">
            <h2>Build your own!</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Build your own simulation using preset molecules made
                    with Charmm force fields.
                </p>
            </div>
            <p class="itemRecommendation"></p>
            <a class="itemLink" href="http://mackerell.umaryland.edu/charmm_ff.shtml">CHARMM FORCE FIELD</a>
        </div>

        <div class="item" id="buildMartine">
            <img class="itemImg" src="images/buildMartine.png">
            <h2>Build your own!</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Build your own coarse grain simulation using preset
                    molecules made with Martine force fields.
                </p>
            </div>
            <p class="itemRecommendation"></p>
            <a class="itemLink" href="http://www.ks.uiuc.edu/Research/CG/">COARSE GRAIN</a>
        </div>

        <br>

        <div class="item" id="two_lipids">
            <img class="itemImg" src="images/two_lipids.png">
            <h2>Two Lipids</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    See a pair of lipids interacting with each other inside of
                    a small box!<br><br>
                    Incial temperature: 300 K. <br>
                    Thermostat off.
                </p>
            </div>
            <p class="itemRecommendation">26 PARTICLES 2 MOLECULES</p>
            <a class="itemLink" href="http://www.ks.uiuc.edu/Research/CG/">COARSE GRAIN</a>
        </div>

        <div class="item" id="lipids_membrane">
            <img class="itemImg" src="images/lipid_bilayer.png">
            <h2>Lipids Membrane</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    See a membrane full of lipids surrounded by several water
                    molecules. <br><br>
                    Incial temperature: 300 K. <br>
                    Thermostat off.
                </p>
            </div>
            <p class="itemRecommendation">1522 PARTICLES 922 MOLECULES</p>
            <a class="itemLink" href="http://www.ks.uiuc.edu/Research/CG/">COARSE GRAIN</a>
        </div>

        <br>

        <div class="item" id="water_box">
            <img class="itemImg" src="images/water_box.png">
            <h2>Water Box</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Want to make some ice? What about some vapor? You can.
                    Change the box size and temperature to make it happen.
                    It may take some time.<br><br>
                    Incial temperature: 50 K. Thermostat off.<br>
                </p>
            </div>
            <p class="itemRecommendation">779 MOLECULES</p>
            <a class="itemLink" href="http://mackerell.umaryland.edu/charmm_ff.shtml">CHARMM FORCE FIELD</a>
        </div>

        <div class="item" id="water_and_atoms">
            <img class="itemImg" src="images/water_atoms.png">
            <h2>Water and Atoms</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    A box full of water with chloride, sodium and methane mixed.<br><br>
                    Incial temperature: 300 K.<br>Thermostat off.
                </p>
            </div>
            <p class="itemRecommendation">304 MOLECULES</p>
            <a class="itemLink" href="http://mackerell.umaryland.edu/charmm_ff.shtml">CHARMM FORCE FIELD</a>
        </div>

        <br>

        <div class="item" id="methane">
            <img class="itemImg" src="images/methane.png">
            <h2>Methane</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    How do we get so warm in the winter? Methane is the major
                    component of natural gas used for heating homes<br><br>
                    Incial temperature: 200 K. Thermostat off.
                </p>
            </div>
            <p class="itemRecommendation">1 MOLECULES</p>
            <a class="itemLink" href="http://mackerell.umaryland.edu/charmm_ff.shtml">CHARMM FORCE FIELD</a>
        </div>

        <div class="item" id="water">
            <img class="itemImg" src="images/water.png">
            <h2>Water</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Take a look on the most famous molecule of the earth. H 2 0.<br><br>
                    Incial temperature: 200 K.<br>Thermostat off.
                </p>
            </div>
            <p class="itemRecommendation">1 MOLECULES</p>
            <a class="itemLink" href="http://mackerell.umaryland.edu/charmm_ff.shtml">CHARMM FORCE FIELD</a>
        </div>

        <br>

        <div class="item" id="octane_water">
            <img class="itemImg" src="images/water_octane.png">
            <h2>Octane-Water System</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Why water and gasoline do not mix? See octane, a component of
                    gasoline, not mixing with water<br><br>
                    Incial temperature: 300 K.<br>Thermostat off.
                </p>
            </div>
            <p class="itemRecommendation">100 PARTICLES 75 MOLECULES</p>
            <a class="itemLink" href="http://www.ks.uiuc.edu/Research/CG/">COARSE GRAIN</a>
        </div>

    <script>
        /* ######################### IMPORTANT #############################
           EDIT THE .VALUE PROPERTY OF THE FOLLOWING VARIABLES AND SUBMIT THE
           FORM TO MAKE THE SET CONFIGURATIONS. ALL THE VALUE MUST BE INSIDE OF
           A STRING. TO CHANGE THE DEFAULT VALUES GO TO THE TOP OF THE FILE  */

        var pdb = document.getElementById("pdbfile");           // Required
        var psf = document.getElementById("psffile");           // Required
        var prm0 = document.getElementById("prmfile0");         // Required
        var prm1 = document.getElementById("prmfile1");         // Optional
        var prm2 = document.getElementById("prmfile2");         // Optional

        var form = document.getElementById("form1");

        // Number in ns. Default = 1
        var timeStep = document.getElementById("timeStep");

        // Integer. Default = 1000000
        var maxSteps = document.getElementById("maxSteps");

        // Number. Default = 0
        var temperature = document.getElementById("temperature");

        // Boolean (1 or 0). Default = 0 > off
        var thermostat = document.getElementById("thermostat");

        // Integer (do each n steps). Default = 10
        var energyFrequency = document.getElementById("energyFrequency");

        // Integer (do each n steps). Default = 2
        var thermostatFrequency = document.getElementById("thermostatFrequency");

        // Integer (do each n steps). Default = 15
        var renderFrequency = document.getElementById("renderFrequency");

        /* Values:
         *  -select: select atoms to see information.
         *  -move: grab molecules and move.
         * Default = select */
        var mouseMode = document.getElementById("mouseMode");

        /* Values:
         *  - bas: Ball and sticks. Particles are sized to a scale of the vdw radius and bonds are displayed.
         *  - vdw: Bonds are not displayed. Particles are sized according to their vdw radius.
         *  - bonds: Only bonds are displayed.
         *  - licorice: Bonds and spheres a sized to the same radius.
         * Default: bas */
        var drawingMode = document.getElementById("drawingMode");

        /* Values:
        *   - atoms: color by atom type.
        *   - residuals: color by residuals type.
        *   - single: a single color for all.
        *   - selected: colors only the selected atoms.
        * Default: atoms */
        var colorMode = document.getElementById("colorMode");

        // Integer (maximum 27). Default = 10
        var atomResolution = document.getElementById("atomResolution");

        // Integer (maximum 50). Default = 10
        var bondResolution = document.getElementById("bondResolution");

        /* Values:
         *   - auto
         *   - xyz vector of type: number, number, number
         *   - xyz vector of type: number number number
         * Default: auto */
        var worldSize = document.getElementById("worldSize");

        // Boolean (1 or 0). Default = 1 >> on
        var exclude13 = document.getElementById("exclude13");

        // Number. Default = 1
        var epsolonR = document.getElementById("epsolonR");

        /* Number. Specify how many times animate() will be fired.
         * Greater the value, faster the simulation. Depends on the
         * computer and size of the simulation. Default: 1*/
        var boostFactor = document.getElementById("boostFactor");

        /* Boolean ("true" or "false"). Specify if it is a Martine force
         * field simulation. Default: false*/
        var martine = document.getElementById("martine");

        /* Boolean ("true" or "false"). Specify if it is a preset model
         * or a empty one with option to add molecules. Default: false*/
        var enableAdd = document.getElementById("enableAdd");

        /* ####################### EXAMPLE ############################## */
        document.getElementById("someID").onclick = function(){
            pdb.value = "files/pdbs/ubq.pdb";
            psf.value = "files/psfs/ubq.psf";
            prm0.value = "files/parameters/par_all27_prot_lipid.prm";
            thermostat.value = "1";
            thermostatFrequency = "10";
            temperature.value = "100";
            form.submit();
        }
        /* #################### END OF EXAMPLE ######################### */

        /* DEFAULTS
        timeStep.value = "1";
        maxSteps.value = "1000000";
        temperature.value = "0";
        thermostat.value = "0";
        energyFrequency.value = "10";
        thermostatFrequency.value = "2";
        renderFrequency.value = "3";
        mouseMode.value = "select";
        drawingMode.value = "bas";
        colorMode.value = "atoms";
        atomResolution.value = "10";
        bondResolution.value = "10";
        worldSize.value = "auto"
        exclude13.value = "1";
        epsolonR.value = "1";
        boostFactor.value = "1";
        martine.value = "false";
        enableAdd.value = "false";
        */

        /*
        document.getElementById("graphene").onclick = function(){
            pdb.value = "files/pdbs/graphene.pdb";
            psf.value = "files/psfs/graphene.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/par_all36_prot.prm";
            prm2.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }
        */

        var colorClock = function(){
            document.getElementById("loadingIcon").style.color = "rgba(" + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ", 1)";
        }

        window.onpageshow = function(){
            document.getElementById("loadingIcon").style.display = "none";
            timeStep.value = "1";
            maxSteps.value = "1000000";
            temperature.value = "0";
            thermostat.value = "0";
            energyFrequency.value = "10";
            thermostatFrequency.value = "2";
            renderFrequency.value = "3";
            mouseMode.value = "select";
            drawingMode.value = "bas";
            colorMode.value = "atoms";
            atomResolution.value = "10";
            bondResolution.value = "10";
            worldSize.value = "auto"
            exclude13.value = "1";
            epsolonR.value = "1";
            boostFactor.value = "1";
            martine.value = "false";
            enableAdd.value = "false";
        }

        document.getElementById("buildCharmm").onclick = function(){
            temperature.value = "100";
            thermostat.value = "1";
            atomResolution.value = "25";
            bondResolution.value = "25";
            worldSize.value = "auto"
            enableAdd.value = "true";
            form.submit();
        }

        document.getElementById("buildMartine").onclick = function(){
            timeStep.value = "30";
            temperature.value = "100";
            thermostat.value = "1";
            atomResolution.value = "20";
            bondResolution.value = "20";
            worldSize.value = "30 30 30"
            drawingMode.value = "licorice";
            exclude13.value = "0";
            epsolonR.value = "15";
            martine.value = "true";
            enableAdd.value = "true";
            form.submit();
        }

        document.getElementById("two_lipids").onclick = function(){
            pdb.value = "files/pdbs/cg_popc_two.pdb";
            psf.value = "files/psfs/cg_popc_two.psf";
            prm0.value = "files/parameters/martini_popc.prm";
            timeStep.value = "30";
            temperature.value = "300";
            atomResolution.value = "25";
            bondResolution.value = "25";
            drawingMode.value = "licorice";
            exclude13.value = "0";
            epsolonR.value = "15";
            martine.value = "true";
            form.submit();
        }

        document.getElementById("lipids_membrane").onclick = function(){
            pdb.value = "files/pdbs/lipidsMembrane.pdb";
            psf.value = "files/psfs/lipidsMembrane.psf";
            prm0.value = "files/parameters/martini_oco_popc.prm";
            timeStep.value = "30";
            temperature.value = "300";
            drawingMode.value = "licorice";
            exclude13.value = "0";
            epsolonR.value = "15";
            martine.value = "true";
            form.submit();
        }

        document.getElementById("water_and_atoms").onclick = function(){
            pdb.value = "files/pdbs/water_and_atoms.pdb";
            psf.value = "files/psfs/water_and_atoms.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/toppar_water_ions_cgenff.str";
            temperature.value = "300";
            thermostat.value = "1";
            form.submit();
        }

        document.getElementById("water_box").onclick = function(){
            pdb.value = "files/pdbs/water_box.pdb";
            psf.value = "files/psfs/water_box.psf";
            prm1.value = "files/parameters/toppar_water_ions_cgenff.str";
            temperature.value = "50";
            thermostat.value = "1";
            form.submit();
        }

        document.getElementById("methane").onclick = function(){
            pdb.value = "files/pdbs/methane.pdb";
            psf.value = "files/psfs/methane.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            atomResolution.value = "25";
            bondResolution.value = "25";
            temperature.value = "200";
            form.submit();
        }

        document.getElementById("water").onclick = function(){
            pdb.value = "files/pdbs/water.pdb";
            psf.value = "files/psfs/water.psf";
            prm0.value = "files/parameters/toppar_water_ions_cgenff.str";
            atomResolution.value = "25";
            bondResolution.value = "25";
            temperature.value = "200";
            form.submit();
        }

        document.getElementById("octane_water").onclick = function(){
            pdb.value = "files/pdbs/cg_octane-wat.pdb";
            psf.value = "files/psfs/cg_octane-wat.psf";
            prm0.value = "files/parameters/martini_oco_popc.prm";
            timeStep.value = "30";
            temperature.value = "300";
            drawingMode.value = "licorice";
            atomResolution.value = "15";
            bondResolution.value = "15";
            exclude13.value = "0";
            epsolonR.value = "15";
            martine.value = "true";
            boostFactor.value = "5";
            form.submit();
        }
    </script>

</body>

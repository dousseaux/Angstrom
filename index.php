<head>
    <title> PDB Vizualizer </title>
    <link href='https://fonts.googleapis.com/css?family=Noto+Sans' rel='stylesheet' type='text/css'>
    <link href='style/indexStyle.css' rel='stylesheet' type="text/css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<body>
    <div id="header">
      <div>
          <img id="logo" src="images/logo.png">
          <h1>PDB Simulator</h1>
          <img id="background" src="images/background.png">
      </div>
    </div>

    <div id="submission">
        <form id="form1" action="vizualize.php" method="post">

            <input id="createpsf" type="hidden" name="createpsf" value="false">
            <input id="pdbfile" type="hidden" name="pdb">
            <input id="psffile" type="hidden" name="psf">
            <input id="prmfile0" type="hidden" name="prm0">
            <input id="prmfile1" type="hidden" name="prm1">
            <input id="prmfile2" type="hidden" name="prm2">
            <input id="information" type="hidden" name="information" value="information_default.html">

            <input id="timeStep" type="hidden" name="timeStep" value="1">
            <input id="maxSteps" type="hidden" name="maxSteps" value="1000000">
            <input id="temperature" type="hidden" name="temperature" value="0">
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
            <img class="itemImg" src="images/ubq.png">
            <h2>NAME HERE</h2>
            <div class="information">
                <br>
                <p class="itemDescription">SOME INFORMATION HERE (SEE HTML FOR INSTRUCTIONS)</p>
            </div>
            <p class="itemRecommendation">SIZE HERE</p>
            <a class="itemLink" href="">SOME LINK HERE</a>
        </div>
        <!-- ####################### END OF EXAMPLE ######################## -->

        <div class="item" id="graphene">
            <img class="itemImg" src="images/single_lipid.png">
            <h2>Graphene</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="two_lipids">
            <img class="itemImg" src="images/two_lipids.png">
            <h2>Two Lipids</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="lipids_membrane">
            <img class="itemImg" src="images/lipid_bilayer.png">
            <h2>Lipids Membrane</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Medium</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="water_box">
            <img class="itemImg" src="images/water_box.png">
            <h2>Water Box</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Medium</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="water_and_atoms">
            <img class="itemImg" src="images/water_atoms.png">
            <h2>Water and Atoms</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Medium</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="meth">
            <img class="itemImg" src="images/methane.png">
            <h2>Methane</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Medium</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="water">
            <img class="itemImg" src="images/water.png">
            <h2>Water</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Medium</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="octane_water">
            <img class="itemImg" src="images/water_octane.png">
            <h2>Octane-Water System</h2>
            <div class="information">
                <br>
                <p class="itemDescription"></p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="two_particles">
            <img class="itemImg" src="images/two_particles.png">
            <h2>Two Particles</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Simple system to test the funcionality of the bond, electrostatic
                    and Van der Waals forces on the simulation.
                </p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>

        <div class="item" id="three_particles">
            <img class="itemImg" src="images/three_particles.png">
            <h2>Three Particles</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Simple system to test the funcionality of the bond, electrostatic
                    and Van der Waals forces on the simulation.
                </p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>
    </div>

    <script>

        var colorClock = function(){
            document.getElementById("loadingIcon").style.color = "rgba(" + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ", 1)";
        }

        window.onfocus = function(){
            document.getElementById("loadingIcon").style.display = "none";
        }

        /* ###################### NOT IMPORTANT #############################
        document.getElementById("upload").onclick = function(){
            colorClock();
            window.setInterval(colorClock, 250);
            document.getElementById("loadingIcon").style.display = "inline-block";
            pdb.value = document.getElementById("pdburl").value
            document.getElementById("createpsf").value = "true";
            form.submit();
        }*/

        var form = document.getElementById("form1");

        /* ######################### IMPORTANT #############################
           EDIT THE .VALUE PROPERTY OF THE FOLLOWING VARIABLES AND SUBMIT THE
           FORM TO MAKE THE SET CONFIGURATIONS. ALL THE VALUE MUST BE INSIDE OF
           A STRING. TO CHANGE THE DEFAULT VALUES GO TO THE TOP OF THE FILE  */

        var pdb = document.getElementById("pdbfile");           // Required
        var psf = document.getElementById("psffile");           // Required
        var prm0 = document.getElementById("prmfile0");         // Required
        var prm1 = document.getElementById("prmfile1");         // Optional
        var prm2 = document.getElementById("prmfile2");         // Optional

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
         * Desfault: auto */
        var worldSize = document.getElementById("worldSize");

        // Boolean (1 or 0). Default = 1 >> on
        var exclude13 = document.getElementById("exclude13");

        // Number. Default = 1
        var epsolonR = document.getElementById("epsolonR");

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

        document.getElementById("graphene").onclick = function(){
            pdb.value = "files/pdbs/graphene.pdb";
            psf.value = "files/psfs/graphene.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/par_all36_prot.prm";
            prm2.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }

        document.getElementById("two_lipids").onclick = function(){
            pdb.value = "files/pdbs/cg_popc_two.pdb";
            psf.value = "files/psfs/cg_popc_two.psf";
            prm0.value = "files/parameters/martini_popc.prm";
            form.submit();
        }

        document.getElementById("lipids_membrane").onclick = function(){
            pdb.value = "files/pdbs/lipidsMembrane.pdb";
            psf.value = "files/psfs/lipidsMembrane.psf";
            prm0.value = "files/parameters/martini_oco_popc.prm";
            form.submit();
        }

        document.getElementById("water_and_atoms").onclick = function(){
            pdb.value = "files/pdbs/water_and_atoms.pdb";
            psf.value = "files/psfs/water_and_atoms.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }

        document.getElementById("water_box").onclick = function(){
            pdb.value = "files/pdbs/water_box.pdb";
            psf.value = "files/psfs/water_box.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }

        document.getElementById("meth").onclick = function(){
            pdb.value = "files/pdbs/meth.pdb";
            psf.value = "files/psfs/meth.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }

        document.getElementById("water").onclick = function(){
            pdb.value = "files/pdbs/water.pdb";
            psf.value = "files/psfs/water.psf";
            prm0.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }

        document.getElementById("octane_water").onclick = function(){
            pdb.value = "files/pdbs/cg_octane-wat.pdb";
            psf.value = "files/psfs/cg_octane-wat.psf";
            prm0.value = "files/parameters/martini_oco_popc.prm";
            form.submit();
        }

        document.getElementById("two_particles").onclick = function(){
            pdb.value = "files/pdbs/two.pdb";
            psf.value = "files/psfs/two.psf";
            prm0.value = "files/parameters/two.par";
            form.submit();
        }

        document.getElementById("three_particles").onclick = function(){
            pdb.value = "files/pdbs/three.pdb";
            psf.value = "files/psfs/three.psf";
            prm0.value = "files/parameters/martini_popc.prm";
            form.submit();
        }

    </script>

</body>
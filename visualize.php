<head>
    <title>Angstrom</title>
    <link href="https://fonts.googleapis.com/css?family=Poiret+One" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Noto+Sans' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href='style/header.css' rel='stylesheet' type="text/css">
    <link href='style/visualize.css' rel='stylesheet' type="text/css">
</head>

<body>

    <div id="header">
      <div id="background"></div>
      <a href="index.php"><img id="logo" src="images/logo.png"></a>
      <div id="menu">
          <b> <a href="">ABOUT</a> | <a href="">TUTORIALS</a> | <a href="">DOCUMENTATION</a> | <a href="">GITHUB</a> </b>
      </div>
    </div>

    <div id="container">
        <h3>UPLOAD FROM PDB.org</h3>
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
                <input id="temperature" type="hidden" name="temperature" value="0">
                <input id="thermostat" type="hidden" name="thermostat" value="0">
                <input id="energyFrequency" type="hidden" name="energyFrequency" value="10">
                <input id="thermostatFrequency" type="hidden" name="thermostatFrequency" value="2">
                <input id="renderFrequency" type="hidden" name="renderFrequency" value="3">
                <input id="mouseMode" type="hidden" name="mouseMode" value="select">
                Drawing mode:<select id="drawingMode" name="drawingMode">
                    <option value="bas">BALL AND STICK</option>
                    <option value="bonds">BONDS</option>
                    <option value="vdw">VDW</option>
                    <option value="licorice">LICORICE</option>
                </select>
                <i class="material-icons selectArrow">keyboard_arrow_down</i>
                <input id="colorMode" type="hidden" name="colorMode" value="atoms">
                Atom resolution: <input id="atomResolution" type="number" name="atomResolution" value="10">
                Bond resolution: <input id="bondResolution" type="number" name="bondResolution" value="10">
                <input id="worldSize" type="hidden" name="worldSize" value="auto">
                <input id="exclude13" type="hidden" name="exclude13" value="1">
                <input id="epsolonR" type="hidden" name="epsolonR" value="1">
                <input id="boostFactor" type="hidden" name="boostFactor" value="1">
                <input id="martine" type="hidden" name="martine" value="false">
                <input id="enableAdd" type="hidden" name="enableAdd" value="false">
                <input id="visualize" type="hidden" name="visualize" value="true">

                <br><br>URL/ID:<input id="pdburl" type="text" name="url">
                <button id="upload">LOAD</button>
                <br><i id="loadingIcon"class="material-icons">alarm</i>
            </form>
        </div>

        <h3>PRESETS</h3>
        <!-- ######################## EXAMPLE HERE  #########################

             In order to create a box link like this just copy the following
             div and edit where especified. Then go to the javascript code in the
             bottom of the file. There you will create a new onclick function for
             the created div ID and set the simulation configurations there.
             Follow the comments there.                                     -->

        <div class="item" id="graphene">
            <img class="itemImg" src="images/graphene.png">
            <h2>Graphene</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Temp
                </p>
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

        <div class="item" id="2y9j">
            <img class="itemImg" src="images/2y9j.png">
            <h2>Two Lipids</h2>
            <div class="information">
                <br>
                <p class="itemDescription">Lipids</p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" href="">PDB.org</a>
        </div>


    <script>

        var colorClock = function(){
            document.getElementById("loadingIcon").style.color = "rgba(" + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ", 1)";
        }

        window.onfocus = function(){
            document.getElementById("loadingIcon").style.display = "none";
        }

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
         * Desfault: auto */
        var worldSize = document.getElementById("worldSize");

        // Boolean (1 or 0). Default = 1 >> on
        var exclude13 = document.getElementById("exclude13");

        // Number. Default = 1
        var epsolonR = document.getElementById("epsolonR");

        form1.onsubmit = function(){
            colorClock();
            window.setInterval(colorClock, 250);
            document.getElementById("loadingIcon").style.display = "inline-block";
            pdb.value = document.getElementById("pdburl").value
            document.getElementById("createpsf").value = "true";
        }

        document.getElementById("2y9j").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/2y9j.pdb";
            psf.value = "files/psfs/visualize_defaults/2y9j.psf";
            prm0.value = "files/parameters/par_all27_prot_lipid.prm";
            form.submit();
        }

    </script>

</body>

<?php
    /* Creates a PSF file for the PDB that is being used. It runs a Bash script on the
     * server that uses VMD to creat a psf */
    if($_POST["createpsf"] == "true"){
        $len = strlen($_POST["pdb"]) - 1;
        if($len > 5){
            $handle = $_POST["pdb"];
            $_POST["pdb"] = $handle[$len - 3] . $handle[$len - 2] . $handle[$len - 1] . $handle[$len];
        }

        shell_exec("wget -O buildPSF/temp.pdb " . "http://files.rcsb.org/download/" . $_POST["pdb"] . ".pdb");
        shell_exec("./buildPSF/doPsf.sh " . "temp.pdb");

        $out = shell_exec("find -name temp_autopsf.pdb");

        if($out){
            $_POST["pdb"] = "buildPSF/temp_autopsf.pdb";
            $_POST["psf"] = "buildPSF/temp_autopsf.psf";
        }else{
            $_POST["pdb"] = "buildPSF/temp_autopsf_tmpfile.pdb";
            $_POST["psf"] = "buildPSF/temp_autopsf_tmpfile.psf";
        }
    }
?>

<head>
    <title>Angstrom</title>
    <link href= 'style/fonts/Oswald.css' rel="stylesheet" />
    <link href='style/fonts/Libre_Franklin.css' rel="stylesheet" />
    <link href= 'style/material-icons/material-icons.css' rel="stylesheet" />
    <link href= 'style/application.css' rel='stylesheet' type="text/css">
</head>

<!-- USER INTERFACE STRUCTURE -->
<body>
    <div id="loading">
        <i id="loadingIcon" class="material-icons">alarm</i><a id="loadingMessage">LOADING...</a>
    </div>
    <div id="container">
        <a href="index.html"><img id="logo" src="images/logo2.png"></a>
        <div id="status">
            <span id="time"></span>
            <span id="particles"></span>
            <span id="energyTemp"></span>
        </div>

        <div id="homeMenu">
          <div>
              <i id="pinHomeMenu" class="material-icons">chevron_right</i>

              <br><h3>Temperature: <span id="temperatureLabel"></span></h3>
              <br><input id="temperatureSlider" type="range" min="0" max="1000" step="1" name="rating" />
              <br><br><h3>Scale</h3>
              <br><input id="rescaleSize" type="range" min="0" max="100" value="50" step="1" name="rating" />

              <br><br><br>
              <button id="activeGrids" class="checkButton"></button>
              <h3>Grids</h3>

              <br>
              <button id="activeThermostat" class="checkButton"></button>
              <h3>Thermostat</h3>

              <br><br>
          </div>
        </div>
        <div id="worldMenu">
          <div>
              <i id="pinWorldMenu" class="material-icons">chevron_right</i>

              <div class="hideOnAdd">
                  <h2>WORLD</h2>
                  Temperature (K): <input id="temperature" type="number" name="temperature">
                  <br><br>Size: <input id="size" type="text" name="size">
                  <br><br>Boost factor: <input id="boostFactor" type="number" name="boostFactor">
              </div>

              <br><br>
              <h2>SELECTION & DRAWING</h2>

              Selection Mode:
              <select id="selectionMode" name="selectionMode">
                <option value="all">ALL</option>
                <option value="selected">MOUSE</option>
                <option value="atoms">ATOMS</option>
                <option value="natoms">NATOMS</option>
                <option value="type">TYPES</option>
                <option value="residual">RESIDUAL</option>
                <option value="clear">CLEAR</option>
              </select>
              <i class="material-icons selectArrow">keyboard_arrow_down</i>

              <br>Parameters: <input id="selectionPar1" type="number" name="selectionPar1" disabled>
              <input id="selectionPar2" type="number" name="selectionPar2">

              <br><br><br>SELECTIONS:
              <p id="selectionView"></p>

              <br><br>
              Color mode:
              <select id="colorMode" name="colorMode" width="100px">
                <option value="atoms">ATOMS</option>
                <option value="residuals">RESIDUALS</option>
                <option value="single">SINGLE</option>
              </select>
              <i class="material-icons selectArrow">keyboard_arrow_down</i>

              <br>
              Draw mode:
              <select id="drawingMode" name="drawingMode">
                <option value="bonds">BONDS</option>
                <option value="vdw">VDW</option>
                <option value="bas">BALL AND STICK</option>
                <option value="licorice">LICORICE</option>
              </select>
              <i class="material-icons selectArrow">keyboard_arrow_down</i>

              <br><br><br>Atom resolution: <input id="atomResolution" type="number" name="atomResolution">
              <br><br>Atom radius Scale: <input id="radiusScale" type="number" name="radiusScale">
              <br><br>Bond resolution: <input id="bondResolution" type="number" name="bondResolution">
              <br><br>Bond radius: <input id="bondRadius" type="number" name="bondRadius">

              <br><br>

              <div class="hideOnAdd">
                  <h2>TIME & FREQUENCIES</h2>
                  Duration (ps): <input id="duration" type="number" name="duration">
                  Step (fs): <input id="timeStep" type="number" name="timeStep">
                  <br><br>Energy comp. frequency (steps): <input id="energyFrequency" type="number" name="energyFrequency">
                  <br><br>Thermostat frequency (steps): <input id="thermostatFrequency" type="number" name="thermostatFrequency">
                  <br><br>Render frequency (steps): <input id="renderFrequency" type="number" name="renderFrequency">

                  <br><br>
                  <h2>DATA SAMPLE & FILE OUTPUT</h2>
                  <button id="activeSampling" class="checkButton"></button> ACTIVATE
                  <br><br> Sample Mode:
                  <select id="sampleMode" name="sampleMode" width="100px">
                    <option value="energy">ENERGY</option>
                    <option value="trajectory">TRAJECTORY</option>
                  </select>
                  <i class="material-icons selectArrow">keyboard_arrow_down</i>

                  <br><br>Sample Frequency (steps): <input id="sampleFrequency" type="number" name="sampleFrequency"><br>
                  <br>Output name: <input id="outputName" type="text" name="outputName" value="data_out.dat"><br>
            </div>
            <br><br><br><br><br><br>
          </div>
        </div>
        <div id="analysisMenu">
            <i id="pinAnalysisMenu" class="material-icons">chevron_right</i>
            <table id="particlesInfo" cellspacing="0">
                <tr><th>ID</th><th>Type</th><th>Molecule</th><th>Mass</th><th>Charge</th></tr>
            </table>
            <i id="clearSelection" class="material-icons">delete</i>
            <table id="energyInfo" cellspacing="0"></table>
            <table id="structureInfo" cellspacing="0"></table>
        </div>
        <div id="settingsMenu">
          <div>
            <i id="pinSettingsMenu" class="material-icons">chevron_right</i>
            <h2>COLORS</h2>
            Background: <input id="backgroundColor" type="text" name="backgroundColor">
            <br><br>Type:
            <select id="typeSelection" name="typeSelection">
                <option value="CL">CL</option>
                <option value="SO">SO</option>
                <option value="C">C</option>
                <option value="H">H</option>
                <option value="L">L</option>
                <option value="N">N</option>
                <option value="O">O</option>
                <option value="P">P</option>
                <option value="Q">Q</option>
                <option value="S">S</option>
                <option value="X">X</option>
                <option value="Z">Z</option>
            </select>
            <i class="material-icons selectArrow">keyboard_arrow_down</i>
            <input id="typeColor" type="text" name="typeColor">

            <br><br>Residue:
            <select id="residueSelection" name="residueSelection">
                <option value="C">C</option>
                <option value="H">H</option>
                <option value="L">L</option>
                <option value="N">N</option>
                <option value="O">O</option>
                <option value="P">P</option>
                <option value="Q">Q</option>
                <option value="S">S</option>
                <option value="X">X</option>
                <option value="Z">Z</option>
            </select>
            <i class="material-icons selectArrow">keyboard_arrow_down</i>
            <input id="residueColor" type="text" name="residueColor">

            <br><br>Custom color: <input id="customColor" type="text" name="customColor">
            <br><br>Grid color: <input id="gridColor" type="text" name="gridColor">

            <h2>SCENE</h2>
            Far clip: <input id="farClip" type="number">
            Near clip: <input id="nearClip" type="number">
            <br><br>Projection mode:
            <select id="projectionMode">
                <option value="1">Perspective</option>
                <option value="0">Orthographic</option>
            </select>
            <i class="material-icons selectArrow">keyboard_arrow_down</i>
            <br><br>Perspective angle: <input id="perspectiveAngle" type="number">
            <br><br>Light mode:
            <select id="lightMode">
                <option value="0">Directional</option>
                <option value="1">Pointing</option>
            </select>
            <i class="material-icons selectArrow">keyboard_arrow_down</i>

            <h2>MATERIAL</h2>
            <br>Shininess: <input id="shininess" type="number">
            Ambient:  <input id="ambientColor" type="number">
            <br><br>Diffuse:  <input id="diffuseColor" type="number">
            Specular: <input id="specularColor" type="number">

            <input type="file" id="uploader" style="display:none">
            <a id="downloader"></a>

            <br><br><br><br><br><br>
          </div>
        </div>
        <div id="addMenu">
            <div>
                <i id="pinAddMenu" class="material-icons">chevron_right</i>

                <h2>ADD PARTICLES</h2>

                Number of particles to add: <input id="particlesToAdd" type="number" value="1"><br><br>

                <div class="addParticle" id="addWater">
                    <img id="water_img" class="particleImg" src="images/water.png">
                    <span>WATER</span>
                </div>

                <div class="addParticle", id="addOctane">
                    <img class="particleImg" src="images/octane.png">
                    <span>OCTANE</span>
                </div>

                <div class="addParticle", id="addLipid">
                    <img class="particleImg" src="images/lipid.png">
                    <span>LIPID</span>
                </div>

                <div class="addParticle", id="addMethane">
                    <img class="particleImg" src="images/methane.png">
                    <span>METHANE</span>
                </div>

                <div class="addParticle", id="addSodium">
                    <img class="particleImg" src="images/sodium.png">
                    <span>SODIUM</span>
                </div>



                <br>



                <div class="addParticle", id="addChloride">
                    <img class="particleImg" src="images/chloride.png">
                    <span>CHLORIDE</span>
                </div>

                <div class="addParticle", id="addDinitrogen">
                    <img class="particleImg" src="images/dinitrogen.png">
                    <span>N2</span>
                </div>

                <div class="addParticle", id="addDioxygen">
                    <img class="particleImg" src="images/dioxygen.png">
                    <span>O2</span>
                </div>



                <br>



                <div class="addParticle", id="addCarbon_dioxide">
                    <img class="particleImg" src="images/carbon_dioxide.png">
                    <span>CO2</span>
                </div>


            </div>
        </div>
        <div id="infoMenu">
            <div>
                <?php readfile($_POST['information']) ?>
            </div>
        </div>

        <canvas id="screen" width="800" height="600"></canvas>

        <div id="menu">
            <i id="pause" class="material-icons">pause</i>
            <i id="restart" class="material-icons">replay</i>
            <i id="recenter" class="material-icons">filter_center_focus</i>
            <i id="home" class="material-icons">home</i>
            <i id="worldIcon" class="material-icons">blur_on</i>
            <i id="analysis" class="material-icons">insert_chart</i>
            <i id="settings" class="material-icons">tune</i>
            <i id="add" class="material-icons">add</i>
            <i id="mouseMode" class="material-icons">pan_tool</i>
            <i id="snapshot" class="material-icons">photo_camera</i>
            <i id="goFull" class="material-icons">fullscreen</i>
            <i id="info" class="material-icons">info</i>
        </div>

        <div id="side"></div>
    </div>
</body>

<!-- FILES WITH THE SHADER CODE FOR 3D OBJECTS -->
<script id='SVertexShader' type='text/glsl'><?php readfile('shaders/SVertexShader.glsl') ?> /* SPHERE VERTEX SHADER */ </script>
<script id='SFragmentShader' type='text/glsl'><?php readfile('shaders/SFragmentShader.glsl') ?> /* SPHERE FRAGMENT SHADER */ </script>
<script id='BVertexShader' type='text/glsl'><?php readfile('shaders/BVertexShader.glsl') ?> /* BOND/CYLINDER VERTEX SHADER */ </script>
<script id='BFragmentShader' type='text/glsl'><?php readfile('shaders/BFragmentShader.glsl') ?> /* BOND/CYLINDER FRAGMENT SHADER */ </script>
<script id='LVertexShader' type='text/glsl'><?php readfile('shaders/LVertexShader.glsl') ?> /* LINE VERTEX SHADER */ </script>
<script id='LFragmentShader' type='text/glsl'><?php readfile('shaders/LFragmentShader.glsl') ?> /* LINE FRAGMENT SHADER */ </script>

<!-- FILES WITH THE SHADER CODE FOR GPU COMPUTING -->
<script id='CVertexShader' type='text/glsl'><?php readfile('shaders/CVertexShader.glsl') ?></script>
<script id='CFragmentShader0' type='text/glsl'><?php readfile('shaders/CFragmentShader0.glsl') ?></script>
<script id='CFragmentShader1' type='text/glsl'><?php readfile('shaders/CFragmentShader1.glsl') ?></script>
<script id='CFragmentShader2' type='text/glsl'><?php readfile('shaders/CFragmentShader2.glsl') ?></script>
<script id='CFragmentShader2_noex13' type='text/glsl'><?php readfile('shaders/CFragmentShader2_noex13.glsl') ?></script>
<script id='CFragmentShader3' type='text/glsl'><?php readfile('shaders/CFragmentShader3.glsl') ?></script>
<script id='CFragmentShader4' type='text/glsl'><?php readfile('shaders/CFragmentShader4.glsl') ?></script>
<script id='CFragmentShader5' type='text/glsl'><?php readfile('shaders/CFragmentShader5.glsl') ?></script>
<script id='CFragmentShader6' type='text/glsl'><?php readfile('shaders/CFragmentShader6.glsl') ?></script>
<script id='CFragmentShader7' type='text/glsl'><?php readfile('shaders/CFragmentShader7.glsl') ?></script>
<script id='CFragmentShader7_noex13' type='text/glsl'><?php readfile('shaders/CFragmentShader7_noex13.glsl') ?></script>
<script id='CFragmentShader8' type='text/glsl'><?php readfile('shaders/CFragmentShader8.glsl') ?></script>
<script id='CFragmentShader9' type='text/glsl'><?php readfile('shaders/CFragmentShader9.glsl') ?></script>

<!----------- LOAD CLASSES FILES ----------->
<script src='classes/atoms.js'></script>
<script src='classes/bonds.js'></script>
<script src='classes/elements.js'></script>
<script src='classes/fileReader.js'></script>
<script src='classes/forceField.js'></script>
<script src='classes/GPUcomputing.js'></script>
<script src='classes/lines.js'></script>
<script src='classes/particleSystem.js'></script>
<script src='classes/mouse.js'></script>
<script src='classes/scene.js'></script>
<script src='classes/view.js'></script>
<script src='classes/world.js'></script>

<!------------- LOAD LIBRARIES ------------->
<script src='libs/miscFuncs.js'></script>
<script src='libs/webGLfuncs.js'></script>

<!------------- LOAD DEFAULT FILES ------------->
<?php
    if($_POST["enableAdd"] == "true"){
        if($_POST["martine"] != "true"){
            # DEFAULT PARAMETERS
            echo "<script id='defaultPRM0' type='text/prm'>\n";
            readfile("files/parameters/par_all36_cgenff.prm");
            echo "</script>\n";
            echo "<script id='defaultPRM1' type='text/prm'>\n";
            readfile("files/parameters/toppar_water_ions_cgenff.str");
            echo "</script>\n";
            echo "<script id='defaultPRM2' type='text/str'>\n";
            readfile("files/parameters/toppar_all36_prot_heme.str");
            echo "</script>\n";

            # WATER FILES
            echo "<script id='waterPDB' type='text/pdb'>\n";
            readfile("files/pdbs/water.pdb");
            echo "</script>\n";
            echo "<script id='waterPSF' type='text/psf'>\n";
            readfile("files/psfs/water.psf");
            echo "</script>\n";

            # METHANE FILES
            echo "<script id='methanePDB' type='text/pdb'>\n";
            readfile("files/pdbs/methane.pdb");
            echo "</script>\n";
            echo "<script id='methanePSF' type='text/psf'>\n";
            readfile("files/psfs/methane.psf");
            echo "</script>\n";

            # SODIUM FILES
            echo "<script id='sodiumPDB' type='text/pdb'>\n";
            readfile("files/pdbs/sodium.pdb");
            echo "</script>\n";
            echo "<script id='sodiumPSF' type='text/psf'>\n";
            readfile("files/psfs/sodium.psf");
            echo "</script>\n";

            # CHLORIDE FILES
            echo "<script id='chloridePDB' type='text/pdb'>\n";
            readfile("files/pdbs/chloride.pdb");
            echo "</script>\n";
            echo "<script id='chloridePSF' type='text/psf'>\n";
            readfile("files/psfs/chloride.psf");
            echo "</script>\n";

            # DINITROGEN FILES
            echo "<script id='dinitrogenPDB' type='text/pdb'>\n";
            readfile("files/pdbs/dinitrogen.pdb");
            echo "</script>\n";
            echo "<script id='dinitrogenPSF' type='text/psf'>\n";
            readfile("files/psfs/dinitrogen.psf");
            echo "</script>\n";

            # DIOXYGEN FILES
            echo "<script id='dioxygenPDB' type='text/pdb'>\n";
            readfile("files/pdbs/dioxygen.pdb");
            echo "</script>\n";
            echo "<script id='dioxygenPSF' type='text/psf'>\n";
            readfile("files/psfs/dioxygen.psf");
            echo "</script>\n";

            # CARBON DIOXIDE FILES
            echo "<script id='carbon_dioxidePDB' type='text/pdb'>\n";
            readfile("files/pdbs/carbon_dioxide.pdb");
            echo "</script>\n";
            echo "<script id='carbon_dioxidePSF' type='text/psf'>\n";
            readfile("files/psfs/carbon_dioxide.psf");
            echo "</script>\n";
        }else{
            # DEFAULT PARAMETERS
            echo "<script id='defaultPRM0' type='text/prm'>\n";
            readfile("files/parameters/martini_oco_popc.prm");
            echo "</script>\n";
            echo "<script id='defaultPRM1' type='text/prm'>\n";
            echo "</script>\n";
            echo "<script id='defaultPRM2' type='text/prm'>\n";
            echo "</script>\n";

            # WATER FILES
            echo "<script id='waterPDB' type='text/pdb'>\n";
            readfile("files/pdbs/cg_water.pdb");
            echo "</script>\n";
            echo "<script id='waterPSF' type='text/psf'>\n";
            readfile("files/psfs/cg_water.psf");
            echo "</script>\n";

            echo "<script id='octanePDB' type='text/pdb'>\n";
            readfile("files/pdbs/cg_octane.pdb");
            echo "</script>\n";
            echo "<script id='octanePSF' type='text/psf'>\n";
            readfile("files/psfs/cg_octane.psf");
            echo "</script>\n";

            echo "<script id='lipidPDB' type='text/pdb'>\n";
            readfile("files/pdbs/cg_lipid.pdb");
            echo "</script>\n";
            echo "<script id='lipidPSF' type='text/psf'>\n";
            readfile("files/psfs/cg_lipid.psf");
            echo "</script>\n";
        }
    }
?>

<!-- Files containing the data necessary to simulate the molecules being used -->
<script id='pdb' type='text/pdb'><?php readfile($_POST["pdb"])?></script>
<script id='psf' type='text/psf'><?php readfile($_POST["psf"])?></script>
<script id='prm0' type='text/psf'><?php readfile($_POST["prm0"])?></script>
<script id='prm1' type='text/psf'><?php readfile($_POST["prm1"])?></script>
<script id='prm2' type='text/psf'><?php readfile($_POST["prm2"])?></script>

<script>
    /* ######################### PROGRAM STARTS HERE ###########################
     * Intialize the program. Creates the WORLD and VIEW objects and set the world
     * initial settings to the ones passed from the inial page via PHP Post variables */

    var w = new World();
    var v = new view(w);

    /* Fires the color clock that is display while the program is loading */
    var colorClock = function(){
        var str = "rgba(" + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ", 1)";
        v.loadingMessage.style.color = str;
        v.loadingIcon.style.color = str;
    }
    window.setInterval(colorClock, 250);

    window.onload = function(){

        /* Link the view object created to the world view propertie */
        w.view = v;

        /* Set the world properties to the PHP Post variables */
        w.constants.boostFactor = parseInt("<?php echo $_POST['boostFactor'] ?>");
        w.constants.timeStep = parseInt("<?php echo $_POST['timeStep'] ?>");
        w.maxSteps = parseInt("<?php echo $_POST['maxSteps'] ?>");
        w.temperature0 = parseFloat("<?php echo $_POST['temperature'] ?>");
        w.exec_thermostat = parseInt("<?php echo $_POST['thermostat'] ?>");
        w.energyTempFrequency = parseFloat("<?php echo $_POST['energyFrequency'] ?>");
        w.thermostatFrequency = parseFloat("<?php echo $_POST['thermostatFrequency'] ?>");
        w.renderFrequency = parseFloat("<?php echo $_POST['renderFrequency'] ?>")*w.constants.boostFactor;
        w.view.mouse.mode = "<?php echo $_POST['mouseMode'] ?>";
        w.drawingMode = "<?php echo $_POST['drawingMode'] ?>";
        w.colorMode = "<?php echo $_POST['colorMode'] ?>" ;
        w.atomResolution = parseInt("<?php echo $_POST['atomResolution'] ?>");
        w.bondResolution = parseInt("<?php echo $_POST['bondResolution'] ?>");
        w.size0 = "<?php echo $_POST['worldSize'] ?>";
        w.exclude13 = parseInt("<?php echo $_POST['exclude13'] ?>");
        w.constants.epsolonR = parseFloat("<?php echo $_POST['epsolonR'] ?>");

        if("<?php echo $_POST['enableAdd'] ?>" == "true") w.view.isAddEnabled = true;
        if("<?php echo $_POST['martine'] ?>" == "true") w.isMartine = true;
        if("<?php echo $_POST['visualize'] ?>" == "true") w.vizualizationMode = true;

        /* Function that will be executed when leaving or reloading the page.
         * Free the memory */
        window.onbeforeunload = function(){
                                              delete w.data;
                                              delete v;
                                              delete w;
                                          };

        /* Countdown of 50 ms that will start the program */
        setTimeout(function(){w.setup();}, 50);
    };
</script>

<?php
    /* Deletes the temporary files created in the beggining */
    if($_POST["createpsf"] == "true"){
        shell_exec("rm ./buildPSF/temp.pdb");
        shell_exec("rm " . $_POST["pdb"]);
        shell_exec("rm " . $_POST["psf"]);
        $_POST["createpsf"] == "false";
    }
?>

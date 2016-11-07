<head>
    <title>Angstrom</title>
    <link href= 'style/fonts/Poiret_One.css' rel="stylesheet" />
    <link href= 'style/fonts/Noto_Sans.css' rel="stylesheet" />
    <link href= 'style/material-icons/material-icons.css' rel="stylesheet" />
    <link href= 'style/visualize.css' rel='stylesheet' type="text/css" />
    <link href= 'style/header.css' rel='stylesheet' type="text/css" />
</head>

<body>

    <div id="header">
      <div id="background"></div>
      <a href="index.html"><img id="logo" src="images/logo.png"></a>
      <div id="menu">
          <b> <a href="">ABOUT</a> | <a href="">TUTORIALS</a> | <a href="">DOCUMENTATION</a> | <a href="">GITHUB</a> </b>
      </div>
    </div>

    <div id="container">
        <h3>UPLOAD FROM RCSB PROTEIN DATA BANK</h3>
        <div id="submission">
            <form id="form1" action="application.php" method="post">

                <input id="createpsf" type="hidden" name="createpsf" value="false">
                <input id="pdbfile" type="hidden" name="pdb">
                <input id="psffile" type="hidden" name="psf">
                <input id="prmfile0" type="hidden" name="prm0">
                <input id="prmfile1" type="hidden" name="prm1">
                <input id="prmfile2" type="hidden" name="prm2">
                <input id="information" type="hidden" name="information" value="files/information/default.html">

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

                <br><br>URL/PDB ID:<input id="pdburl" type="text" name="url">
                <button id="upload">LOAD</button>
                <br><i id="loadingIcon"class="material-icons">alarm</i>
            </form>
        </div>

        <h3>PRESETS</h3>
        <!-- See simulate.php for example -->

        <div class="item">
            <img id="benzene" class="itemImg" src="images/benzene.png">
            <h2>Benzene</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Component of gasoline. C6H6.
                </p>
            </div>
            <p class="itemRecommendation">12 ATOMS</p>
            <a class="itemLink" target="_blank" href="https://en.wikipedia.org/wiki/Benzene">WIKIPEDIA</a>
        </div>

        <div class="item">
            <img id="cholesterol" class="itemImg" src="images/cholesterol.png">
            <h2>Cholesterol</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    A major component of cell membranes. C27H46O.
                </p>
            </div>
            <p class="itemRecommendation">74 ATOMS</p>
            <a class="itemLink" target="_blank" href="https://en.wikipedia.org/wiki/Cholesterol">WIKIPEDIA</a>
        </div>

        <div class="item">
            <img id="glucose" class="itemImg" src="images/glucose.png">
            <h2>Glucose</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Common sugar in blood. High fructose in corn syrup. C6H12O6.
                </p>
            </div>
            <p class="itemRecommendation">24 ATOMS</p>
            <a class="itemLink" target="_blank" href="https://en.wikipedia.org/wiki/Glucose">WIKIPEDIA</a>
        </div>

        <div class="item">
            <img id="glutamate" class="itemImg" src="images/glutamate.png">
            <h2>Glutamate</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    An amino acid, one of the twenty amino acids used to construct proteins. In the nervous system it plays a special additional role as a neurotransmitter.
                </p>
            </div>
            <p class="itemRecommendation">18 ATOMS</p>
            <a class="itemLink" target="_blank" href="https://en.wikipedia.org/wiki/Glutamate_(neurotransmitter)">WIKIPEDIA</a>
        </div>

        <div class="item">
            <img id="triolein" class="itemImg" src="images/triolein.png">
            <h2>Triolein</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    A major component of olive oil. Triglyeride of oleic acid.
                </p>
            </div>
            <p class="itemRecommendation">167 ATOMS</p>
            <a class="itemLink" target="_blank" href="https://en.wikipedia.org/wiki/Triolein">WIKIPEDIA</a>
        </div>

        <div class="item" id="graphene" style="display: none;">
            <img class="itemImg" src="images/graphene.png">
            <h2>Graphene</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    A thin layer of pure carbon. Looks like hexagonal honeycomb. This one is surrounded by water and has a small protein above it.
                </p>
            </div>
            <p class="itemRecommendation">Small</p>
            <a class="itemLink" target="_blank" href="">PDB.org</a>
        </div>

        <div class="item">
            <img id="2y9j" class="itemImg" src="images/2y9j.png">
            <h2>2Y9J</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Three-dimensional model of Salmonella's needle complex at subnanometer resolution.
                </p>
            </div>
            <p class="itemRecommendation">142 848 ATOMS</p>
            <a class="itemLink" target="_blank" href="http://www.rcsb.org/pdb/explore/explore.do?structureId=2y9j">RCSB.org</a>
        </div>


        <div class="item">
            <img id="5ire" class="itemImg" src="images/5ire.png">
            <h2>5IRE</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    The cryo-EM structure of Zika Virus capsule.
                </p>
            </div>
            <p class="itemRecommendation">26 385 ATOMS</p>
            <a class="itemLink" target="_blank" href="http://www.rcsb.org/pdb/explore/explore.do?structureId=5IRE">RCSB.org</a>
        </div>


        <div class="item">
            <img id="5jb1" class="itemImg" src="images/5jb1.png">
            <h2>5JB1</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    Pseudo-atomic structure of Human Papillomavirus Type 59 L1 Virus-like particle.
                </p>
            </div>
            <p class="itemRecommendation">42 851 ATOMS</p>
            <a class="itemLink" target="_blank" href="http://www.rcsb.org/pdb/explore/explore.do?structureId=5jb1">RCSB.org</a>
        </div>


        <div class="item">
            <img  id="ubq" class="itemImg" src="images/ubq.png">
            <h2>Ubiquitin</h2>
            <div class="information">
                <br>
                <p class="itemDescription">
                    A small regulatory protein that has been found in almost all tissues of eukaryotic organisms.
                </p>
            </div>
            <p class="itemRecommendation">1 231 ATOMS</p>
            <a class="itemLink" target="_blank" href="https://en.wikipedia.org/wiki/Ubiquitin">WIKIPEDIA</a>
        </div>

    <script>
        var pdb = document.getElementById("pdbfile");           // Required
        var psf = document.getElementById("psffile");           // Required
        var prm0 = document.getElementById("prmfile0");         // Required
        var prm1 = document.getElementById("prmfile1");         // Optional
        var prm2 = document.getElementById("prmfile2");         // Optional

        var form = document.getElementById("form1");

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

        var colorClock = function(){
            document.getElementById("loadingIcon").style.color = "rgba(" + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ", 1)";
        }

        window.onpageshow = function(){
            document.getElementById("loadingIcon").style.display = "none";
            drawingMode.value = "bas";
            colorMode.value = "atoms";
            atomResolution.value = "10";
            bondResolution.value = "10";
            worldSize.value = "auto"
        }
        form1.onsubmit = function(){
            colorClock();
            window.setInterval(colorClock, 250);
            document.getElementById("loadingIcon").style.display = "inline-block";
            pdb.value = document.getElementById("pdburl").value
            document.getElementById("createpsf").value = "true";
        }

        document.getElementById("benzene").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/benzene.pdb";
            psf.value = "files/psfs/visualize_defaults/benzene.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            drawingMode.value = "bas";
            colorMode.value = "atoms";
            atomResolution.value = "25";
            bondResolution.value = "25";
            form.submit();
        }

        document.getElementById("cholesterol").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/cholesterol.pdb";
            psf.value = "files/psfs/visualize_defaults/cholesterol.psf";
            prm0.value = "files/parameters/par_all36_lipid.prm";
            drawingMode.value = "bas";
            colorMode.value = "atoms";
            atomResolution.value = "25";
            bondResolution.value = "25";
            form.submit();
        }

        document.getElementById("glucose").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/glucose.pdb";
            psf.value = "files/psfs/visualize_defaults/glucose.psf";
            prm0.value = "files/parameters/par_all36_carb.prm";
            drawingMode.value = "licorice";
            colorMode.value = "atoms";
            atomResolution.value = "25";
            bondResolution.value = "25";
            form.submit();
        }

        document.getElementById("glutamate").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/glutamate.pdb";
            psf.value = "files/psfs/visualize_defaults/glutamate.psf";
            prm0.value = "files/parameters/par_all36_prot.prm";
            drawingMode.value = "bas";
            colorMode.value = "atoms";
            atomResolution.value = "25";
            bondResolution.value = "25";
            form.submit();
        }

        document.getElementById("triolein").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/triolein.pdb";
            psf.value = "files/psfs/visualize_defaults/triolein.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            drawingMode.value = "licorice";
            colorMode.value = "atoms";
            atomResolution.value = "25";
            bondResolution.value = "25";
            form.submit();
        }

        document.getElementById("graphene").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/graphene.pdb";
            psf.value = "files/psfs/visualize_defaults/graphene.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            prm1.value = "files/parameters/par_all36_prot.prm";
            prm2.value = "files/parameters/toppar_water_ions_cgenff.str";
            form.submit();
        }

        document.getElementById("2y9j").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/2y9j.pdb";
            psf.value = "files/psfs/visualize_defaults/2y9j.psf";
            prm0.value = "files/parameters/par_all27_prot_lipid.prm";
            drawingMode.value = "bonds";
            colorMode.value = "single";
            atomResolution.value = "5";
            bondResolution.value = "7";
            form.submit();
        }

        document.getElementById("5ire").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/5ire.pdb";
            psf.value = "files/psfs/visualize_defaults/5ire.psf";
            prm0.value = "files/parameters/par_all27_prot_lipid.prm";
            drawingMode.value = "vdw";
            colorMode.value = "residuals";
            atomResolution.value = "8";
            bondResolution.value = "5";
            form.submit();
        }

        document.getElementById("5jb1").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/5jb1.pdb";
            psf.value = "files/psfs/visualize_defaults/5jb1.psf";
            prm0.value = "files/parameters/par_all27_prot_lipid.prm";
            drawingMode.value = "vdw";
            colorMode.value = "residuals";
            atomResolution.value = "8";
            bondResolution.value = "5";
            form.submit();
        }

        document.getElementById("ubq").onclick = function(){
            pdb.value = "files/pdbs/visualize_defaults/ubq.pdb";
            psf.value = "files/psfs/visualize_defaults/ubq.psf";
            prm0.value = "files/parameters/par_all36_cgenff.prm";
            drawingMode.value = "bas";
            colorMode.value = "residuals";
            atomResolution.value = "20";
            bondResolution.value = "20";
            form.submit();
        }

        window.onload = function(){
            document.body.style.visibility = 'visible';
        }

    </script>

</body>

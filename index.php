<head>
    <title>Angstrom</title>
    <link href="https://fonts.googleapis.com/css?family=Poiret+One" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
    <link href='style/header.css' rel='stylesheet' type="text/css">
    <link href='style/index.css' rel='stylesheet' type="text/css">
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

        <div id="presenting">

            <a href="simulate.php">
            <div id="simulate" class="gotoButton">
                    <i class="material-icons">play_circle_outline</i>
                    <h3>Start a simulation!</h3>
            </div>
            </a>

            <br>

            <a href="visualize.php">
            <div id="visualize" class="gotoButton">
                    <i class="material-icons">zoom_in</i>
                    <h3>Vizualize a molecule!</h3>
            </div>
            </a>

            <br>

            <a href="administration.txt">
            <div id="download" class="gotoButton">
                    <i class="material-icons">file_download</i>
                    <h3>Download</h3>
            </div>
            </a>

        </div>

        <div id="description">
            <img src="images/index01.png" height="200"/>
            <div>
                Were you curious to know how things work in the nano scale? Now you can, and even better than
                the nano scale, in the angstrom scale. Angstrom is a free and open source platform that makes
                molecular dynamcics easy. With it you can simulate and visualize sets of molecules and atoms in
                real time with features that allows you to configure and see what is going on in the simulation.
            </div>
        </div>

        <div id="features">

            <h4>MULTI-PLATFORM</h4><br>
            <div class="featureBox">
                <i class="material-icons">cloud</i><br>
                <b>CLOUD</b><br>
                Chrome<br>
                Firefox<br>
                Safari<br>
            </div>

            <div class="featureBox">
                <i class="material-icons">desktop_windows</i><br>
                <b>DESKTOP</b><br>
                Linux<br>
                Windows<br>
                Mac<br>
            </div>

            <div class="featureBox" id="mobilePlatDiv">
                <i class="material-icons">smartphone</i><br>
                <b>MOBILE</b><br>
                (Coming soon)<br>
                Android<br>
                iOS
            </div>

        </div>

    </div>


</body>

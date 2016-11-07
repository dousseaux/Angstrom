const fs = require("fs");
var paramaters = getUrlVars();

fs.readFile(__dirname + "/../shaders/SVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('SVertexShader').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/SFragmentShader.glsl", "utf-8", function(err, data) {
    document.getElementById('SFragmentShader').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/BVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('BVertexShader').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/BFragmentShader.glsl", "utf-8", function(err, data) {
    document.getElementById('BFragmentShader').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/LVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('LVertexShader').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/LFragmentShader.glsl", "utf-8", function(err, data) {
    document.getElementById('LFragmentShader').innerHTML = data;
});

/* ########## FILES WITH THE SHADER CODE FOR GPU COMPUTING #############*/
fs.readFile(__dirname + "/../shaders/CVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('CVertexShader').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader0.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader0').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader1.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader1').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader2.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader2').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader3.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader3').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader4.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader4').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader5.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader5').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader6.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader6').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader7.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader7').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader8.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader8').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader9.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader9').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader2_noex13.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader2_noex13').innerHTML = data;
});
fs.readFile(__dirname + "/../shaders/CFragmentShader7_noex13.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader7_noex13').innerHTML = data;
});

if (paramaters["enableAdd"] == "true"){
    if (paramaters["martine"] != "true") {
        fs.readFile(__dirname + '/../files/parameters/par_all36_cgenff.prm', "utf-8", function(err, data) {
            if (err == null) document.getElementById('defaultPRM0').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/parameters/toppar_water_ions_cgenff.str', "utf-8", function(err, data) {
            if (err == null) document.getElementById('defaultPRM1').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/parameters/toppar_all36_prot_heme.str', "utf-8", function(err, data) {
            if (err == null) document.getElementById('defaultPRM2').innerHTML = data;
        });

        fs.readFile(__dirname + '/../files/pdbs/water.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('waterPDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/water.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('waterPSF').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/pdbs/methane.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('methanePDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/methane.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('methanePSF').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/pdbs/sodium.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('sodiumPDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/sodium.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('sodiumPSF').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/pdbs/chloride.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('chloridePDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/chloride.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('chloridePSF').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/pdbs/dinitrogen.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('dinitrogenPDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/dinitrogen.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('dinitrogenPSF').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/pdbs/dioxygen.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('dioxygenPDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/dioxygen.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('dioxygenPSF').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/pdbs/carbon_dioxide.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('carbon_dioxidePDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/carbon_dioxide.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('carbon_dioxidePSF').innerHTML = data;
        });
    } else {
        fs.readFile(__dirname + '/../files/parameters/martini_oco_popc.prm', "utf-8", function(err, data) {
            if (err == null) document.getElementById('defaultPRM0').innerHTML = data;
        });

        fs.readFile(__dirname + '/../files/pdbs/cg_water.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('waterPDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/cg_water.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('waterPSF').innerHTML = data;
        });

        fs.readFile(__dirname + '/../files/pdbs/cg_octane.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('octanePDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/cg_octane.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('octanePSF').innerHTML = data;
        });

        fs.readFile(__dirname + '/../files/pdbs/cg_lipid.pdb', "utf-8", function(err, data) {
            if (err == null) document.getElementById('lipidPDB').innerHTML = data;
        });
        fs.readFile(__dirname + '/../files/psfs/cg_lipid.psf', "utf-8", function(err, data) {
            if (err == null) document.getElementById('lipidPSF').innerHTML = data;
        });
    }
}else{
    paramaters["pdb"] = paramaters["pdb"].replace(/%2F/g, '/');
    paramaters["psf"] = paramaters["psf"].replace(/%2F/g, '/');
    paramaters["prm0"] = paramaters["prm0"].replace(/%2F/g, '/');
    paramaters["prm1"] = paramaters["prm1"].replace(/%2F/g, '/');
    paramaters["prm2"] = paramaters["prm2"].replace(/%2F/g, '/');
    /* Files containing the data necessary to simulate the molecules being used */
    if (paramaters["pdb"][0] != '/') {
        fs.readFile(__dirname + "/../" + paramaters["pdb"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('pdb').innerHTML = data;
        });
    } else {
        fs.readFile(paramaters["pdb"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('pdb').innerHTML = data;
        });
    }

    if (paramaters["psf"][0] != '/') {
        fs.readFile(__dirname + "/../" + paramaters["psf"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('psf').innerHTML = data;
        });
    } else {
        fs.readFile(paramaters["psf"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('psf').innerHTML = data;
        });
    }

    if (paramaters["prm0"][0] != '/') {
        fs.readFile(__dirname + "/../" + paramaters["prm0"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('prm0').innerHTML = data;
        });
    } else {
        fs.readFile(paramaters["prm0"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('prm0').innerHTML = data;
        });
    }

    if (paramaters["prm1"][0] != '/') {
        fs.readFile(__dirname + "/../" + paramaters["prm1"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('prm1').innerHTML = data;
        });
    } else {
        fs.readFile(paramaters["prm1"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('prm1').innerHTML = data;
        });
    }

    if (paramaters["prm2"][0] != '/') {
        fs.readFile(__dirname + "/../" + paramaters["prm2"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('prm2').innerHTML = data;
        });
    } else {
        fs.readFile(paramaters["prm2"], "utf-8", function(err, data) {
            if (err == null) document.getElementById('prm2').innerHTML = data;
        });
    }
}


paramaters["information"] = paramaters["information"].replace(/%2F/g, '/');
fs.readFile(__dirname + "/../" + paramaters["information"], "utf-8", function(err, data) {
    if (err == null) document.getElementById('infoMenu').innerHTML = "<div>" + data + "</div>";
});

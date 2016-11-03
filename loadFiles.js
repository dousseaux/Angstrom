const fs = require("fs");

fs.readFile("shaders/SVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('SVertexShader').innerHTML = data;
});
fs.readFile("shaders/SFragmentShader.glsl", "utf-8", function(err, data) {
    document.getElementById('SFragmentShader').innerHTML = data;
});
fs.readFile("shaders/BVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('BVertexShader').innerHTML = data;
});
fs.readFile("shaders/BFragmentShader.glsl", "utf-8", function(err, data) {
    document.getElementById('BFragmentShader').innerHTML = data;
});
fs.readFile("shaders/LVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('LVertexShader').innerHTML = data;
});
fs.readFile("shaders/LFragmentShader.glsl", "utf-8", function(err, data) {
    document.getElementById('LFragmentShader').innerHTML = data;
});

/* ########## FILES WITH THE SHADER CODE FOR GPU COMPUTING #############*/
fs.readFile("shaders/CVertexShader.glsl", "utf-8", function(err, data) {
    document.getElementById('CVertexShader').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader0.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader0').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader1.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader1').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader2.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader2').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader3.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader3').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader4.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader4').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader5.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader5').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader6.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader6').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader7.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader7').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader8.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader8').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader9.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader9').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader2_noex13.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader2_noex13').innerHTML = data;
});
fs.readFile("shaders/CFragmentShader7_noex13.glsl", "utf-8", function(err, data) {
    document.getElementById('CFragmentShader7_noex13').innerHTML = data;
});

var paramaters = getUrlVars();

paramaters["pdb"] = 'files/pdbs/' + paramaters["pdb"];
paramaters["psf"] = 'files/psfs/' + paramaters["psf"];
paramaters["prm0"] = 'files/parameters/' + paramaters["prm0"];
paramaters["prm1"] = 'files/parameters/' + paramaters["prm1"];
paramaters["prm2"] = 'files/parameters/' + paramaters["prm2"];


/* Files containing the data necessary to simulate the molecules being used */
fs.readFile(paramaters["pdb"], "utf-8", function(err, data) {
    document.getElementById('pdb').innerHTML = data;
});
fs.readFile(paramaters["psf"], "utf-8", function(err, data) {
    document.getElementById('psf').innerHTML = data;
});
fs.readFile(paramaters["prm0"], "utf-8", function(err, data) {
    document.getElementById('prm0').innerHTML = data;
});
fs.readFile(paramaters["prm1"], "utf-8", function(err, data) {
    document.getElementById('prm1').innerHTML = data;
});
fs.readFile(paramaters["prm2"], "utf-8", function(err, data) {
    document.getElementById('prm2').innerHTML = data;
});

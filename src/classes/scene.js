var scene = function(gl, canvas) {

    this.gl = gl;
    this.canvas = canvas;

    this.aspect = canvas.width / canvas.height;

    // INTIALIZE PROJECTION MATRIX
    projectionMatrix(this);
    // INTIALIZE VIEW MATRIX
    viewMatrix(this);

    // ENABLE DEPTH
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

scene.prototype = {

    gl: null,
    canvas: null,

    // MATRICES
    projectionMatrix: [],
    viewMatrix: [],
    viewMatrix0: [],

    // SET PROJECTION MODE
    projectionMode: 1,

    // PERSPECTIVE VIEW PARAMETERS
    fov: 45,
    aspect: null,
    far: 40,
    near: 0.1,

    // ORTHOGRAPHIC VIEW PARAMETERS
    bottom: -8,
    top: 8,
    left: -8,
    right: 8,

    // VIEW PARAMETERS
    camera: {
        x: 0,
        y: 0,
        z: 10
    },
    look: {
        x: 0,
        y: 0,
        z: 0
    },
    up: {
        x: 0,
        y: 1,
        z: 0
    },

    // LIGHT PARAMETERS
    light: [4, -3, -5],
    lightmode: 0,

    backgroundColor: [0.07, 0.07, 0.15, 1.0],

    updateCamera: function() {
        viewMatrix(this)
    },

    updateProjection: function() {
        projectionMatrix(this)
    },

    draw: function() {
        initViewport(this.gl, this.canvas);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
    },
}

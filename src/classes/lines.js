// -------------------------------------- LINES CLASS ---------------------------------
var lines = function(scene, positions, shader, color, thickness){
    // VARIABLES
    this.gl = scene.gl;
    this.shader = shader;
    this.scene = scene;

    this.positions = new Float32Array(positions);
    this.color = color;
    this.thickness = thickness;

    // BUFFERS
    var vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);

    // SET SHADER ATTRIBUTES POINTERS
    var vertexAttribute = this.gl.getAttribLocation(this.shader, "vertexPos");

    // SET SHADER UNIFORMS POINTERS
    var projectionMatrixUniform = this.gl.getUniformLocation(this.shader, "projectionMatrix");
    var viewMatrixUniform = this.gl.getUniformLocation(this.shader, "viewMatrix");
    var colorUniform = this.gl.getUniformLocation(this.shader, "color");

    this.draw =  function() {
        // SET SHADER
        this.gl.useProgram(this.shader);

        // LINK SHADER UNIFORMS WITH OBJECT VARIABLES
        this.gl.uniformMatrix4fv(viewMatrixUniform, false, scene.viewMatrix);                   // VIW MATRIX
        this.gl.uniformMatrix4fv(projectionMatrixUniform, false, this.scene.projectionMatrix);  // PROJECTION
        this.gl.uniform4fv(colorUniform, this.color);                                           // COLOR

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.vertexAttribPointer(vertexAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vertexAttribute);
        this.scene.gl.lineWidth(this.thickness);
        this.gl.drawArrays(this.gl.LINES, 0, this.positions.length/4);
    }
}

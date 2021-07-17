// Clase que dibuja la caja alrededor de la escena
class BoxDrawer {
    pink = [1, 0.8, 0.9, 1.0];
    green = [0.3, 0.6, 0.3, 1.0];
    orange = [1, 0.5, 0, 1.0];
    gold = [1, 0.92, 0, 1.0];
    tomato = [1, 0.35, 0.29, 1.0];
    grey = [0.6, 0.6, 0.6, 1.0];
    black = [0, 0, 0, 1.0];

    constructor() {
        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(boxVS, boxFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        // 4. Creamos el buffer para los vertices
        this.vertbuffer = gl.createBuffer();

        // 8 caras del cubo unitario
        var pos = [
            -1, -1, -1,
            -1, -1, 1,
            -1, 1, -1,
            -1, 1, 1,
            1, -1, -1,
            1, -1, 1,
            1, 1, -1,
            1, 1, 1];
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        // Conectividad de las lineas
        this.linebuffer = gl.createBuffer();
        this.lines = [
            0, 1, 1, 3, 3, 2, 2, 0,
            4, 5, 5, 7, 7, 6, 6, 4,
            0, 4, 1, 5, 3, 7, 2, 6];
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.linebuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.lines), gl.STATIC_DRAW);

        this.coloursBuffer = gl.createBuffer();
        this.colours = this.pink
            .concat(this.pink)
            .concat(this.gold)
            .concat(this.gold)
            .concat(this.black)
            .concat(this.black)
            .concat(this.black)
            .concat(this.black);

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.coloursBuffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.colours),
            gl.STATIC_DRAW);
    }

    // Esta función se llama para dibujar la caja
    draw(trans) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, trans);

        let c = gl.getAttribLocation(this.prog, 'clr');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coloursBuffer);
        gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(c);

        // 3.Binding del buffer de posiciones
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);

        // 4. Habilitamos el atributo
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.linebuffer);

        // 5. Dibujamos
        gl.drawElements(gl.LINES, this.lines.length, gl.UNSIGNED_BYTE, 0);
    }
}

// Vertex shader 
var boxVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	attribute vec4 clr;
	varying vec4 vcolor;
	
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
		vcolor = clr;
	}
`;

// Fragment shader 
var boxFS = `
	precision mediump float;
	varying vec4 vcolor;
	
	void main()
	{
		gl_FragColor = vcolor;
	}
`;

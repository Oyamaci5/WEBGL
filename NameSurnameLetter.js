"use strict";
var canvas ;
var gl;
//ATTRIBUTES
var vertexColors = [];
var vertexColorsForSlider = [
     (0.0, 0.0, 0.0, 0.0) ,  // black
     (1.0, 0.0, 0.0, 0.0) ,  // red
     (1.0, 1.0, 0.0, 1.0) ,  // yellow
     (0.0, 1.0, 0.0, 1.0) ,  // green
     (0.0, 0.0, 1.0, 1.0) ,  // blue
     (1.0, 0.0, 1.0, 0.0) ,  // magenta
     (0.0, 1.0, 1.0, 0.0)    // cyan
];
var vertexDefaultColor = [1.0,1.0,0.5,1.0];
var vertices =new Float32Array([0.5,-.5,
                                0.6,-.5,
                                0.6,0,
                                0.9,.5,
                                0.8,.5,
                                0.55,0.1,
                                0.3,.5,
                                0.2,.5,
                                0.5,0]);

const indices = [0,1,2,
                 0,2,8,
                 2,4,3,
                 8,2,4,
                 2,8,7,
                 2,6,7];
var i = 0;
//PROGRAMS
var n;
var programY;
var program;
//POSITION FOR SHAPES
var vPosition;
var rPosition;
//BUFFER FOR SHAPES
var bufferId;
var bufferId1;
var indexBuffer;
//COLOR ELEMENTS
var ColorBuffer;
var ColorPosition;
//TRANSLATION ELEMENTS
var translationLocation;
var translationLocationY;
var translation = [0,0];
var translation1 = [0,0];
//ROTATION ELEMENTS
var rotationLocY;
var rotationLoc;
var rotation = [0,1];
var rotationY = [0,1];
//SCALING ELEMENTS
var scaleLocY;
var scaleLoc;
var scaleY = [1,1];
var scaleO = [1,1];
//Resolution Elements
var resolutionLocation;
var resolutionLocationY;
//ALL VERTEX AND FRAGMENT ELEMENT
var vertShdr;
var fragShdr;
var vertShdrY;
var fragShdrY;
var vertElem;
var vertElemY;
var fragElem;
var fragElemY;
function main(){
    //ASSIGNING CANVAS WITH MYCANVAS
    canvas = document.getElementById("Mycanvas");
    gl = WebGLUtils.setupWebGL( canvas );
	//CHECKING THE GL IF ITS AVAILABLE OR NOT
	if(!gl){
		alert("Unable to initialize WebGL");
		return;
	}
    //CANVAS COLOR FOR BLACK
	gl.clearColor(0.0,0.0,0.0,1.0);
	//CLEAR THE COLOR BUFFER
	gl.clear(gl.COLOR_BUFFER_BIT);
    
    //Vertex Element Check
	vertElem = document.getElementById("vertex-shader");
    vertElemY = document.getElementById("vertex-shaderY");
	if( !vertElem && !vertElemY){
		alert("Unable to load");
		return -1;
	}
	else{
        //Shader Assign
        vertShdrY = gl.createShader(gl.VERTEX_SHADER);
		vertShdr = gl.createShader(gl.VERTEX_SHADER);
        //Shader Source assign
		gl.shaderSource(vertShdr,vertElem.text);
        gl.shaderSource(vertShdrY,vertElemY.text);
		//Compiling Shader
        gl.compileShader(vertShdr);
        gl.compileShader(vertShdrY);

		if( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) && !gl.getShaderParameter(vertShdrY,gl.COMPILE_STATUS)){
			alert("Vertex failed to compile");
			return -1;
		}
	}
    //Fragment Element get
    fragElemY = document.getElementById("fragment-shaderY");
    fragElem = document.getElementById("fragment-shader");
    if(!fragElem && !fragElemY){
        alert("Unable to load frag element");
        return -1;
    }

    else{
        //CREATING FRAGMENT SHADERS
        fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
        fragShdrY = gl.createShader(gl.FRAGMENT_SHADER);
        //SHADERS SOURCE
        gl.shaderSource( fragShdr, fragElem.text);
        gl.shaderSource( fragShdrY,fragElemY.text);
        //COMPILING SHADERS
        gl.compileShader(fragShdr);
        gl.compileShader(fragShdrY)
        if(!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)){
            alert("Fragment shader failed to compile");
            return -1;
        }
    }

    //Program create FOR Y
    programY = gl.createProgram();
    gl.attachShader( programY, vertShdrY);
    gl.attachShader( programY, fragShdrY);
    gl.linkProgram( programY);
    //Program create FOR O
    program = gl.createProgram();
    gl.attachShader( program, vertShdr);
    gl.attachShader( program, fragShdr);
    gl.linkProgram( program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)&&!gl.getProgramParameter(programY,gl.LINK_STATUS)){
        alert("Shader program failed to link");
        return -1 ;
    }
    //Buffer for Y
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //INDEX BUFFER
    indexBuffer =gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    rPosition = gl.getAttribLocation( programY, "rPosition");
      //TRANSLATION BUFFER
    translationLocationY = gl.getUniformLocation(programY,"Y_translation");
    rotationLocY = gl.getUniformLocation(programY,"Y_rotation");
    scaleLocY = gl.getUniformLocation(programY,"Y_scale");

    
    //O indices
    var vertices1 =[];
    var vert2;
    var vert1;
    var vertCount = 2;
    for(var i = 0;i<=360;i+=1){
        var j=i*Math.PI/180;
        vert1 = [(Math.sin(j)*0.5)-.25,
        Math.cos(j)*0.5];
        
    
        vert2 = [((Math.sin(j)*0.4)-.25),
        Math.cos(j)*0.4];

        vertices1 = vertices1.concat(vert1);
        vertices1 = vertices1.concat(vert2); 
        
    }
    n = vertices1.length/vertCount;
    changeColor();
    //Buffer for O
    bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices1),gl.STATIC_DRAW);
    vPosition = gl.getAttribLocation(program,"vPosition");
    //COLOR BUFFER
    ColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexColors),gl.STATIC_DRAW);
    //TRANSLATION BUFFER
    translationLocation = gl.getUniformLocation(program,"u_translation");
    rotationLoc = gl.getUniformLocation(program,"u_rotation");
    scaleLoc = gl.getUniformLocation(program,"u_scale");
    render(n);
    //ALL SLIDER SEGMENT
    document.getElementById("COLOR").onchange = function(event){
        vertexColors = [];
        switch(event.target.value){
            case "0":
                vertexDefaultColor = [1.0,0.0,0.0,1.0];//red
                break;
            case "1":
                vertexDefaultColor = [1.0, 1.0, 0.0, 0.0];//yellow
                break;
            case "2":
                vertexDefaultColor = [0.0, 1.0, 0.0, 1.0];//green
                break;
            case "3":
                vertexDefaultColor = [0.0, 0.0, 1.0, 1.0];//blue
                break;
            case "4":
                vertexDefaultColor = [1.0, 0.0, 1.0, 1.0];//magenta
                break;
            case "5":
                vertexDefaultColor = [0.0, 1.0, 1.0, 1.0];//cyan
                break;
            case "6":
                vertexDefaultColor = [0.5, 1.0, 0.5, 1.0];//random
                break;
            default:
                vertexDefaultColor = [1.0,0.5,0.7,1.0];//unknown
        }
        changeColor();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexColors),gl.STATIC_DRAW);
        render(n);
    }
    document.getElementById("O-XTranslation").onchange = function(event){
        translation1[0] =  event.target.value; 
        gl.uniform2fv(translationLocation,translation);
        render(n);
    }
    document.getElementById("O-YTranslation").onchange = function(event) {
        translation1[1] = event.target.value;
        gl.uniform2fv(translationLocation,translation);
        render(n);
    }
    document.getElementById("Y-XTranslation").onchange = function(event) {
        translation[0] = event.target.value;
        gl.uniform2fv(translationLocationY,translation);
        render(n);
    }
    document.getElementById("Y-YTranslation").onchange = function(event) {
        translation[1] = event.target.value;
        gl.uniform2fv(translationLocationY,translation);
        render(n);
    }
    document.getElementById("BOTH-X").onchange = function(event) {
        translation[0] = event.target.value;
        translation1[0] = event.target.value;
        gl.uniform2fv(translationLocationY,translation);
        gl.uniform2fv(translationLocation,translation);
        render(n);
    }
    document.getElementById("BOTH-Y").onchange = function(event) {
        translation[1] = event.target.value;
        translation1[1] = event.target.value;
        gl.uniform2fv(translationLocationY,translation);
        gl.uniform2fv(translationLocation,translation);
        render(n);
    }
    document.getElementById("Rotate").onchange = function (event) {
        updateAngle(event.target.value);
    }
    document.getElementById("RotateB").onchange = function (event) {
        updateBothAngel(event.target.value);
    }
    document.getElementById("RotateO").onchange = function (event) {
        updateAngle_O(event.target.value);
    }
    document.getElementById("ScaleY").onchange = function (event) {
        i = 0;
        UpdateScaleY(event.target.value,i);
    }
    document.getElementById("ScaleY-Y").onchange = function (event) {
        i = 1;
        UpdateScaleY(event.target.value,i);
    }
    document.getElementById("ScaleO-X").onchange = function (event) {
        i = 0;
        UpdateScaleO(event.target.value,i);
    }
    document.getElementById("ScaleO-Y").onchange = function (event) {
        i = 1;
        UpdateScaleO(event.target.value,i);
    }
    document.getElementById("Scale-B-X").onchange = function (event){
        i = 0;
        UpdateScaleB(event.target.value,i);
    }
    document.getElementById("Scale-B-Y").onchange = function (event){
        i = 1;
        UpdateScaleB(event.target.value,i);
    }
}
function UpdateScaleY(event,i) {
    if(i == 0){
    scaleY[0] = event;
    render(n);}
    if(i== 1){
        scaleY[1] = event;
        render(n);
    }
}
function UpdateScaleO(event,i){
    if(i == 0){
      scaleO[0] = event;
      render(n);}
    if(i == 1){
       scaleO[1] = event;
        render(n);
}
}
function UpdateScaleB(event,i){
    if(i==0){
        scaleO[0] = event;
        scaleY[0] = event;
        render(n);
    }
    if(i==1){
        scaleO[1] = event;
        scaleY[1] = event;
        render(n);
    }
}
function changeColor(){
    for(var i=0;i<722;i++){
        vertexColors= vertexColors.concat(vertexDefaultColor);}
}
function updateAngle(event) {
    var AngleInDeg = 360 - event;
    var AngleInRad = AngleInDeg * Math.PI /180;
    rotationY[0] = Math.sin(AngleInRad);
    rotationY[1] = Math.cos(AngleInRad);
    render(n);
}
function updateAngle_O(event) {
    var AngleInDeg = 360 - event;
    var AngleInRad = AngleInDeg * Math.PI /18
    rotation[0] = Math.sin(AngleInRad);
    rotation[1] = Math.cos(AngleInRad);
    render(n);
}
function updateBothAngel(event){
    var AngleInDeg = 360 - event;
    var AngleInRad = AngleInDeg * Math.PI /180;
    rotationY[0]   = Math.sin(AngleInRad);
    rotation[0]    = Math.sin(AngleInRad);
    rotationY[1]   = Math.cos(AngleInRad);
    rotation[1]    = Math.cos(AngleInRad);
    render(n);
}
window.onload=main;
function render(n){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0 , gl.canvas.width, gl.canvas.height);
    //FIRST Y
   
    gl.useProgram( programY);
    ColorPosition = gl.getAttribLocation(programY,"rColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.vertexAttribPointer(rPosition, 2, gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(rPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER,ColorBuffer);
    gl.enableVertexAttribArray(ColorPosition);
    gl.vertexAttribPointer(ColorPosition,4,gl.FLOAT,false, 0,0);
    gl.uniform2fv(translationLocationY,translation);
    gl.uniform2fv(rotationLocY, rotationY);
    gl.uniform2fv(scaleLocY,scaleY);
    gl.drawElements(gl.TRIANGLES,18,gl.UNSIGNED_SHORT,0);
    
    //Draw O
    gl.useProgram( program);
    ColorPosition = gl.getAttribLocation(program,"v_Color");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.vertexAttribPointer(vPosition, 2 , gl.FLOAT, false, 0 , 0);
    gl.enableVertexAttribArray(vPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER,ColorBuffer);
    gl.enableVertexAttribArray(ColorPosition);
    gl.vertexAttribPointer(ColorPosition,4,gl.FLOAT,false, 0, 0);
    gl.uniform2fv(translationLocation,translation1);
    gl.uniform2fv(rotationLoc,rotation);
    gl.uniform2fv(scaleLoc,scaleO);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
}
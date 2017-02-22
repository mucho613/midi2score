var midi = null;
var pro;
var inputs = [];
var outputs = [];
var scoreCanvas = document.getElementById("score");
var ctx;
var noteState = new Array(128);

var imgGClef = new Image();
imgGClef.src = "Gclef.svg";
var imgFClef = new Image();
imgFClef.src = "Fclef.svg";
var imgSharp = new Image();
imgSharp.src = "sharp.svg";

addEventListener("load", init);

function init(){
	for(i=0; i<128; i++){
		noteState[i] = false;
	}

	ctx = scoreCanvas.getContext('2d');
	requestAnimationFrame(draw);
}

function draw(){
	ctx.beginPath();
	ctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

	ctx.beginPath();
	for(i=0; i<11; i++){
	    if(i!=5){
		  ctx.moveTo(20, 20 + (10 * i));
		  ctx.lineTo(240, 20 + (10 * i));
	    }
	}
	ctx.stroke();

	drawNote();

	ctx.drawImage(imgGClef, 34, 6, 25, 70);
	ctx.drawImage(imgFClef, 30, 80, 35, 38);

	requestAnimationFrame(draw);
}

var y_pos;
var sharp_flag;

function drawNote(){
	for(i=0; i<128; i++){
		sharp_flag = false;
		switch(i % 12) {
		    case 0:
			y_pos = 0;
			break;
		    case 1:
			y_pos = 0;
			sharp_flag = true;
			break;
		    case 2:
			y_pos = 1;
			break;
		    case 3:
			y_pos = 1;
			sharp_flag = true;
			break;
		    case 4:
			y_pos = 2;
			break;
		    case 5:
			y_pos = 3;
			break;
		    case 6:
			y_pos = 3;
			sharp_flag = true;
			break;
		    case 7:
			y_pos = 4;
			break;
		    case 8:
			y_pos = 4;
			sharp_flag = true;
			break;
		    case 9:
			y_pos = 5;
			break;
		    case 10:
			y_pos = 5;
			sharp_flag = true;
			break;
		    case 11:
			y_pos = 6;
			break;
		}
		y_pos += Math.floor(i / 12) * 7;
		if(noteState[i] == true){
			if(i == 60 || i == 61){
				ctx.beginPath();
				ctx.moveTo(118, 70);
				ctx.lineTo(144, 70);
				ctx.stroke();
			}

			if(i > 0 && noteState[i - 1] == false){
			    ctx.beginPath();
			    ctx.ellipse(130, 245 - (y_pos * 5), 6, 8, 70* Math.PI/180, 0, 2 * Math.PI);
			    ctx.fill();
			}
			else if(i > 1 && noteState[i - 1] == true && noteState[i - 2] == true){
			    ctx.beginPath();
			    ctx.ellipse(120, 70 - (y_pos * 5), 6, 8, 70* Math.PI/180, 0, 2 * Math.PI);
			    ctx.fill();
			}
			else if(i > 0 && noteState[i - 1] == true){
			    ctx.beginPath();
			    ctx.ellipse(130, 70 - (y_pos * 5), 6, 8, 70* Math.PI/180, 0, 2 * Math.PI);
			    ctx.fill();
			}

			if(sharp_flag) ctx.drawImage(imgSharp, 140, 227 - (y_pos * 5), 15, 36);
		}
	}
}

promise = navigator.requestMIDIAccess();
promise.then(successCallback, errorCallback);
function successCallback(m) {
	midi = m;
	var it = midi.inputs.values();
	for(var o = it.next(); !o.done; o = it.next()){
		inputs.push(o.value);
	}
	var ot = midi.outputs.values();
	for(var o = ot.next(); !o.done; o = ot.next()){
		outputs.push(o.value);
	}
	for(var cnt=0;cnt < inputs.length;cnt++){
		inputs[cnt].onmidimessage = onMIDIEvent;
	}
}
function errorCallback() {
	console.log("Error!");
}
function onMIDIEvent(e){
	if(e.data[0] == 144 && e.data[2] != 0){
		noteState[e.data[1]] = true;
	}
	if(e.data[0] == 144 && e.data[2] == 0){
		noteState[e.data[1]] = false;
	}
	if(e.data[0] == 128){
		noteState[e.data[1]] = false;
	}
}

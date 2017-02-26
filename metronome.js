var tempo = 120;
var beat = 4;

var currentBeat = 1;
var isEnabled = false;

var tempoElement = document.getElementById("tempo");
var startButtonElement = document.getElementById("start/stop");
var volumeElement = document.getElementById("volume");
var flashElement = document.getElementById("flash");
var startTime;
var time;
var timer;
var bar;

var audioContext;
var oscillator;
var gainNode;

addEventListener("load", initializeMetronome);

function initializeMetronome() {
	audioContext = new AudioContext();
	gainNode = audioContext.createGain();
	gainNode.connect(audioContext.destination);
}

function beep(){
	tempo = tempoElement.value;
	oscillator = audioContext.createOscillator();
	oscillator.type = 'square';
	oscillator.connect(gainNode);
	if(currentBeat == 1) oscillator.frequency.value = 1046;
	else oscillator.frequency.value = 523;
	oscillator.start();
	oscillator.stop(audioContext.currentTime + 0.05);
	currentBeat++;
	if(currentBeat > beat){
		bar++;
		currentBeat = 1;
	}
	time = new Date();
	timer = setTimeout(beep, startTime + 60 / tempo * 1000 * ((bar - 1) * beat + currentBeat - 1) - time.getTime());
}
volumeElement.addEventListener("input", gainSet);
volumeElement.addEventListener("change", gainSet);

function gainSet() {
	gainNode.gain.value = volumeElement.value;
};

startButtonElement.addEventListener("click", () => {
	if(!isEnabled){
		bar = 1;
		isEnabled = true;
		startButtonElement.textContent = "Stop"
		time = new Date();
		startTime = time.getTime();
		beep();
	}
	else{
		isEnabled = false;
		clearTimeout(timer);
		startButtonElement.textContent = "Start"
		bar = 1;
		currentBeat = 1;
	}
});


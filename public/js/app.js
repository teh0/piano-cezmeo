// Make socket connection
var socket = io.connect('192.168.1.17:4000');

// Declare all musics needed
let music = {
	"song" : [
		{
			"title": "hobbit",
			"notes":['do', 're', 'mi', 'sol', 'mi', 're', 'do', 'do', 're', 'mi', 'sol', 'la', 'sol', 'mi', 'fa', 'mi', 're', 'do', 're', 'mi', 'sol', 'mi', 're', 'do'],
		},
		{
			"title": "au clair de la lune",
			"notes": ['do', 'do', 'do', 're', 'mi', 're', 'do', 'mi', 're', 're', 'do', 'do', 'do', 'do', 're', 'mi', 're', 'do', 'mi', 're', 're', 'do'],
		},
		{
			"title": "minecraft",
			"notes": ['la', 'sol', 're', 'do', 'la', 'sol', 're', 'fa', 'la', 'sol', 're', 'fa', 'do', 'la', 'sol', 're', 'fa'],
		}
]};
let canKey = true;

let clickForm = () => {
	$('#input-music').click(()=>{
		canKey = false;
		console.log(canKey);
	});
}

// Keybinding notes
let key_play = {
	"keyboard": [{
			"key": 65,"note": "do"}, //a
			{"key": 90,"note": "re"}, //z
			{"key": 69,"note": "mi"}, //e
			{"key": 82,"note": "fa"}, //r
			{"key": 84,"note": "sol"}, //t
			{"key": 89,"note": "la"}, //y
			{"key": 85,"note": "si"}, //u
			{"key": 73,"note": "do_oct"}, //i
		]
};

// Detect which sound played 
let triggerSound = (sound => {
	switch (sound) {
		case 'do':
			var sound = new Audio('sound/Do.wav');
			sound.play();
			break;
		case 're':
			var sound = new Audio('sound/Re.wav');
			sound.play();
			break;
		case 'mi':
			var sound = new Audio('sound/Mi.wav');
			sound.play();
			break;
		case 'fa':
			var sound = new Audio('sound/Fa.wav');
			sound.play();
			break;
		case 'sol':
			var sound = new Audio('sound/Sol.wav');
			sound.play();
			break;
		case 'la':
			var sound = new Audio('sound/La.wav');
			sound.play();
			break;
		case 'si':
			var sound = new Audio('sound/Si.wav');
			sound.play();
			break;
		case 'do_oct':
			var sound = new Audio('sound/Do2.wav');
			sound.play();
			break;
		default:
			console.log('Sorry, we are out of ' + id + '.');
	}
});

let playWithKey = () => {
		let list_keybind = [];
		key_play.keyboard.forEach(element => {
			list_keybind.push(element.key);
		});
	$(document).on("keydown", (e) => {
		if(canKey && list_keybind.includes(e.which)) {
			const key = Object.values(key_play.keyboard).filter(({
				key
			}) => key == e.which);
			let id = key[0].note;
			$(`#${key[0].note}`).click();
			triggerSound(id);
			socket.emit('note_action', {
			 	note: id,
			 	state: 'on',
			 });
			}
	});

	$(document).on("keyup", (e) => {
		if(canKey && list_keybind.includes(e.which) ){
			const items = Object.values(key_play.keyboard).filter(({
				key
			}) => key == e.which);
			let id = items[0].note;
			$(`#${items[0].note}`).click();
			 socket.emit('note_action', {
			 	note: id,
			 	state: 'off',
			 });
		}
	});	
};


let assistedMusic = (titleMusic) => {
	// Retrieve songs user wants to play
	let partition = music.song.filter(({title})=> title == titleMusic);
	console.log(partition);
	if(partition != undefined) {
		$(`#${partition[0].notes[0]}`).children().css('background-color', 'red');
		$('.touche').click(function () {
			let curr_note = partition[0].notes[0];
			let id = $(this).attr("id");
			if (curr_note == id) {
				$('.led').css('background-color', 'white');
				$(`#${partition[0].notes[1]}`).children().css('background-color', 'red');
				partition[0].notes.shift();
			}
		});
	}
};

let playSound = () => {
	$('.touche').mousedown(function () {
		let id = this.id;
		 socket.emit('note_action', {
		 	note: id,
		 	state: 'on',
		 });
		triggerSound(id);
	});
	$('.touche').mouseup(function () {
		let id = this.id;
		 socket.emit('note_action', {
			note: id,
		 	state: 'off',
		 });

	});
};

let postForm = () => {
	$('#search-form').submit(()=> {
		canKey = true;
		let choice_music = $('#input-music').val();
		$('#music-choice').text(choice_music);
		assistedMusic(choice_music);
		return false;	
	});
};

let autocomplete = () => {
	let list_music = [];
	music.song.forEach(element => {
		list_music.push(element.title);
	});

	$( "#input-music" ).autocomplete({
		source: list_music
	});
};

postForm();
playSound();
playWithKey();
autocomplete();
clickForm();
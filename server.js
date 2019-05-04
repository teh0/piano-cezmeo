var express = require('express');
var socket = require('socket.io');
var gpio = require('rpi-gpio');
var Sound = require('node-aplay');

let p_do = new Sound('./public/sound/Do.wav');
let p_re = new Sound('./public/sound/Re.wav');
let p_mi = new Sound('./public/sound/Mi.wav');
let p_fa = new Sound('./public/sound/Fa.wav');
let p_sol = new Sound('./public/sound/Sol.wav');
let p_la = new Sound('./public/sound/La.wav');
let p_si = new Sound('./public/sound/Si.wav');
let p_do_oct = new Sound('./public/sound/Do2.wav');

var note = {'do':18, 're':16, 'mi':12, 'fa':10, 'sol':31, 'la':33, 'si':35, 'do_oct':37,}

gpio.setup(18,gpio.DIR_OUT);
gpio.setup(16,gpio.DIR_OUT);
gpio.setup(12,gpio.DIR_OUT);
gpio.setup(10,gpio.DIR_OUT);
gpio.setup(31,gpio.DIR_OUT);
gpio.setup(33,gpio.DIR_OUT);
gpio.setup(35,gpio.DIR_OUT);
gpio.setup(37,gpio.DIR_OUT);

var app = express();
var server = app.listen(4000, function(){
	console.log('Server cezmeo started !');
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
	console.log('socket connection successful!');
	socket.on('note_action', function(data){
		var num_pin = note[data.note];
		if(data.state == 'on'){
			gpio.write(num_pin, true, function(err) {
				if (err) throw err
			});
		switch (data.note) {
	            case 'do':
	            	p_do.play();
	                break;
	            case 're':
	            	p_re.play();
	                break;
	            case 'mi':
	            	p_mi.play();
	                break;
	            case 'fa':
	            	p_fa.play();
	                break;
	            case 'sol':
	            	p_sol.play();
	                break;
	            case 'la':
	            	p_la.play();
	                break;
	            case 'si':
	            	p_si.play();
	                break;
	            case 'do_oct':
	            	p_do_oct.play();
	                break;
	            default:
                	console.log('Sorry, we are out of ' + data.note + '.');
        	}
		
		}
		else{
			gpio.write(num_pin, false, function(err){
				if (err) throw err
			});
			switch (data.note) {
		            case 'do':
		            	p_do.stop();
		                break;
		            case 're':
		            	p_re.stop();
		                break;
		            case 'mi':
		            	p_mi.stop();
		                break;
		            case 'fa':
		            	p_fa.stop();
		                break;
		            case 'sol':
		            	p_sol.stop();
		                break;
		            case 'la':
		            	p_la.stop();
		                break;
		            case 'si':
		            	p_si.stop();
		                break;
		            case 'do_oct':
		            	p_do_oct.stop();
		                break;
		            default:
	                	console.log('Sorry, we are out of ' + id + '.');
        	}
		};
		
		
		console.log('Le numero du port est le: '+num_pin);
		console.log('Note jouée: '+data.note +' et l\'etat est: '+data.state);
		
	});
});
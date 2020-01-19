// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require wavesurfer.min



// The track currently selected from a PLAYLIST is identified by :
//  self.audio_data.track_idx

var datashift_audio_engine = {

	state: null,
	engine: null,

	save_interval: 1000,

	is_radio: false,

	routes: {
		init_url: null,
		load_url: null,
		save_url: null,
		radio_url: null
	},

	settings: {
		autoplay: false,
		random: false,
		repeat: null,
		volume: 1
	},

	waveform_colors: {
		// wave_color,
		// progress_color,
		// cursor_color,
	},

	user_token: null,
	client_token: null,

	playlist_id: 0,

	// Member Data
	audio_data: {
		playlist: {}
	},

	// Holds details of the control elements such as play/prev/volume buttons
	controls: {},
	visual:   {},

	timer: null,


	init_player: function(json_data)
	{
		var self = this;

		datashift_audio_engine.default_init_state();

		datashift_audio_engine.assign_events_to_controls();

		console.log('Init Player JSON:' + json_data)

		var data = JSON.parse(json_data)['datashift_audio'];

		// Routes
		if (data.routes) {
			if (data.routes.save_url)      datashift_audio_engine.routes.save_url = data.routes.save_url;
			if (data.routes.save_interval) datashift_audio_engine.save_interval   = data.routes.save_interval;
			console.log('CALLBACK - init_player - routes -save_current_state - URL:' + datashift_audio_engine.routes.save_url);
		}

		// Service
		if (data.service) {
			self.user_token   = data.service.user_token;
			self.client_token = data.service.client_token;
		}

		// PlayList Pagination
		if (data.pagination) {
			self.audio_data.page        = parseInt(data.pagination.page);
			self.audio_data.total_pages = parseInt(data.pagination.total_pages);

			datashift_audio_engine.validate_audio_data();
		}

		// Settings
		let settings = data.settings;

		if(settings) {
			datashift_audio_engine.settings.autoplay = settings.autoplay;
		}

		// Waveform
		let waveform = data.waveform;

		if(waveform) {
			self.waveform_colors = {
				wave_color:     waveform.wave_color,
				progress_color: waveform.progress_color,
				cursor_color:   waveform.cursor_color,
				bar_width:      waveform.bar_width,
			}
		}

	},

	// init: function(init_url = null)
	// {
	// 	if (init_url == null) init_url = this.routes.init_url;
	//
	// 	var self = this;
	//
	// 	console.log("Call to INIT : " + init_url);
	//
	// 	datashift_audio_engine.default_init_state();
	//
	// 	datashift_audio_engine.assign_events_to_controls();
	//
	// 	// Update settings
	// 	//
	// 	if (init_url != null) {
	// 		$.ajax(
	// 				{
	// 					method: "POST",
	// 					url: init_url,
	// 					type: "json",
	// 					data: {
	// 						user_token: this.user_token,
	// 						client_token: this.client_token
	// 					}
	// 				}).done(function (json_data) {
	//
	// 			var data = json_data;
	//
	// 			console.log("Call to " + init_url + " SUCCESS - JSON:");
	// 			console.log(data);
	//
	// 			if (data.datashift_audio.service) {
	// 				self.user_token = data.datashift_audio.service.user_token;
	// 				self.client_token = data.datashift_audio.service.client_token;
	// 			}
	//
	// 			// routes
	// 			if (data.routes) {
	// 				if (data.routes.save_url) datashift_audio_engine.routes.save_url = data.routes.save_url;
	// 				if (data.routes.save_interval) datashift_audio_engine.save_interval = data.routes.save_interval;
	// 				console.log('CALLBACK - save_current_state - URL:' + datashift_audio_engine.routes.save_url);
	// 			}
	//
	// 			// track
	// 			if (data.datashift_audio.audio) {
	// 				self.audio_data.playlist    = parseInt(data.datashift_audio.audio.playlist);
	// 				self.audio_data.page        = parseInt(data.datashift_audio.audio.page);
	// 				self.audio_data.total_pages = parseInt(data.datashift_audio.audio.total_pages);
	// 				self.audio_data.track_idx   = parseInt(data.datashift_audio.audio.track);
	// 				self.audio_data.position    = parseFloat(data.datashift_audio.audio.position);
	//
	// 				datashift_audio_engine.validate_audio_data();
	// 			}
	//
	// 			let settings = data.datashift_audio.settings;
	//
	// 			if(settings) {
	// 				self.audio_data.playlist = settings.autoplay;
	// 			}
	//
	// 			self.waveform_colors = {
	// 				wave_color: data.datashift_audio.waveform_colors.wave_color,
	// 				progress_color: data.datashift_audio.waveform_colors.progress_color,
	// 				cursor_color: data.datashift_audio.waveform_colors.cursor_color,
	// 				bar_width: data.datashift_audio.waveform_colors.bar_width,
	// 			}
	//
	// 		}).fail(function () {
	// 			self.state = 'init failed';
	// 			console.error(self.state);
	// 		});
	// 	}
	// 	else {
	// 		self.state = 'init url not found';
	// 		console.info(self.state);
	// 	}
	//
	// },

	// LOAD DATA
	//
	// Ajax request to back-end to get data about track/playlist/radio
	// and save it to local variables
	//
	load: function(load_url = null, is_new = false) {

		if (load_url == null) load_url = this.routes.load_url;

		var self = this;

		if (load_url !=  null) {
			console.log("CALL LOAD URL FOR AUDIO", Date.now);
			$.ajax(
					{
						method: "GET",
						url: load_url,
						type: "script",
						data: {
							user_token: this.user_token,
							client_token: this.client_token,
							random: this.settings.random
						}
					}).done(function( data ) {

				self.playlist = data.tracks;

				// render the first track in the playlist audio engine
				self.render_wave_from_audio_file(self.playlist[0])

				if (data.hasOwnProperty('playlist_partial')) {
					// Replace the visual HTML playlist with supplied HTML from Rails side
					self.visual.playlist.html(data.playlist_partial)
				}

			}).fail(function(){
				self.playlist = [];
				self.state = 'fail playlist loaded';
				console.error(self.state);
			});
		} else {
			self.playlist = [];
			self.state = 'load url not found';
			console.info(self.state);
		}
	},

	update_info: function(){
		this.audio_data.position = this.engine.getCurrentTime();
	},

	// Render audio wave from audio file or pure data
	render_wave_from_audio_file: function(track){

		this.visual.waveform.html('');

		if( this.engine != null )
			this.engine.destroy();

		clearInterval(this.timer);

		this.is_radio = false;

		// init new
		this.engine = WaveSurfer.create({
			container: '#waveform',
			waveColor:     this.waveform_colors.wave_color,
			progressColor: this.waveform_colors.progress_color,
			cursorColor:   this.waveform_colors.cursor_color,
			barWidth: 3,
			hideScrollbar: true,
			backend: 'MediaElement'
		});

		console.log("Loading Audio Engine from URL " + track.audio_url)
		this.engine.load(track.audio_url);

		/* TODO seperate wave/audio rendering from playlist

		this.visual.playlist.children('.datashift-audio-playlist li').removeClass('datashift-audio-active');
		var visual_track = $('#track-' + this.audio_data.track);
		visual_track.addClass('datashift-audio-active');

		this.visual.pages.children('li').removeClass('datashift-audio-active');
		var visual_page = $('#page-' + this.audio_data.page);
		visual_page.addClass('datashift-audio-active')
*/
		var self = this;

		this.engine.on('ready', function(){

			console.log('Engine READY')

			self.audio_data.position = 0;
			self.seek(self.audio_data.position);

			self.visual.current_position.html(formatTime(self.audio_data.position));
			self.visual.total_duration.html(formatTime(self.engine.getDuration()));

			self.volume(self.settings.volume);
			// self.controls.volume.get(0).value = self.settings.volume * 100;
			self.controls.volume.attr('value',  self.settings.volume * 100);

			var volume = parseInt(self.controls.volume.attr('value'));
			self.controls.volume.change();

			if (self.settings.autoplay) {
				console.log('AutoPlay ON- Play')
				self.play();
			}

			self.engine.on('finish', function(){
				self.save_current_state();
				clearInterval(self.timer);
				self.next();
				console.log('Track finished');
			})
		});

		this.visual.cover_image_img.html('<img class="img-fluid rounded" src="'+ track.cover_image +'">');
		this.visual.track_name.html(track.name);
		this.visual.author_name.html(track.author);
	},

	// MAIN AUDIO CONTROLS
	play: function() {

		console.info("START PLAY");
		this.controls.play.addClass('datashift-audio-hide');

		this.controls.pause.removeClass('datashift-audio-hide');
		//this.controls.prev.removeClass('datashift-audio-hide');
		//this.controls.next.removeClass('datashift-audio-hide');

		console.info("CHECK RADIO");

		if (this.is_radio == false) {
			console.log('PLAY - Save Callback every - ' + this.save_interval + ' ms');
			this.settings.autoplay = true;
			this.timer = setInterval(this.save_current_state, this.save_interval);
		} else {
			this.timer = setInterval(function(){
				$.post('radio_data', {
							radio_url: this.radio_url
						}
				).done(function(pure_data) {

					var data = pure_data;

					datashift_audio_engine.visual.cover_image_img.html('<img class="img-fluid rounded" src="'+ data.radio.cover_image +'">');
					datashift_audio_engine.visual.author_name.html(data.radio.author);
					datashift_audio_engine.visual.track_name.html(data.radio.track);

					console.log('update radio metadata');
				}).fail(function(){
					// datashift_audio_engine.visual.cover_image.css('background-image', 'url("'+ test_audio_data_json.radio.cover_image +'")');
					datashift_audio_engine.visual.author_name.html('Not Found');
					datashift_audio_engine.visual.track_name.html('Not Found');

					console.log('fail update radio metadata');
				});
			}, 1000);
		}
		console.log('Calling Engine Play');
		this.engine.play();
	},

	pause: function() {
		this.controls.pause.addClass('datashift-audio-hide');
		this.controls.play.removeClass('datashift-audio-hide');

		if (this.is_radio == false) {
			this.audio_data.autoplay = false;
			this.save_current_state();
		}
		clearInterval(this.timer);

		this.engine.pause();
	},

	// url = 'playlist/:id.new_page'
	new_page: function(url, fromBeginning = true){
		$.get(url).done(function(pure_data){
			console.log('render new page and select new track');

			var data = pure_data;

			datashift_audio_engine.playlist = data.tracks;
			datashift_audio_engine.page = parseInt(data.page);

			datashift_audio_engine.visual.playlist.html('');

			datashift_audio_engine.visual.pages.children('li').removeClass('datashift-audio-active');
			var visual_page = $('#page-' + data.page);
			visual_page.addClass('datashift-audio-active');

			datashift_audio_engine.playlist.forEach((track, index) => {
				var duration = '<div class="datashift-audio-duration">' + formatTime(track.duration) + '</div>';
				var full_name = '<div class="datashift-audio-full-name">' + track.author + " - " + track.name + '</div>';

				var track_set = duration + full_name;
				datashift_audio_engine.visual.playlist.append('<li id="track-' + index + '" onClick="" >' + track_set + '</li>')
			});

			datashift_audio_engine.visual.playlist.children('li').on('click', function(){
				datashift_audio_engine.audio_data.track_idx = parseInt(this.id.split('-')[1]);
				datashift_audio_engine.settings.autoplay = true;
				datashift_audio_engine.render_wave_from_audio_file()
			});

			if (fromBeginning == true){
				datashift_audio_engine.audio_data.track_idx = -1;
				datashift_audio_engine.next();
			} else {
				datashift_audio_engine.audio_data.track_idx = datashift_audio_engine.playlist.length;
				datashift_audio_engine.previous();
			}
		}).fail(function(){
			console.error('page not found');
			console.log('page: ' + datashift_audio_engine.audio_data.page)
		});
	},

	volume: function(value){
		if (isNaN(value)) value = 1;

		this.settings.volume = value;

		if (this.is_radio == true){
			this.engine.volume = value;
		} else {
			this.engine.setVolume(value);
			window.localStorage.setItem('volume', value);
		}
	},

	seek: function(position){
		this.engine.setCurrentTime(position);
		this.audio_data.position = position;
		this.save_current_state();
	},

	// Save current state of a player and send it to the back-end to sync it
	save_current_state: function(save_url = null){

		//console.log('CALL - save_current_state - URL:' + datashift_audio_engine.routes.save_url);

		if ( save_url == null && (datashift_audio_engine.routes.save_url == null || datashift_audio_engine.routes.save_url == undefined) )
		{
			console.log('WARNING - CALL BACK FOR datashift_audio_engine.routes.save_url - NOT DEFINED');
			return;
		}

		if ( datashift_audio_engine.state == undefined ) return;

		if ( save_url == null) save_url = datashift_audio_engine.routes.save_url;

		datashift_audio_engine.update_info();

		datashift_audio_engine.visual.current_position.html(formatTime(datashift_audio_engine.audio_data.position));

		var data = {
			user_token: datashift_audio_engine.user_token,
			client_token: datashift_audio_engine.client_token,
			random: datashift_audio_engine.settings.random,
			audio_data: datashift_audio_engine.audio_data,
		}

		$.post(save_url, data )
				.done(function(){
					console.log('saved');
				})
				.fail(function(){
					console.log('fail to save');
				});
	}
};




yams_audio_engine.assign_events_to_controls = function() {
	// Find and assign element IDs for controls to Visual
	//
	this.controls = {
		play: $('#yams-audio-player .play'),
		pause: $('#yams-audio-player .pause'),

		prev: $('#yams-audio-player .yams-audio-track-controls .previous'),
		next: $('#yams-audio-player .yams-audio-track-controls .next'),

		volume: $('#yams-audio-player .yams-audio-track-volume input[type=range].yams-audio-input-range')
	}

	this.visual = {

		author_name: $('#yams-audio-player .yams-audio-track-basic-info .yams-audio-author-name'),
		track_name: $('#yams-audio-player .yams-audio-track-basic-info .yams-audio-track-name'),

		cover_image: $('#yams-audio-player .yams-audio-track-cover'),
		cover_image_img: $('#yams-audio-track-cover-img'),

		playlist: $('#yams-audio-playlist'),
		waveform: $('#yams-audio-player #waveform'),

		current_position: $('#yams-audio-player .yams-audio-current-position'),
		total_duration: $('#yams-audio-player .yams-audio-total-duration'),

		pages: $('#yams-audio-player .yams-audio-pages'),

		btn_toggle_playlist: $('#yams-audio-toggle-playlist'),
	}

	$('#yams-audio-player .play').on('click', function(){
		yams_audio_engine.play();
	});

	this.controls.pause.on('click', function(){
		yams_audio_engine.pause();
	});

	this.visual.btn_toggle_playlist.on('click', function(){

		if(this.visual.btn_toggle_playlist.hasClass('yams-audio-active')){
			this.visual.btn_toggle_playlist.removeClass('yams-audio-active');
			this.visual.playlist.addClass('d-none');
		} else {
			this.visual.btn_toggle_playlist.addClass('yams-audio-active');
			this.visual.playlist.removeClass('d-none');
		}
	});

	$('#yams-audio-player .yams-audio-track-volume i').on('click', function(){
		var current_value = parseInt(yams_audio_engine.controls.volume.attr('value'));
		var audio_dom_el = yams_audio_engine.controls.volume.get(0);
		console.log( 'volume: ' + current_value );

		if (current_value > 0){
			console.log('current_value > 0');

			yams_audio_engine.controls.volume.get(0).value = 0;
			yams_audio_engine.controls.volume.attr('value', 0);

			yams_audio_engine.engine.setVolume(0);

			if(audio_dom_el.value == 0) {
				$('.yams-audio-track-volume i').addClass('d-none');
				$('.yams-audio-track-volume i.volume_off').removeClass('d-none')
			}
		} else {
			console.log('current_value == 0');

			if (current_value == 0 && yams_audio_engine.settings.volume == 0){
				current_value = 1;
				yams_audio_engine.settings.volume = current_value;
			}

			audio_dom_el.value = yams_audio_engine.settings.volume * 100;
			yams_audio_engine.controls.volume.attr('value',  yams_audio_engine.settings.volume * 100);
			yams_audio_engine.volume(yams_audio_engine.settings.volume);

			if(audio_dom_el.value >= 75) {
				$('.yams-audio-track-volume i').addClass('d-none');
				$('.yams-audio-track-volume i.volume_up').removeClass('d-none')
			}

			if(audio_dom_el.value >= 50 && audio_dom_el.value < 75) {
				$('.yams-audio-track-volume i').addClass('d-none');
				$('.yams-audio-track-volume i.volume_down').removeClass('d-none')
			}

			if(audio_dom_el.value >= 25 && audio_dom_el.value < 50) {
				$('.yams-audio-track-volume i').addClass('d-none');
				$('.yams-audio-track-volume i.volume_mute').removeClass('d-none')
			}

			console.log(yams_audio_engine.controls.volume.attr('value'));
		}
	});

	this.controls.volume.on('input change', function(update = true) {
		if(this.value >= 75) {
			$('.yams-audio-track-volume i').addClass('d-none');
			$('.yams-audio-track-volume i.volume_up').removeClass('d-none')
		}

		if(this.value >= 50 && this.value < 75) {
			$('.yams-audio-track-volume i').addClass('d-none');
			$('.yams-audio-track-volume i.volume_down').removeClass('d-none')
		}

		if(this.value >= 25 && this.value < 50) {
			$('.yams-audio-track-volume i').addClass('d-none');
			$('.yams-audio-track-volume i.volume_mute').removeClass('d-none')
		}

		if(this.value == 0) {
			$('.yams-audio-track-volume i').addClass('d-none');
			$('.yams-audio-track-volume i.volume_off').removeClass('d-none')
		}

		if (update)
			yams_audio_engine.volume(this.value / 100.0);
	});
};

yams_audio_engine.select_from_playlist = function(index)
{
	if(index < 0 || index >this.audio_data.playlist.length)
	{
		console.log('TODO: Index OutOfBounds - how are we achieving Playlist pagination ?');
		//if (this.audio_data.page > 1)
		//	this.new_page('playlist/:id.new_page', false); // TODO surely this should come from routes not hard coded ?
		return;
	}

	console.log('FIND Track @ ' + index + ' - Current Index : ' + this.audio_data.track_idx);

	var track = this.audio_data.playlist[index];

	if (track != null) {
		this.audio_data.track_idx = index;
		this.audio_data.position  = 0;
		this.settings.autoplay    = true;

		this.render_wave_from_audio_file(track);

		//this.save_current_state();
	} else {
		console.log('ERROR: Failed to find usable track in Playlist at index ' + index);
	}
}

// Play a track - Handler that can be applied to playlist row,
// for example on an <li> so user can click anywhere to start play back.
//
yams_audio_engine.playlist_onclick = function(item)
{
	this.audio_data.track_idx = parseInt(item.id.split('-')[1]);

	yams_audio_engine.select_from_playlist(this.audio_data.track_idx);
}

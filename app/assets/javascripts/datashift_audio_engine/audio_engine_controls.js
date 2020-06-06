yams_audio_engine.assign_events_to_controls = function() {
	// Find and assign element IDs for controls to Visual
	//
	this.controls = {
		play: $('#datashift-audio-player .play'),
		pause: $('#datashift-audio-player .pause'),

		prev: $('#datashift-audio-player .datashift-audio-track-controls .previous'),
		next: $('#datashift-audio-player .datashift-audio-track-controls .next'),

		volume: $('#datashift-audio-player .datashift-audio-track-volume input[type=range].datashift-audio-input-range')
	}

	this.visual = {

		author_name: $('#datashift-audio-player .datashift-audio-track-basic-info .datashift-audio-author-name'),
		track_name: $('#datashift-audio-player .datashift-audio-track-basic-info .datashift-audio-track-name'),

		cover_image: $('#datashift-audio-player .datashift-audio-track-cover'),
		cover_image_img: $('#datashift-audio-track-cover-img'),

		playlist: $('#datashift-audio-playlist'),
		waveform: $('#datashift-audio-player #waveform'),

		current_position: $('#datashift-audio-player .datashift-audio-current-position'),
		total_duration: $('#datashift-audio-player .datashift-audio-total-duration'),

		pages: $('#datashift-audio-player .datashift-audio-pages'),

		btn_toggle_playlist: $('#datashift-audio-toggle-playlist'),
	}

	this.controls.play.on('click', function(){
		yams_audio_engine.play();
	});

	this.controls.pause.on('click', function(){
		yams_audio_engine.pause();
	});

	this.visual.btn_toggle_playlist.on('click', function(){

		if(this.visual.btn_toggle_playlist.hasClass('datashift-audio-active')){
			this.visual.btn_toggle_playlist.removeClass('datashift-audio-active');
			this.visual.playlist.addClass('datashift-audio-hide');
		} else {
			this.visual.btn_toggle_playlist.addClass('datashift-audio-active');
			this.visual.playlist.removeClass('datashift-audio-hide');
		}
	});

	$('#datashift-audio-player .datashift-audio-track-volume i').on('click', function(){
		var current_value = parseInt(yams_audio_engine.controls.volume.attr('value'));
		var audio_dom_el = yams_audio_engine.controls.volume.get(0);
		console.log( 'volume: ' + current_value );

		if (current_value > 0){
			console.log('current_value > 0');

			yams_audio_engine.controls.volume.get(0).value = 0;
			yams_audio_engine.controls.volume.attr('value', 0);

			yams_audio_engine.engine.setVolume(0);

			if(audio_dom_el.value == 0) {
				$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
				$('.datashift-audio-track-volume i.volume_off').removeClass('datashift-audio-hide')
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
				$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
				$('.datashift-audio-track-volume i.volume_up').removeClass('datashift-audio-hide')
			}

			if(audio_dom_el.value >= 50 && audio_dom_el.value < 75) {
				$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
				$('.datashift-audio-track-volume i.volume_down').removeClass('datashift-audio-hide')
			}

			if(audio_dom_el.value >= 25 && audio_dom_el.value < 50) {
				$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
				$('.datashift-audio-track-volume i.volume_mute').removeClass('datashift-audio-hide')
			}

			console.log(yams_audio_engine.controls.volume.attr('value'));
		}
	});

	this.controls.volume.on('input change', function(update = true) {
		if(this.value >= 75) {
			$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
			$('.datashift-audio-track-volume i.volume_up').removeClass('datashift-audio-hide')
		}

		if(this.value >= 50 && this.value < 75) {
			$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
			$('.datashift-audio-track-volume i.volume_down').removeClass('datashift-audio-hide')
		}

		if(this.value >= 25 && this.value < 50) {
			$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
			$('.datashift-audio-track-volume i.volume_mute').removeClass('datashift-audio-hide')
		}

		if(this.value == 0) {
			$('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
			$('.datashift-audio-track-volume i.volume_off').removeClass('datashift-audio-hide')
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

yams_audio_engine.previous = function()
{
	yams_audio_engine.select_from_playlist(this.audio_data.track_idx - 1);
}

yams_audio_engine.next = function()
{
	yams_audio_engine.select_from_playlist(this.audio_data.track_idx + 1);
}

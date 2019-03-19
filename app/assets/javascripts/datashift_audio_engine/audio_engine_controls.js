datashift_audio_engine.assign_events_to_controls = function() {
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
        datashift_audio_engine.play();
    });

    this.controls.pause.on('click', function(){
        datashift_audio_engine.pause();
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
        var current_value = parseInt(datashift_audio_engine.controls.volume.attr('value'));
        var audio_dom_el = datashift_audio_engine.controls.volume.get(0);
        console.log( 'volume: ' + current_value );

        if (current_value > 0){
            console.log('current_value > 0');

            datashift_audio_engine.controls.volume.get(0).value = 0;
            datashift_audio_engine.controls.volume.attr('value', 0);

            datashift_audio_engine.engine.setVolume(0);

            if(audio_dom_el.value == 0) {
                $('.datashift-audio-track-volume i').addClass('datashift-audio-hide');
                $('.datashift-audio-track-volume i.volume_off').removeClass('datashift-audio-hide')
            }
        } else {
            console.log('current_value == 0');

            if (current_value == 0 && datashift_audio_engine.settings.volume == 0){
                current_value = 1;
                datashift_audio_engine.settings.volume = current_value;
            }

            audio_dom_el.value = datashift_audio_engine.settings.volume * 100;
            datashift_audio_engine.controls.volume.attr('value',  datashift_audio_engine.settings.volume * 100);
            datashift_audio_engine.volume(datashift_audio_engine.settings.volume);

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

            console.log(datashift_audio_engine.controls.volume.attr('value'));
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
            datashift_audio_engine.volume(this.value / 100.0);
    });
};
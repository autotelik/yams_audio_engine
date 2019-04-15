datashift_audio_engine.default_init_state = function() {
    this.audio_data.playlist = -1;
    this.audio_data.page = 0;
    this.audio_data.track = 0;
    this.audio_data.position = 0;

    this.settings.autoplay = false;
    this.settings.random = false;
    this.settings.repeat = false;
    this.settings.volume = 1;

    this.waveform_colors = {
        wave_color: 'grey',
        progress_color: 'white',
        cursor_color: '#dafcff',
        bar_width: 2,
    }
};

datashift_audio_engine.validate_audio_data = function() {
    if (this.audio_data.playlist == null || this.audio_data.playlist == NaN) this.audio_data.playlist = 0;
    if (this.audio_data.page == null || this.audio_data.page == NaN) this.audio_data.page = 0;
    if (this.audio_data.total_pages == null || this.audio_data.total_pages == NaN) this.audio_data.total_pages = 0;
    if (this.audio_data.track == null || this.audio_data.track == NaN) this.audio_data.track = 0;
    if (this.audio_data.position == null || this.audio_data.position == NaN) this.audio_data.position = 0;
};


function formatTime(time_in_seconds){
    var seconds = Math.floor(time_in_seconds);
    var minutes = Math.floor(seconds / 60);

    minutes = (minutes >= 10) ? minutes : "0" + minutes;

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;

    return minutes + ":" + seconds;
}


function datashift_audio_playlist_onclick_handler(item)
{
    console.log('CALLED Playlist event handler ON ' + item)
    console.log('CALLED Playlist event handler ON ' + item.id)
    // TODO: audio_data.track should be renamed track_idx
    datashift_audio_engine.audio_data.track = parseInt(item.id.split('-')[1]);
    datashift_audio_engine.settings.autoplay = true;
    datashift_audio_engine.render_wave_from_audio_file(datashift_audio_engine.playlist[datashift_audio_engine.audio_data.track])
}
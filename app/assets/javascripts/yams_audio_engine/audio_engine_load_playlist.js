yams_audio_engine.load_playlist = function(json_data)
{
  // Load Engine with JSON Playlist
  var data = JSON.parse(json_data)['datashift_audio'];

  this.audio_data.playlist  = data.playlist.tracks;
	this.audio_data.track_idx = parseInt(data.playlist.track_idx);

  console.log("PLAYLIST CONTAINS : ", this.audio_data.playlist.length + ' Tracks - Starting at ' + this.audio_data.track_idx);

  // Render audio and wave for the selected track in the playlist
	if(this.audio_data.playlist.length > 0) { yams_audio_engine.select_from_playlist(this.audio_data.track_idx) }
};

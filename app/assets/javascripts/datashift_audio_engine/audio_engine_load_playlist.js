datashift_audio_engine.load_playlist = function(json_data) {

  // Load Engine with JSON Playlist
  //
  var self = this;

  var data = JSON.parse(json_data)['datashift_audio'];

  this.playlist = data.tracks;

  console.log("TRACKS SIZE : ", data.tracks.length);

  // Render audio and wave for the first track in the playlist

  // TODO: json can contain the track number to play
  if(data.tracks.length > 0) {
    self.render_wave_from_audio_file(data.tracks[0]);
  }

};

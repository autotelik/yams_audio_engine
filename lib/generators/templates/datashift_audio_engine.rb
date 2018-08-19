# Use this hook to configure datashift_audio_engine audio engine processing

DatashiftAudioEngine::Configuration.call do |config|

  # Player can start playing audio on page load, rather than waiting for visitor to click play.
  #
  # TODO How to Pass this to JS engine/player ?
  # Default is false
  config.autoplay = false;


  # Player will report back current status to a save callback.
  # This parameter can be used to set the interval between reports in milliseconds.
  #
  # TODO How to Pass this to JS engine/player ?
  # Default is 1000 milliseconds
  config.save_callback_interval = 1000;

end

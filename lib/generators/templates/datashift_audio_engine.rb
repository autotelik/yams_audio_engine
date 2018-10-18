# Use this hook to configure datashift_audio_engine audio engine processing

DatashiftAudioEngine::Configuration.call do |config|

  # routes
  #
  # Url of action wich will authorize user and will load personalized information about player right for current user
  #
  # config.init_url = "";

  # Url of action which will form playlist load action with params
  # config.load_url = "";

  # Url of action wich will controll save action
  # config.save_url = "";

  # Url of action wich will controll save action
  # config.radio_url = "";

  # Player can start playing audio on page load, rather than waiting for visitor to click play.
  #
  # Default is false
  config.autoplay = false;

  config.random  = false;
  config.repeat  = false;
  config.volume  = 0.5;     # - 0 .. 1

  # Player will report back current status to a save callback.
  # This parameter can be used to set the interval between reports in milliseconds.
  #
  # Default is 1000 milliseconds
  config.save_callback_interval = 1000;

  config.save_interval = 1000; #  - in milliseconds

  # Waveform colors.
  #
  # regular css color for normal wave
  # config.wave_color;
  #
  # config.progress_color;
  # config.cursor_color;
  #
  # width in pixels
  # config.bar_width;

end

# Use this hook to configure yams_audio audio engine processing

YamsAudio::Config.configure do |config|

  # Player can start playing audio on page load, rather than waiting for visitor to click play.
  #
  # Default is false
  config.autoplay = false

  config.random  = false
  config.repeat  = false

  # Player will report back current status to a save callback on parent app.
  # This parameter can be used to set the interval between reports in milliseconds.
  #
  # Default is 1000 milliseconds
  config.save_interval = 1000

  # Waveform colors.
  #
  # regular css color for normal wave
  # config.wave_color = '#f7931a'
  #
  # regular css color for already played part of the wave
  # config.progress_color = '#f2a900'
  #
  # regular css color for tracking current location within the wave
  # config.cursor_color = '#010101'
  #

end

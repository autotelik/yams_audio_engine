module DatashiftAudioEngine
  module ApplicationHelper

    def datashift_audio_player_tag(pin_to: :top)
      render partial: 'datashift_audio_engine/shared/player', locals: {pin_to: pin_to}
    end

  end
end

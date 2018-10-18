module DatashiftAudioEngine
  module ApplicationHelper

    def datashift_audio_player_tag(pin_to: :top, init_url: nil, load_url: nil)
      render partial: 'datashift_audio_engine/shared/player', locals: { pin_to: pin_to, init_url: init_url, load_url: load_url }
    end

  end
end

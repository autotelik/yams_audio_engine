module DatashiftAudioEngine
  module ApplicationHelper

    def datashift_audio_player_tag(pin_to: :top)
      render partial: 'datashift_audio_engine/shared/player', locals: { pin_to: pin_to }
    end

    def datashift_audio_player_script(init_url: nil, load_url: nil)
      render partial: 'datashift_audio_engine/shared/player_script', locals: { init_url: init_url, load_url: load_url }
    end

  end
end

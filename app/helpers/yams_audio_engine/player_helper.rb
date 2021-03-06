module YamsAudioEngine
  module PlayerHelper

    def datashift_audio_player_tag(pin_to: :top)
      render partial: 'yams_audio_engine/shared/player', locals: { pin_to: pin_to }
    end

    def datashift_audio_player_script(init_url: nil, load_url: nil, save_url: nil, skip_init: nil)
      if skip_init
        render partial: 'yams_audio_engine/shared/player_script', locals: { skip_init: true, load_url: load_url }
      else
        render partial: 'yams_audio_engine/shared/player_script', locals: { init_url: init_url, load_url: load_url, save_url:  save_url  }
      end
    end

    def datashift_audio_player_in_navbar(load_url: nil)
      render partial: 'yams_audio_engine/shared/player_in_navbar', locals: { load_url: load_url }
    end

  end
end

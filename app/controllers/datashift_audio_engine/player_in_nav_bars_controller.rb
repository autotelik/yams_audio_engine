module DatashiftAudioEngine
  class PlayerInNavBarsController < ApplicationController

    include DatashiftAudioEngine::PlayerHelper

    # Expects initial player setup config as JSON in datashift_audio_settings
    #
    # json.datashift_audio do
    #
    #   json.service do
    #     if current_user # radio stream can be accessed by non signed in visitors
    #       json.user_token   current_user.id
    #       json.client_token '0987654321' # TODO: - add tokens to devise
    #     end
    #   end
    #
    #   json.settings do
    #     json.autoplay true
    #   end
    #
    #   json.waveform_colors do
    #     json.wave_color 'white'
    #     json.progress_color 'grey'
    #     json.cursor_color 'purple'
    #     json.bar_width 'w-100'
    #   end
    # end
    #
    # json.routes do
    #   json.save_interval DatashiftAudioEngine::Configuration.call.save_interval
    #
    #   json.save_url yams_core.player_status_callback_url
    # end
    #
    def create
      @player_settings = JSON.parse(params[:player_settings])

      puts 'WTF PlayerInNavBar'
      pp @player_settings

      render :create, locals: { target_element: params[:target_element], load_url: params[:load_url], save_url: params[:save_url] }
    end
  end
end
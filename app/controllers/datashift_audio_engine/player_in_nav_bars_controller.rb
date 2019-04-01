module DatashiftAudioEngine
  class PlayerInNavBarsController < ApplicationController

    include DatashiftAudioEngine::PlayerHelper

    def create
      # TODO: enable param to be passed in
      @target_element = '#navbar-audio-player-insertion-point'

      render :create, locals: { init_url: params[:init_url], load_url: params[:load_url], save_url: params[:save_url] }
    end
  end
end
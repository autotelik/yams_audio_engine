# frozen_string_literal: true

module YamsAudio

  class AudioEngineJsonBuilder

    include YamsCore::Services

    attr_reader :tracks, :current_user

    def initialize(tracks, current_user)
      @tracks = *tracks
      @current_user = current_user
    end

    def call
      Jbuilder.encode do |json|
        json.yams_playlist do


          json.playlist do
            json.tracks    YamsCore::AudioEnginePlayListBuilder.call(tracks, current_user)
            json.track_idx '0'
            json.position  '0'
          end

          # TODO: how is pagination gonna work ?
          json.pagination do
            json.page '0'
            json.total_pages 1
          end

        end
      end
    end

  end

  private

  attr_reader :current_user, :tracks
end

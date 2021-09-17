# frozen_string_literal: true

module YamsAudio

  class PlayerSettingsBuilder

    include YamsAudio::Services

    attr_reader :user, :options

    def initialize(user:, **options)
      @user = user
      
      @options = options

      pp YamsAudio::Config.call.inspect
    end

    def call
      Jbuilder.encode do |json|
        json.settings do

          json.autoplay options[:autoplay] || false
          json.random options[:random] || false
          json.repeat options[:repeat] || nil
          json.save_interval options[:save_interval] || 1000
         
          json.service do
            if user     #  Some streams such as Radio stream can be accessed by non signed in visitors
              json.user_token   user.id
              json.client_token '0987654321' # TODO: - add tokens to devise
            end
          end

          json.waveform do
            json.wave_color     options[:wave_color] ||     YamsAudio::Config.call.wave_color
            json.progress_color options[:progress_color] || YamsAudio::Config.call.progress_color
            json.cursor_color   options[:cursor_color] ||   YamsAudio::Config.call.cursor_color
          end

        end
      end
    end

  end

  private

  attr_reader :user
end

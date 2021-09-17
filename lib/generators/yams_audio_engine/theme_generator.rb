require 'rails/generators/base'

# A generator to make it easier for Main Apps to over ride the styling - copy over all CSS assets
module YamsAudio
  module Generators
    class ThemeGenerator < Rails::Generators::Base
      source_root YamsAudio::Engine.root

      desc "Copy Yams Audio Engine stylesheets to the parent Rails app to simplify over riding styles."

      def copy_theme
        css_path = "app/assets/stylesheets/yams_audio"

        # copy_file File.join(css_path, "cover.scss"),    File.join(css_path, "cover.scss")
        # copy_file File.join(css_path, "icons.scss"),    File.join(css_path, "icons.scss")
        # copy_file File.join(css_path, "player.scss"),   File.join(css_path, "player.scss")
        # copy_file File.join(css_path, "playlist.scss"), File.join(css_path, "playlist.scss")
        # copy_file File.join(css_path, "volume.scss"),   File.join(css_path, "volume.scss")

        # TODO: Append to application.js
        # @import "datashift_audio_player/cover";
        # @import "datashift_audio_player/icons";
        # @import "yams_audio/player";
        # @import "datashift_audio_player/playlist";
        # @import "datashift_audio_player/volume";
      end

    end
  end
end

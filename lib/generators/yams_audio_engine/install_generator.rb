require 'rails/generators/base'

module YamsAudio
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("../../templates", __FILE__)

      desc "Creates a Yams Audio Engine initializer within your parent Rails application."
      class_option :orm

      def copy_initializer
        template "yams_audio.rb", "config/initializers/yams_audio.rb"
      end

    end
  end
end

require 'rails/generators/base'

module DatashiftAudioEngine
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("../../templates", __FILE__)

      desc "Creates a DataShift Audio Engine initializer within your parent Rails application."
      class_option :orm

      def copy_initializer
        template "datashift_audio_engine.rb", "config/initializers/datashift_audio_engine.rb"
      end

    end
  end
end

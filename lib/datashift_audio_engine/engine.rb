module DatashiftAudioEngine
  class Engine < ::Rails::Engine
    isolate_namespace DatashiftAudioEngine

    # Add a load path for this specific Engine
    config.autoload_paths += Dir["#{config.root}/lib/**/"]

    config.assets.paths << root.join("app", "assets", "javascripts", "datashift_audio_engine")
    config.assets.paths << root.join("vendor", "assets", "javascripts")

    config.assets.precompile += %w[*.png]

    config.generators do |g|
      g.test_framework :rspec, :fixture => false
      g.fixture_replacement :factory_girl, :dir => 'spec/factories'

      g.assets false
      g.helper false
    end
  end
end

module YamsAudioEngine
  class Engine < ::Rails::Engine
    isolate_namespace YamsAudioEngine

    # Add a load path for this specific Engine
    pp "#{config.root}/lib/yams_audio_engine"
    config.autoload_paths += ["#{config.root}/lib/yams_audio_engine"]

    config.assets.paths << root.join("app", "assets", "javascripts", "yams_audio_engine")
    config.assets.paths << root.join("vendor", "assets", "javascripts")

    config.assets.precompile += %w[*.png]
  end
end

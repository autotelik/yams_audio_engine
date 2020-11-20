module YamsAudioEngine


  class Engine < ::Rails::Engine
    isolate_namespace YamsAudioEngine

    # Add a load path for this specific Engine
   # config.autoload_paths += ["#{config.root}/lib/yams_audio_engine"]

    config.assets.paths << root.join("app", "assets", "stylesheets", "yams_audio_engine")
    config.assets.paths << root.join("app", "assets", "javascripts", "yams_audio_engine")
    config.assets.paths << root.join("vendor", "assets", "javascripts")

    config.assets.precompile += %w[*.png]

    initializer "webpacker.proxy" do |app|
      insert_middleware = begin
        YamsAudioEngine.webpacker.config.dev_server.present?
      rescue
        nil
      end
      next unless insert_middleware

      app.middleware.insert_before(
          0, Webpacker::DevServerProxy, # "Webpacker::DevServerProxy" if Rails version < 5
          ssl_verify_none: true,
          webpacker: YamsAudioEngine.webpacker
      )
    end
  end
end

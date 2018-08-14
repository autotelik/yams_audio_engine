Rails.application.routes.draw do
  mount DatashiftAudioEngine::Engine => "/datashift_audio_engine"
end

$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "yams_audio_engine/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "yams_audio_engine"
  s.version     = YamsAudioEngine::VERSION
  s.authors     = ["Thomas Statter"]
  s.email       = ["tomstatter@autotelik.co.uk"]
  s.homepage    = "http://google.com"
  s.summary     = "Rails Engine for Playing Audio"
  s.description = "Rails Engine for Playing Audio"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", ">= 5.2"

  s.add_development_dependency "sqlite3"
end

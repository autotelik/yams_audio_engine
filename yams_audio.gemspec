$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "yams_audio/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "yams_audio"
  s.version     = YamsAudio::VERSION
  s.authors     = ["Thomas Statter"]
  s.email       = ["tomstatter@autotelik.com"]
  s.homepage    = "https://yams.fm"
  s.summary     = "Rails Engine for Playing Audio"
  s.description = "Rails Engine for Playing Audio"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", ">= 6.0"

  s.add_development_dependency "sqlite3"
end

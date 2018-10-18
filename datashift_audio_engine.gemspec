$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "datashift_audio_engine/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "datashift_audio_engine"
  s.version     = DatashiftAudioEngine::VERSION
  s.authors     = ["Yevhenii Kushvid", "Thomas Statter"]
  s.email       = ["e.kushvid@sloboda-studio.com"]
  s.homepage    = "http://google.com"
  s.summary     = "Rails Engine for Playing Audio"
  s.description = "Rails Engine for Playing Audio"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 5.2.0"
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'capybara'
  s.add_development_dependency 'factory_girl_rails'

  s.test_files = Dir["spec/**/*"]

  s.add_development_dependency "sqlite3"
end

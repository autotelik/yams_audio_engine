$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "datashift_audio/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "datashift_audio"
  s.version     = DatashiftAudio::VERSION
  s.authors     = ["Yevhenii Kushvid"]
  s.email       = ["e.kushvid@sloboda-studio.com"]
  s.homepage    = "http://google.com"
  s.summary     = "Summary of DatashiftAudio."
  s.description = "Description of DatashiftAudio."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 5.2.0"

  s.add_development_dependency "sqlite3"
end

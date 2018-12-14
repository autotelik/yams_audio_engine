source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Declare your gem's dependencies in datashift_audio_engine.gemspec.
# Bundler will treat runtime dependencies like base dependencies, and
# development dependencies will be added by default to the :development group.
gemspec

# Declare any dependencies that are still in development here instead of in
# your gemspec. These might include edge Rails or gems from your path or
# Git. Remember to move these dependencies to your gemspec before releasing
# your gem to rubygems.org.

# To use a debugger
# gem 'byebug', group: [:development, :test]
group :development, :test do
  gem 'byebug'

  gem 'ffaker'
  gem 'rspec-rails', '~> 3.4'
  gem 'coffee-rails'
  
  gem 'teaspoon-jasmine'
  gem 'teaspoon-mocha'
  gem 'teaspoon-qunit'

  gem 'jquery-rails'
  
  gem 'codeclimate-test-reporter', '~> 1.0.0'
  gem 'simplecov'
end
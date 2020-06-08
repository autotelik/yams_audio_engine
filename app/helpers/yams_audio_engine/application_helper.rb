require "webpacker/helper"

module YamsAudioEngine
  module ApplicationHelper
    include ::Webpacker::Helper

    def current_webpacker_instance
      YamsAudioEngine.webpacker
    end
  end
end
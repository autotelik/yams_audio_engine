require "webpacker/helper"

module YamsAudio
  module ApplicationHelper
    include ::Webpacker::Helper

    def current_webpacker_instance
      YamsAudio.webpacker
    end
  end
end
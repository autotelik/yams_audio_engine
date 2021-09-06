# frozen_string_literal: true

module YamsAudio
  module Services

    extend ActiveSupport::Concern

    class_methods do
      def call(*args)
        new(*args).call
      end
    end

  end
end

# frozen_string_literal: true

module YamsAudio
  class Presenter < SimpleDelegator

    attr_reader :view_context
    attr_reader :model

    include ActionView::Helpers::TextHelper
    include ActionView::Helpers::TagHelper

    # Enable Presenters to access view_context helpers too
    #
    include Rails.application.routes.url_helpers

    # include YamsCore::Engine.routes.url_helpers
    # extend YamsCore::Engine.routes.url_helpers
    #
    # include YamsCore::FormHelper
    # include YamsCore::BootstrapHelper

    delegate :polymorphic_path, :link_to, :yams_audio, to: :@view_context

    def initialize(model, view_context)
      super(model)
      @view_context = view_context
      @model = model
    end

    def cover_image_tag(size: :thumb, options: {})
      return unless respond_to?(:cover_image)
      cover = cover_image(size: size)
      return unless cover
      options[:class] ||= 'avatar img-fluid rounded'
      view_context.image_tag(Rails.application.routes.url_helpers.rails_blob_path(cover, only_path: true), options)
    end

    def sortable_id
      "#{model.class.name.underscore.pluralize.downcase.gsub(/\//,'_')}-#{model.id}"
    end

  end
end

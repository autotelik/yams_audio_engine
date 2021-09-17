# frozen_string_literal: true

module YamsAudio
  class Presenter < SimpleDelegator

    attr_reader :view
    attr_reader :model

    include ActionView::Helpers::TextHelper
    include ActionView::Helpers::TagHelper

    # Enable Presenters to access view_context helpers too
    #
    include Rails.application.routes.url_helpers

    delegate :polymorphic_path, :link_to, :yams_audio, to: :@view

    def initialize(model, view: view_context)
      super(model)
      @view = view
      @model = model
    end

    def cover_image_tag(size: :thumb, options: {})
      return unless respond_to?(:cover_image)
      cover = cover_image(size: size)
      return unless cover
      
      options[:class] ||= 'avatar img-fluid rounded'
      view.image_tag(rails_blob_path(cover, only_path: true), options)
    end

    def sortable_id
      "#{model.class.name.underscore.pluralize.downcase.gsub(/\//,'_')}-#{model.id}"
    end

  end
end

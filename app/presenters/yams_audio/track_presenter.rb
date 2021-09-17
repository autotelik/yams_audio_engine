# frozen_string_literal: true
module YamsAudio
  class TrackPresenter < YamsAudio::Presenter


    delegate :audio, to: :model, allow_nil: true

    def initialize(track: nil, view:)
      super(track, view: view)

      track.build_cover unless track.nil? || track.cover.present?
    end

    def cover_image_path(size: :thumb)
      rails_blob_path(cover_image(size: size), only_path: true)
    end

  
    def cover_image(size: :thumb)
      return YamsCore::DefaultCover.for_track.image unless model && model.cover.try(:attached?)
      @track_cover ||= model.cover
      @track_cover.image
    end

    def duration
      track.try(:display_duration) || "00:00"
    end

    def track_name
      track.try(:title) || "Track Name"
    end

    def artist_name
      track.try(:artist_name) || "Artist Name"
    end

    def track
      model
    end

  end
end

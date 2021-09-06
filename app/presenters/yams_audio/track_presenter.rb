# frozen_string_literal: true
module YamsAudio
  class TrackPresenter < YamsAudio::Presenter


    delegate :audio, to: :model, allow_nil: true

    def initialize(track: nil, view_context:)
      super(track, view_context)

      track.build_cover unless track.nil? || track.cover.present?
    end

    def cover_image(size: :thumb)
      @cover_image ||= track.present? && track.cover.try(:attached?) ? track.cover : YamsCore::DefaultCover.for_track
      @cover_image.image
    end

    def cover_image_path(size: :thumb)
      rails_blob_path(cover_image(size: size), only_path: true)
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

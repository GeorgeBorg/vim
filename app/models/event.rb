class Event < ActiveRecord::Base
	acts_as_mappable

	geocoded_by :where, :latitude  => :lat, :longitude => :lng

	scope :preference_location, -> (location) { where location: location } #Location param from preferences
	scope :future_events, -> { where 'time > ?', Time.now } #Future events only

	def filters
	    if preference_where.present?
	      @location = preference_where
	    else
	      @location = request.location
	    end

	    if distance.present?
	      @location = preference_where
	    else
	      @location = request.location
	    end
	end

end

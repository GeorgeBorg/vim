json.array!(@events) do |event|
  json.extract! event, :id, :user_id, :when, :what, :where, :description, :private
  json.url event_url(event, format: :json)
end

require 'net/http'

class WebhookService

  def fire_event(entry_type, user_id)
    webhooks = Webhook.where(user_id: user_id, entry: entry_type)
    if webhooks.nil?
      return
    end
    webhooks.each do |webhook|
      send_request(webhook.url, webhook.entry, 'A hook fires!')
    end
  end

  private

  def send_request(url, entry_type, message)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    request = Net::HTTP::Post.new(uri.request_uri)
    request['Content-Type'] = 'application/json'
    request.body = {
      entry_type: entry_type,
      message: message
    }.to_json
    http.request(request)
  end
end

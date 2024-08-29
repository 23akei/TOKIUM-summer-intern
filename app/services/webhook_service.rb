require 'net/http'
require 'uri'

class WebhookService
  def fire_event(entry_type, user_id, data)
    webhooks = Webhook.where(user_id: user_id, entry: entry_type)
    if webhooks.nil?
      return
    end
    webhooks.each do |webhook|
      send_request(webhook.url, webhook.entry, data)
    end
  end

  private

  def valid_url?(url)
    if url =~ URI::regexp
      # Correct URL
      true
    else
      # Invalid URL
      false
    end
  end
  
  def send_request(url, entry_type, data)
    unless valid_url?(url)
      puts "Invalid url: #{url}"
      return
    end
    
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.path.empty? ? "/" : uri.path)
    request['Content-Type'] = 'application/json'
    request.body = {
      entry_type: entry_type,
      data: data
    }.to_json
    http.request(request)
  end
end

require 'rails_helper'
require './app/helpers/rate_helper'
RSpec.configure do |config|
  config.extend RateHelper
end

RSpec.describe RateHelper, type: :helper do
  context 'has access' do
    it "to the helper methods defined in the module" do
      expect(help).to be(:available)
    end
  end
end

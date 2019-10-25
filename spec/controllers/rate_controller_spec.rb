require 'rails_helper'

RSpec.describe RateController, type: :controller do
  context 'GET rate#index' do
    it 'assigns @rates' do
      rate = Rate.create
      get :index
      expect(assigns(:rates)).to eq([rate])
    end

    it 'renders the index template' do
      FactoryBot.build(:rate)
      get :index
      expect(response).to render_template("index")
    end
  end

  context "JSON" do
    it 'rate#index should return successful response' do
      request.accept = "application/json"
      get :index
      expect(response).to be_successful
    end

    it "render JSON" do
      FactoryBot.build(:rate)
      get :index, format: :json
      expect(response).to be_successful
    end
  end
end

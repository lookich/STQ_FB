require 'rails_helper'

RSpec.describe AdminController, type: :controller do
  context 'GET admin#index' do
    it 'assigns @data' do
      data = Admin.create
      get :index
      expect(assigns(:data)).to eq([data])
    end

    it 'renders the index template' do
      FactoryBot.build(:admin)
      get :index
      expect(response).to render_template("index")
    end

    it "render JSON" do
      FactoryBot.build(:admin)
      get :index, format: :json
      expect(response).to be_successful
    end

    it "returns parsed response" do
      get :index, format: :json
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(2)
    end
  end

  context 'POST admin#create' do
    it 'create a new admin rate' do
      expect { FactoryBot.create(:admin) }.to change(Admin, :count).by(1)
    end

    it 'renders the index template' do
      FactoryBot.build(:admin)
      get :index
      expect(response).to render_template("index")
    end
  end

  context "JSON" do
    it 'admin#index should return successful response' do
      request.accept = "application/json"
      get :index
      expect(response).to be_successful
    end

    it "returns parsed response" do
      get :index, format: :json
      FactoryBot.build(:admin)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(2)
    end
  end

end

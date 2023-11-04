const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Tests', () => {
  it('should retrieve a list of bookings', async () => {
    const response = await chai.request('https://restful-booker.herokuapp.com').get('/booking');
    
    // Example assertion, you might need to adjust based on the actual API response structure
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
  });

  // Add more test cases for other API endpoints as needed
});

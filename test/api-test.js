const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Tests', () => {
  let authToken; // Store the authentication token for later use
  let bookingId; // Store the booking ID for later use

  it('should create a new authentication token', async () => {
    const credentials = {
      "username": "your-username",
      "password": "your-password"
    };

    const response = await chai.request('https://restful-booker.herokuapp.com').post('/auth').send(credentials);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('token');
    authToken = response.body.token;
  });

  it('should handle invalid credentials', async () => {
    const invalidCredentials = {
      "username": "invalid-username",
      "password": "invalid-password"
    };

    const response = await chai.request('https://restful-booker.herokuapp.com').post('/auth').send(invalidCredentials);

    expect(response).to.have.status(401);
  });
  
  it('should create a new booking', async () => {
    const bookingData = {
      "firstname": "John",
      "lastname": "Doe",
      "totalprice": 150,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2023-01-01",
        "checkout": "2023-01-05"
      },
      "additionalneeds": "Breakfast"
    };

    const response = await chai.request('https://restful-booker.herokuapp.com').post('/booking').send(bookingData);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('bookingid');
    bookingId = response.body.bookingid;
  });

  it('should retrieve the details of a specific booking', async () => {
    const response = await chai.request('https://restful-booker.herokuapp.com').get(`/booking/${bookingId}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('firstname').equal('John');
    expect(response.body).to.have.property('lastname').equal('Doe');
    expect(response.body).to.have.property('totalprice').to.be.a('number');
    expect(response.body).to.have.property('depositpaid').to.be.a('boolean');
    expect(response.body).to.have.property('bookingdates').to.be.an('object');
    expect(response.body.bookingdates).to.have.property('checkin').to.match(/\d{4}-\d{2}-\d{2}/);
    expect(response.body.bookingdates).to.have.property('checkout').to.match(/\d{4}-\d{2}-\d{2}/);
    expect(response.body).to.have.property('additionalneeds').to.be.a('string');
  });

  it('should retrieve a list of bookings', async () => {
    const response = await chai.request('https://restful-booker.herokuapp.com').get('/booking');
    
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
  });

it('should update the details of a specific booking', async () => {
  const updatedBookingData = {
    "firstname": "UpdatedJohn",
    "lastname": "UpdatedDoe",
    "totalprice": 200,
    "depositpaid": false,
    "bookingdates": {
      "checkin": "2023-02-01",
      "checkout": "2023-02-05"
    },
    "additionalneeds": "No breakfast"
  };

  const response = await chai.request('https://restful-booker.herokuapp.com').put(`/booking/${bookingId}`).send(updatedBookingData);

  expect(response).to.have.status(200);
  expect(response.body).to.have.property('firstname').equal('UpdatedJohn');
  expect(response.body).to.have.property('lastname').equal('UpdatedDoe');
  expect(response.body).to.have.property('totalprice').equal(200);
});

it('should delete a specific booking', async () => {
  const response = await chai.request('https://restful-booker.herokuapp.com').delete(`/booking/${bookingId}`);

  expect(response).to.have.status(200);
  expect(response.body).to.have.property('id').equal(bookingId);
  expect(response.body).to.have.property('message').equal('Booking Deleted Successfully');
});

it('should retrieve the booking IDs by date range', async () => {
  const startDate = '2023-01-01';
  const endDate = '2023-02-01';

  const response = await chai.request('https://restful-booker.herokuapp.com').get(`/booking?checkin=${startDate}&checkout=${endDate}`);

  expect(response).to.have.status(200);
  expect(response.body).to.be.an('array');
  expect(response.body).to.not.be.empty;
  response.body.forEach(booking => {
  expect(booking).to.have.property('bookingid');
});
});

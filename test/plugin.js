import request from 'supertest'
import appMock from './utils/app'
import Token from './models/token'
import User from './models/user'
import accessTokenFixture from './fixtures/access-token'
import refreshTokenFixture from './fixtures/refresh-token'
import userFixture from './fixtures/user'
import {
  setup,
  teardown
} from './utils/db'

const app = appMock()

describe('netiam-contrib', () => {

  before(setup)
  after(teardown)

  it('should create a user and token pair', done => {
    User
      .create(userFixture)
      .then(() => Promise.all([
        Token.create(accessTokenFixture),
        Token.create(refreshTokenFixture)
      ]))
      .then(() => done())
      .catch(done)
  })

  it('should authenticate user w/ basic auth', done => {
    request(app)
      .get('/users')
      .auth(userFixture.email, userFixture.password)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        const json = res.body

        json.should.have.properties([
          'id',
          'email',
          'username',
          'password',
          'birthday',
          'createdAt',
          'updatedAt'
        ])
      })
      .end(done)
  })

  it('should authenticate user w/ bearer token', done => {
    request(app)
      .get('/users')
      .set('Authorization', `Bearer ${accessTokenFixture.token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        const json = res.body

        json.should.have.properties([
          'id',
          'email',
          'username',
          'password',
          'birthday',
          'createdAt',
          'updatedAt'
        ])
      })
      .end(done)
  })

  it('should authenticate user w/ password - GET request', done => {
    request(app)
      .get(`/users?email=${userFixture.email}&password=${userFixture.password}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        const json = res.body

        json.should.have.properties([
          'id',
          'email',
          'username',
          'password',
          'birthday',
          'createdAt',
          'updatedAt'
        ])
      })
      .end(done)
  })

  it('should authenticate user w/ password - POST request', done => {
    request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        email: userFixture.email,
        password: userFixture.password
      })
      .expect(200)
      .expect(res => {
        const json = res.body

        json.should.have.properties([
          'id',
          'email',
          'username',
          'password',
          'birthday',
          'createdAt',
          'updatedAt'
        ])
      })
      .end(done)
  })

})

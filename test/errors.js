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

  it('should force invalid username error', done => {
    request(app)
      .get('/users')
      .auth('wrong username', userFixture.password)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
        const json = res.body
        json.id.should.eql(4001)
      })
      .end(done)
  })

  it('should force invalid password error', done => {
    request(app)
      .get('/users')
      .auth(userFixture.email, 'wrong password')
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
        const json = res.body
        json.id.should.eql(4002)
      })
      .end(done)
  })

})

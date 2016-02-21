import request from 'supertest'
import User from './models/user'
import {
  setup,
  teardown
} from './utils/db'

describe('netiam-contrib', () => {

  before(setup)
  after(teardown)

  it('should create a user', done => {
    User
      .create({})
      .then(() => done())
      .catch(done)
  })

})

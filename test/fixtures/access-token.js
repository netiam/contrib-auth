import uuid from 'uuid'
import moment from 'moment'
import userFixture from './user'

export default Object.freeze({
  id: uuid.v4(),
  token: uuid.v4(),
  type: 'access_token',
  expires_at: moment().add(1, 'hour').format(),
  ownerId: userFixture.id
})

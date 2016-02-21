import uuid from 'uuid'
import moment from 'moment'
import userFixture from './user'

export default Object.freeze({
  id: uuid.v4(),
  token: uuid.v4(),
  type: 'refresh_token',
  expires_at: moment().add(2, 'weeks').format(),
  ownerId: userFixture.id
})

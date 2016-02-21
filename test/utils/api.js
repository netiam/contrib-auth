import json from 'netiam-contrib-json'
import transform from 'netiam-contrib-transform'
import auth from '../../src/auth'

export const plugins = {
  auth,
  json,
  transform
}

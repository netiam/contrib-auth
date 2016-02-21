import express from 'express'
import netiam from 'netiam'
import {plugins} from './api'
import User from '../models/user'

export default function(app) {

  const router = express.Router()

  router.get(
    '/users',
    netiam({plugins})
      .auth({model: User})
      .json()
  )

  app.use('/', router)

}

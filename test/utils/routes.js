import express from 'express'
import netiam from 'netiam'
import {plugins} from './api'
import Token from '../models/token'
import User from '../models/user'

export default function(app) {

  const router = express.Router()

  router.get(
    '/users',
    netiam({plugins})
      .auth({
        userModel: User,
        tokenModel: Token
      })
      .transform((req, res) => res.body = req.user)
      .json()
  )

  router.post(
    '/users',
    netiam({plugins})
      .auth({
        userModel: User,
        tokenModel: Token
      })
      .transform((req, res) => res.body = req.user)
      .json()
  )

  app.use('/', router)

}

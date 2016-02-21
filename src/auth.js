import assert from 'assert'
import bcrypt from 'bcrypt-as-promised'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import {
  BasicStrategy,
  DigestStrategy
} from 'passport-http'
import BearerStrategy from 'passport-http-bearer'
import Promise from 'bluebird'

export default function({
  userModel,
  tokenModel,
  validatePassword = bcrypt.compare,
  validateToken = 'validateToken',
  usernameField = 'email',
  passwordField = 'password'}) {

  assert.ok(userModel)
  assert.ok(tokenModel)

  function handle(username, password, done) {
    userModel
      .findOne({where: {[usernameField]: username}})
      .then(user => {
        if (!user) {
          return done(new Error('Invalid user'))
        }
        // TODO allow selection of password validation strategy
        return validatePassword(password, user[passwordField])
          .then(() => {
            done(null, user.toJSON())
          })
      })
      .catch(bcrypt.MISMATCH_ERROR, () => {
        console.log()
        done(new Error('Invalid password'))
      })
      .catch(done)
  }

  function handleBearer(token, done) {
    tokenModel
      .findOne({
        where: {
          token,
          type: 'access_token'
        }
      })
      .then(token => {
        if (!token) {
          return done(new Error('Invalid token'))
        }
        // TODO check if token has expired
        return token.getOwner()
      })
      .then(owner => {
        if (!owner) {
          return done(new Error('Token has invalid owner'))
        }
        done(null, owner.toJSON())
      })
      .catch(done)
  }

  const spec = {
    usernameField,
    passwordField
  }

  passport.serializeUser((user, done) => {
    // TODO get user ID from primaryKeys -> adapter refactoring
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    userModel
      .findOne({where: {id: id}})
      .then(user => done(null, user))
      .catch(done)
  })

  passport.use(new BasicStrategy(spec, handle))
  passport.use(new BearerStrategy(spec, handleBearer))
  passport.use(new DigestStrategy(spec, handle))
  passport.use(new LocalStrategy(spec, handle))

  return function(req, res) {
    return new Promise((resolve, reject) => {
      passport.authenticate([
          'basic',
          'bearer',
          'digest',
          'local'
        ],
        {session: false},
        (err, user) => {
          if (err) {
            return reject(err)
          }

          if (!user) {
            // TODO resolve but user is guest from now on!
            return resolve()
          }

          req.logIn(user, err => {
            if (err) {
              return reject(err)
            }
            resolve()
          })
        })(req, res)
    })
  }

}

import assert from 'assert'
import bcrypt from 'bcrypt-as-promised'
import {HTTPError} from 'netiam-errors'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import {
  BasicStrategy,
  DigestStrategy
} from 'passport-http'
import BearerStrategy from 'passport-http-bearer'
import Promise from 'bluebird'
import {
  AUTH_ERROR,
  AUTH_INVALID_USERNAME,
  AUTH_INVALID_PASSWORD,
  AUTH_TOKEN_EXPIRED,
  AUTH_INVALID_TOKEN,
  AUTH_TOKEN_OWNER_MISMATCH
} from './errors'

function isValidToken(token) {
  const ok = (new Date(token.expires_at)).getTime() > (new Date()).getTime()
  return ok ? Promise.resolve() : Promise.reject(new HTTPError(AUTH_TOKEN_EXPIRED))
}

export default function({
  userModel,
  tokenModel,
  validatePassword = bcrypt.compare,
  validateToken = isValidToken,
  usernameField = 'email',
  passwordField = 'password'}) {

  assert.ok(userModel)
  assert.ok(tokenModel)

  function handle(username, password, done) {
    userModel
      .findOne({where: {[usernameField]: username}})
      .then(user => {
        if (!user) {
          return done(new HTTPError(AUTH_INVALID_USERNAME))
        }
        // TODO allow selection of password validation strategy
        return validatePassword(password, user[passwordField])
          .then(() => done(null, user.toJSON()))
      })
      .catch(bcrypt.MISMATCH_ERROR, () => done(new HTTPError(AUTH_INVALID_PASSWORD)))
      .catch(err => done(new HTTPError(AUTH_ERROR)))
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
          return done(new HTTPError(AUTH_INVALID_TOKEN))
        }
        // TODO allow selection of token validation strategy
        return validateToken(token).then(() => token.getOwner())
      })
      .then(owner => {
        if (!owner) {
          return done(new HTTPError(AUTH_TOKEN_OWNER_MISMATCH))
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
              return reject(new HTTPError(AUTH_ERROR))
            }
            resolve()
          })
        })(req, res)
    })
  }

}

import Sequelize from 'sequelize'
import {db} from '../utils/db'

const Role = db.define('Role', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    isUUID: 4,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  }
})

export default Role

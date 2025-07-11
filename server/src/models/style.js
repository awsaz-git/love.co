import { DataTypes } from 'sequelize'
import sequelize from '../db.js'
import Product from './product.js'

const Style = sequelize.define('Style', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'styles',
    timestamps: false
})

export default Style

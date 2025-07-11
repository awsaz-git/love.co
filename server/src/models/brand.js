import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

const Brand = sequelize.define('Brand', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'brands',
    timestamps: false
})

export default Brand

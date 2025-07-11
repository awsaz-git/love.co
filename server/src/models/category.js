import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

const Category = sequelize.define('Category', {
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
    tableName: 'categories',
    timestamps: false
})

export default Category

import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Color = sequelize.define('Color', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    product_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    tableName: 'colors',
    timestamps: false
});

export default Color;

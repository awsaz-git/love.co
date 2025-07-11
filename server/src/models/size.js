import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Size = sequelize.define('Size', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    color_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    measurements: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    tableName: 'sizes',
    timestamps: false
});

export default Size;

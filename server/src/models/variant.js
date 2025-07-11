import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Variant = sequelize.define('Variant', {
    sku: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    product_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    size_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'variants',
    timestamps: false
});

export default Variant;

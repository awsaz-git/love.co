import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generateNanoId = customAlphabet(alphabet, 6);

const Product = sequelize.define('Product', {
    code: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => generateNanoId()
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    style_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: false
})

export default Product
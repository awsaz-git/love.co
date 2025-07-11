import Brand from './brand.js'
import Style from './style.js'
import Category from './category.js'
import Product from './product.js'
import Review from './review.js'
import Color from './color.js'
import Size from './size.js'
import Variant from './variant.js'

// Brand - Product (1:M)
Brand.hasMany(Product, { foreignKey: 'brand_id' })
Product.belongsTo(Brand, { foreignKey: 'brand_id' })

// Style - Product (1:M)
Style.hasMany(Product, { foreignKey: 'style_id' })
Product.belongsTo(Style, { foreignKey: 'style_id' })

// Category - Product (1:M)
Category.hasMany(Product, { foreignKey: 'category_id' })
Product.belongsTo(Category, { foreignKey: 'category_id' })

// Product - Review (1:M)
Product.hasMany(Review, { foreignKey: 'product_code', sourceKey: 'code' })
Review.belongsTo(Product, { foreignKey: 'product_code', targetKey: 'code' })

// Product - Color (1:M)
Product.hasMany(Color, { foreignKey: 'product_code', sourceKey: 'code' })
Color.belongsTo(Product, { foreignKey: 'product_code', targetKey: 'code' })

// Color - Size (1:M)
Color.hasMany(Size, { foreignKey: 'color_id' })
Size.belongsTo(Color, { foreignKey: 'color_id' })

// Product - Variant (1:M)
Product.hasMany(Variant, { foreignKey: 'product_code', sourceKey: 'code' })
Variant.belongsTo(Product, { foreignKey: 'product_code', targetKey: 'code' })

// Color - Variant (1:M)
Color.hasMany(Variant, { foreignKey: 'color_id' })
Variant.belongsTo(Color, { foreignKey: 'color_id' })

// Size - Variant (1:M)
Size.hasMany(Variant, { foreignKey: 'size_id' })
Variant.belongsTo(Size, { foreignKey: 'size_id' })
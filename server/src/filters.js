import { Op, QueryError } from 'sequelize';
import sequelize from './db.js';
import './models/index.js'
import { Brand, Category, Product, Style } from './models/index.js';

const getBrands = async () => {
    return await Brand.findAll();
}

const getCategories = async () => {
    return await Category.findAll();
}

const getStyles = async () => {
    return await Style.findAll();
}

const getNewArrivals = async () => {
    return await sequelize.query(`
            SELECT * FROM product_card_view 
            WHERE total_stock > 0
            ORDER BY created_at DESC 
            LIMIT 10
    `);
}

const getOnSale = async () => {
    return await sequelize.query(`
            SELECT * FROM product_card_view 
            WHERE discount > 0 AND total_stock > 0
            ORDER BY discount DESC
            LIMIT 10
            `);
}

const getProduct = async (productCode) => {
    return await sequelize.query(`
            SELECT * FROM product_full_view 
            WHERE product_code = $1`,
        {
            bind: [productCode],
            type: sequelize.QueryTypes.SELECT
        }
    );
}

const completeTheLook = async (productCode) => {
    const { category_id, style_id } = await Product.findOne({
        attributes: ['category_id', 'style_id'],
        where: {
            code: { [Op.eq]: productCode }
        }
    })

    const category = await Category.findOne({
        attributes: ['name'],
        where: {
            id: { [Op.eq]: category_id }
        }
    })

    const style = await Style.findOne({
        attributes: ['name'],
        where: {
            id: { [Op.eq]: style_id }
        }
    })

    return await sequelize.query(`
        SELECT * FROM (
        SELECT *,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY created_at DESC) AS rn
        FROM product_card_view
        WHERE category != $1 AND style = $2 AND total_stock > 0
        ) sub
         WHERE rn = 1
         LIMIT 4;`,
        {
            bind: [category.get('name'), style.get('name')],
            type: sequelize.QueryTypes.SELECT
        }
    );
}

const youMayAlsoLike = async (productCode) => {
    const { brand_id, style_id } = await Product.findOne({
        attributes: ['brand_id', 'style_id'],
        where: {
            code: { [Op.eq]: productCode }
        }
    })

    const brand = await Brand.findOne({
        attributes: ['name'],
        where: {
            id: { [Op.eq]: brand_id }
        }
    })

    const style = await Style.findOne({
        attributes: ['name'],
        where: {
            id: { [Op.eq]: style_id }
        }
    })

    return await sequelize.query(`
        SELECT * FROM (
        SELECT *,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY created_at DESC) AS rn
        FROM product_card_view
        WHERE (brand = $1 OR style = $2) AND total_stock > 0 AND code != $3
        ) sub
        WHERE rn <= 3
        ORDER BY RANDOM()
        LIMIT 15;`,
        {
            bind: [brand.get('name'), style.get('name'), productCode],
            type: sequelize.QueryTypes.SELECT
        }
    );
}

const getAllProducts = async () => {
    return await sequelize.query(`
            SELECT * FROM product_card_view 
            LIMIT 16
    `);
}

const getProductBySKU = async (sku) => {
    return await sequelize.query(`
            SELECT * FROM cart_item_view WHERE sku = $1
    `, {
        bind: [sku],
        type: sequelize.QueryTypes.SELECT
    });
}

const getProductsWithFilter = async (param, price, search) => {
    let query = `SELECT * FROM product_card_view`
    const values = []
    let bindIndex = 1

    if (search) {
        query = `SELECT * FROM search_products($${bindIndex++})`
        values.push(search.split(' ').join(' and '))
    }

    const filters = param.split('-').flatMap(el => el.split('&'))

    const categoryList = await getCategories()
    const brandList = await getBrands()
    const styleList = await getStyles()

    const categoryNames = categoryList.map(c => c.name)
    const brandNames = brandList.map(b => b.name)
    const styleNames = styleList.map(s => s.name)

    const genderFilters = []
    const categoryFilters = []
    const brandFilters = []
    const styleFilters = []
    const flags = []

    let hasOrderBy = false

    filters.forEach(filter => {
        if (['men', 'women'].includes(filter)) {
            if (!genderFilters.includes(filter)) genderFilters.push(filter)
            if (!genderFilters.includes('unisex')) genderFilters.push('unisex')
        } else if (filter === 'unisex') {
            if (!genderFilters.includes('unisex')) genderFilters.push('unisex')
        }
        else if (categoryNames.includes(filter)) categoryFilters.push(filter)
        else if (brandNames.includes(filter)) brandFilters.push(filter)
        else if (styleNames.includes(filter)) styleFilters.push(filter)
        else if (['on_sale', 'new_arrivals'].includes(filter)) flags.push(filter)
    })

    const conditions = []

    const pushGroup = (list, column) => {
        if (list.length > 0) {
            const group = list.map(() => `${column} = $${bindIndex++}`).join(' OR ')
            values.push(...list)
            conditions.push(`(${group})`)
        }
    }

    pushGroup(genderFilters, 'gender')
    pushGroup(categoryFilters, 'category')
    pushGroup(brandFilters, 'brand')
    pushGroup(styleFilters, 'style')

    if (flags.includes('on_sale')) {
        conditions.push(`discount > 0 AND total_stock > 0`)
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ')
    }

    if (flags.includes('new_arrivals')) {
        query += ` ORDER BY created_at DESC`
        hasOrderBy = true
    }

    if (price) {
        if (hasOrderBy) {
            query += `, `
        }
        if (!hasOrderBy) {
            query += ` ORDER BY`
        }
        if (price === 'low_high') {
            query += ` price - (price * (discount / 100)) ASC`
        }
        if (price === 'high_low') {
            query += ` price - (price * (discount / 100)) DESC`
        }
    }

    query += ` LIMIT 16`

    console.log(query)
    console.log(values)

    return await sequelize.query(query, {
        bind: values,
        type: sequelize.QueryTypes.SELECT
    })
}

const search = async (searchQuery) => {

    return await sequelize.query(`SELECT * FROM search_products($1) LIMIT 6`, {
        bind: [searchQuery],
        type: sequelize.QueryTypes.SELECT
    })
}

export {
    getBrands,
    getNewArrivals,
    getOnSale,
    getProduct,
    completeTheLook,
    youMayAlsoLike,
    getCategories,
    getProductsWithFilter,
    getStyles,
    getAllProducts,
    search,
    getProductBySKU
}

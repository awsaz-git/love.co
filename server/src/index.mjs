import express from 'express';
import sequelize from './db.js';
import './models/index.js'
import { getBrands, getNewArrivals, getOnSale, getProduct, completeTheLook, youMayAlsoLike, getCategories, getProductsWithFilter, getStyles, getAllProducts } from './filters.js'
import cors from 'cors'

const app = express();

try {
    await sequelize.authenticate()
    // await sequelize.sync({ alter: true })
    console.log('DB Connection Successful.')
} catch (error) {
    console.error('DB Connection Failed:', error)
}

app.use(cors({
    origin: 'http://localhost:3000'
}))


app.get('/api/nav-bar', async (req, res) => {
    try {
        const brands = await getBrands()
        const categories = await getCategories()

        res.json({ brands, categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch nav bar data' })
    }
})

app.get('/api/home-page', async (req, res) => {
    try {
        const brands = await getBrands()

        const [newArrivals] = await getNewArrivals()

        const [onSale] = await getOnSale()

        res.json({ brands, newArrivals, onSale });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch homepage data' });
    }
});

app.get('/api/product-code/:code', async (req, res) => {
    try {
        const [product] = await getProduct(req.params.code)

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const completeTheLookProducts = await completeTheLook(req.params.code)

        const youMayAlsoLikeProducts = await youMayAlsoLike(req.params.code)

        res.json({ product, completeTheLookProducts, youMayAlsoLikeProducts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch product data' });
    }
})

app.get('/api/products/:filters', async (req, res) => {
    try {
        const categories = await getCategories()
        const brands = await getBrands()
        const styles = await getStyles()
        const products = await getProductsWithFilter(req.params.filters, req.query.price)

        res.json({ categories, brands, styles, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

app.listen(5000)
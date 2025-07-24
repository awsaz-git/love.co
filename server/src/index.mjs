import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import sequelize from './db.js';
import './models/index.js'
import { getBrands, getNewArrivals, getOnSale, getProduct, completeTheLook, youMayAlsoLike, getCategories, getProductsWithFilter, getStyles, getAllProducts, search, getProductBySKU } from './filters.js'
import cors from 'cors'
import { addToCart, applyVoucher, getCart, getCartInfo, getCartQuantity, getVoucher, removeFromCart } from './cart.js';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { v4 } from 'uuid';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    if (!req.cookies.cart_id) {
        const cart_id = v4();
        res.cookie('cart_id', cart_id, { httpOnly: true, maxAge: 86400000, sameSite: 'lax' })
        req.cart_id = cart_id
    } else {
        req.cart_id = req.cookies.cart_id
    }

    next()
})

try {
    await sequelize.authenticate()
    // await sequelize.sync({ alter: true })
    console.log('DB Connection Successful.')
} catch (error) {
    console.error('DB Connection Failed:', error)
}


app.get('/nav-bar', async (req, res) => {
    try {
        const brands = await getBrands()
        const categories = await getCategories()
        const cartItems = await getCartQuantity(req.cart_id)
        let quantity = 0

        cartItems.forEach(item => {
            quantity += Number(item.quantity)
        })

        res.json({ brands, categories, quantity })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch nav bar data' })
    }
})

app.get('/home-page', async (req, res) => {
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

app.get('/product-code/:code', async (req, res) => {
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

app.get('/products/:filters', async (req, res) => {
    try {
        const categories = await getCategories()
        const brands = await getBrands()
        const styles = await getStyles()
        const products = await getProductsWithFilter(req.params.filters, req.query.price, req.query.search)

        res.json({ categories, brands, styles, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.searchValue || ''
        const products = await search(searchQuery.split(' ').join(' and '))

        res.json({ products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to search for products' })
    }
})

app.get('/product-sku', async (req, res) => {
    try {
        const [product] = await getProductBySKU(req.query.sku)

        res.json({ product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get product' })
    }
})

app.post('/cart', async (req, res) => {
    try {
        const { sku, quantity } = req.body

        res.json(await addToCart(sku, quantity, req.cart_id))
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to cart' })
    }
})

app.get('/cart', async (req, res) => {
    try {
        const cart = await getCart(req.cart_id)
        const [info] = await getCartInfo(req.cart_id)
        if (info.voucher_code) {
            const [voucher] = await getVoucher(info.voucher_code)
            res.json({ cart, info, voucher })
        }

        res.json({ cart, info })
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to cart' })
    }
})

app.delete('/cart/:sku', async (req, res) => {
    try {
        const result = await removeFromCart(req.params.sku, req.cart_id)

        res.json({ result })
    } catch (error) {
        res.status(500).json({ error: 'Could not delete item' })
    }
})

app.get('/voucher/:voucher', async (req, res) => {
    try {
        const [voucher] = await getVoucher(req.params.voucher)

        if (voucher) {
            await applyVoucher(req.cart_id, voucher.code, voucher.discount_value, voucher.discount_type)
        }

        res.json({ voucher })
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch voucher' })
    }
})

app.listen(process.env.PORT)
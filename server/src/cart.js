import { Op, QueryError } from 'sequelize';
import sequelize from './db.js';
import './models/index.js'

const addToCart = async (sku, quantity, cart_id) => {
    let [cart] = await sequelize.query(`
        SELECT * FROM carts WHERE uuid = $1
        `, {
        bind: [cart_id],
        type: sequelize.QueryTypes.SELECT
    })

    if (!cart) {
        //create the cart first if the cart does not exist

        await sequelize.query(`
                INSERT INTO carts(
                uuid, user_id, total, voucher_code)
                VALUES ($1, null, 0, null);
            `, {
            bind: [cart_id],
            type: sequelize.QueryTypes.INSERT
        })

        cart = await sequelize.query(`
        SELECT * FROM carts WHERE uuid = $1
        `, {
            bind: [cart_id],
            type: sequelize.QueryTypes.SELECT
        })
    }
    //add item if the cart already exists
    const [item] = await sequelize.query(`
        SELECT * FROM cart_items WHERE cart_uuid = $1 AND product_sku = $2
        `, {
        bind: [cart_id, sku],
        type: sequelize.QueryTypes.SELECT
    })

    const [product] = await sequelize.query(`
            SELECT * FROM cart_item_view WHERE sku = $1
            `, {
        bind: [sku],
        type: sequelize.QueryTypes.SELECT
    })
    const stock = product.stock

    if (!item) {
        // more than stock
        if (quantity > stock) return { error: `Size limited to ${stock} purchases` }

        await sequelize.query(`
            INSERT INTO cart_items(
	cart_uuid, product_sku, quantity)
	VALUES ($1, $2, $3);
            `, {
            bind: [cart_id, sku, quantity],
            type: sequelize.QueryTypes.INSERT
        })

        const [product] = await sequelize.query(`
            SELECT *
	FROM cart_item_view WHERE sku = $1
            `, {
            bind: [sku],
            type: sequelize.QueryTypes.SELECT
        })
        let newTotal = 0

        for (let i = 0; i < quantity; i++) {
            newTotal += Number(product.price) - (Number(product.price) * (Number(product.discount) / 100))
        }

        await sequelize.query(`
            UPDATE carts SET total = total + $1 WHERE uuid = $2
            `, {
            bind: [newTotal, cart_id],
            type: sequelize.QueryTypes.UPDATE
        })

        console.log(cart.voucher_code)

        if (cart.voucher_code) {
            const [voucher] = await sequelize.query(`
                SELECT * FROM vouchers WHERE code = $1
                `, {
                bind: [cart.voucher_code],
                type: sequelize.QueryTypes.SELECT
            })

            applyVoucher(cart_id, cart.voucher_code, voucher.discount_value, voucher.discount_type)
        }

        return { product, quantity }
    } else {
        const newQuantity = item.quantity + quantity

        // more than stock
        if (newQuantity > stock) return { error: `Size limited to ${stock} purchases` }

        await sequelize.query(`
            UPDATE cart_items
            SET quantity=$1
            WHERE product_sku = $2;
            `, {
            bind: [newQuantity, sku],
            type: sequelize.QueryTypes.UPDATE
        })

        const [product] = await sequelize.query(`
            SELECT *
	FROM cart_item_view WHERE sku = $1
            `, {
            bind: [sku],
            type: sequelize.QueryTypes.SELECT
        })

        let newTotal = 0

        for (let i = 0; i < quantity; i++) {
            newTotal += Number(product.price) - (Number(product.price) * (Number(product.discount) / 100))
        }

        await sequelize.query(`
            UPDATE carts SET total = total + $1 WHERE uuid = $2
            `, {
            bind: [newTotal, cart_id],
            type: sequelize.QueryTypes.UPDATE
        })

        if (cart.voucher_code) {
            const [voucher] = await sequelize.query(`
                SELECT * FROM vouchers WHERE code = $1
                `, {
                bind: [cart.voucher_code],
                type: sequelize.QueryTypes.SELECT
            })

            applyVoucher(cart_id, cart.voucher_code, voucher.discount_value, voucher.discount_type)
        }

        return { product, quantity }
    }
}

const getCart = async (uuid) => {
    return await sequelize.query(`
        SELECT * FROM cart_items_view WHERE cart_uuid = $1
`, {
        bind: [uuid],
        type: sequelize.QueryTypes.SELECT
    }
    )
}

const removeFromCart = async (sku, cart_uuid) => {
    const [product] = await sequelize.query(`
            SELECT *
	FROM cart_items_view WHERE sku = $1 AND cart_uuid = $2
            `, {
        bind: [sku, cart_uuid],
        type: sequelize.QueryTypes.SELECT
    })

    let newTotal = 0

    for (let i = 0; i < product.quantity; i++) {
        newTotal += Number(product.price) - (Number(product.price) * (Number(product.discount) / 100))
    }

    await sequelize.query(`
            UPDATE carts SET total = total - $1 WHERE uuid = $2
            `, {
        bind: [newTotal, cart_uuid],
        type: sequelize.QueryTypes.UPDATE
    })

    const [cart] = await sequelize.query(`
        SELECT * FROM carts WHERE uuid = $1
        `, {
        bind: [cart_uuid],
        type: sequelize.QueryTypes.SELECT
    })

    console.log(cart.voucher_code)

    if (cart.voucher_code) {
        const [voucher] = await sequelize.query(`
                SELECT * FROM vouchers WHERE code = $1
                `, {
            bind: [cart.voucher_code],
            type: sequelize.QueryTypes.SELECT
        })

        applyVoucher(cart_uuid, cart.voucher_code, voucher.discount_value, voucher.discount_type)
    }

    return await sequelize.query(`
        DELETE FROM cart_items WHERE product_sku = $1 AND cart_uuid = $2
        `, {
        bind: [sku, cart_uuid],
        type: sequelize.QueryTypes.DELETE
    })
}

const getCartQuantity = async (cart_uuid) => {
    return await sequelize.query(`
        SELECT quantity FROM cart_items WHERE cart_uuid = $1
        `, {
        bind: [cart_uuid],
        type: sequelize.QueryTypes.SELECT
    })
}

const getVoucher = async (voucher) => {
    return await sequelize.query(`
        SELECT * FROM vouchers WHERE code = $1
        `, {
        bind: [voucher],
        type: sequelize.QueryTypes.SELECT
    })
}

const getCartInfo = async (uuid) => {
    return await sequelize.query(`
        SELECT * FROM carts WHERE uuid = $1
        `, {
        bind: [uuid],
        type: sequelize.QueryTypes.SELECT
    })
}

const applyVoucher = async (uuid, code, discount, type) => {
    const [cart] = await sequelize.query(`
        SELECT * FROM carts WHERE uuid = $1
        `, {
        bind: [uuid],
        type: sequelize.QueryTypes.SELECT
    })

    const total = cart.total
    let newTotal = 0

    if (type === 'percentage') {
        newTotal = total - (total * Number(discount) / 100)
    }
    if (type === 'amount') {
        newTotal = total - discount
    }

    await sequelize.query(`
        UPDATE carts SET voucher_code = $1, discounted_total = $2 WHERE uuid = $3
        `, {
        bind: [code, newTotal, uuid],
        type: sequelize.QueryTypes.UPDATE
    })
}

export {
    addToCart,
    getCart,
    removeFromCart,
    getCartQuantity,
    getVoucher,
    getCartInfo,
    applyVoucher
}
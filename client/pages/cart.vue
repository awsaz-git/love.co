<script setup>
import { AlertCircle, ArrowRight, CheckCircle, LoaderCircle, TicketPercent, X } from 'lucide-vue-next'

const { data, error, refresh } = await useFetch('/api/cart', {
    credentials: 'include'
})

const voucher = ref('')
const isOpen = ref(false)
const voucherError = ref(false)
const loadingPromo = ref(false)

const getQuantity = () => {
    let quantity = 0;

    data.value.cart.forEach(el => {
        quantity += el.quantity
    });

    return quantity
}

const getDiscount = (price, discount) => {
    const discounted = price - (price * (discount / 100))
    return Math.ceil(discounted)
}

const getProductCost = () => {
    let cost = 0
    data.value.cart.forEach(el => {
        cost += getDiscount(Number(el.price), Number(el.discount))
    })

    return cost
}

const applyPromo = async () => {
    if (voucher.value.trim() === '') return

    loadingPromo.value = true
    const { data, error } = await useFetch('/api/voucher/' + voucher.value)

    if (!data.value.voucher) {
        voucherError.value = true
        loadingPromo.value = false
        return
    }

    await refresh()
    loadingPromo.value = false
}

watch(() => voucher.value, async () => {
    voucher.value = voucher.value.toUpperCase()
    voucherError.value = false
})

</script>

<template>
    <div class="cart-container">
        <div v-if="error || data.cart.length < 1" class="header-s empty-bag">
            YOUR BAG IS EMTPY
        </div>
        <div v-else class="cart-content">
            <div class="bag-items">
                <div class="header-s">YOUR BAG</div>
                <div class="title=l">TOTAL: ({{ getQuantity() }} items) <span class="semibold">${{ getProductCost()
                }}</span>
                </div>
                <div class="cards">
                    <CardsCartProduct v-for="product in data.cart" :data="product" :onRefresh="refresh" />
                </div>
            </div>
            <div class="bag-info">
                <div class="header-xs">
                    ORDER SUMMARY
                </div>
                <div class="top-bag-info">
                    <div class="title-m normal">
                        {{ getQuantity() }} Item
                    </div>
                    <div class="title-m normal price">
                        Product Cost: <span>${{ getProductCost() }}</span>
                    </div>
                    <div class="title-m normal price">
                        Delivery Cost: <span>${{ data.info.delivery_fee }}</span>
                    </div>
                </div>
                <div class="line"></div>
                <div class="section">
                    <div v-if="!data.info.voucher_code" class="title-m price">
                        Total: <span>${{ Number(data.info.total) + Number(data.info.delivery_fee) }}</span>
                    </div>
                    <div v-else class="title-m price">
                        Total: <span> <span class="original">${{ data.info.total }}</span> ${{
                            Number(data.info.discounted_total) + Number(data.info.delivery_fee) }}</span>
                    </div>
                    <div v-if="data.info.voucher_code" class="title-m price">
                        Discount: <span class="discount-amount">-{{ data.voucher.discount_value }}%</span>
                    </div>
                    <div v-if="!isOpen && !data.info.voucher_code" class="promo-button">
                        <TicketPercent :stroke-width="1" :size="24" />
                        <div class="title-m promo-text" @click="isOpen = true">
                            USE A PROMO CODE
                        </div>
                    </div>
                    <div v-else-if="!data.info.voucher_code" class="voucher-container">
                        <div class="voucher-field">
                            <input v-model="voucher" type="text" placeholder="Enter Promo Code"
                                class="voucher-input title-m normal" @keyup.enter="applyPromo()">
                        </div>
                        <div v-if="voucherError" class="title-s normal error">
                            <AlertCircle color="#B7000D" stroke-width="1" :size="18" />
                            PROMO CODE IS INVALID OR EXPIRED
                        </div>
                        <div class="apply-button" @click="applyPromo()">
                            <div class="title-m">
                                APPLY
                            </div>
                            <LoaderCircle v-if="loadingPromo" class="loading-icon" />
                            <ArrowRight v-else />
                        </div>
                    </div>
                    <div v-if="data.info.voucher_code" class="applied-promo">
                        <div class="title-m normal">
                            <span class="semibold">Promo Code:</span> {{ data.info.voucher_code }}
                        </div>
                        <X :size="20" class="remove-promo" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    padding-top: 40px;
}

.empty-bag {
    width: 85%;
}

.cart-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 25px;
    width: 85%;
}

.bag-items {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 55%;
}

.cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.bag-info {
    display: flex;
    flex-direction: column;
    width: 40%;
    gap: 25px;
}

.top-bag-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
}

.line {
    height: 0.5px;
    width: 100%;
    background-color: #000000;
}

.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 7.5px;
}

.price {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.original {
    opacity: 0.5;
    text-decoration: line-through;
}

.discount-amount {
    color: var(--accent-2);
}

.voucher-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 70%;
}

.voucher-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 10px;
    border: 1px solid #000000;
}

.voucher-input {
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
}

.promo-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px
}

.promo-text {
    width: fit-content;
    cursor: pointer;
    background-color: transparent;
    color: #000000;
    text-decoration: underline;
    transition: all 0.1s ease;
}

.promo-text:hover {
    background-color: #000000;
    color: #FFFFFF;
}

.apply-button {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 15px 15px;
    box-sizing: border-box;
    border: 1px solid #000000;
    cursor: pointer;
    transition: all 0.5s ease;
}

.apply-button:active {
    transform: translateY(1px);
}

.error {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    color: #B7000D;
}

.loading-icon {
    stroke: #000000;
}

.loading-icon {
    animation: spin 1.5s linear infinite;
}

.applied-promo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    width: 100%;
}

.remove-promo {
    cursor: pointer;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}


@media (max-width: 1280px) {
    .cart-content {
        width: 90%;
    }
}

@media (max-width: 960px) {
    .cards {
        gap: 5px;
    }

    .bag-items {
        width: 100%;
    }

    .cart-content {
        width: 95%;
        flex-direction: column;
    }

    .bag-info {
        width: 100%;
    }

    .empty-bag {
        width: 90%;
    }

    .voucher-container {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .cards {
        gap: 25px;
    }
}
</style>
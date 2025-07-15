<script setup>
import { X } from 'lucide-vue-next';
import { getData, setData } from 'nuxt-storage/local-storage';

const modal = useModal()

const sku = ref(null)
const quantity = ref(0)
const totalQuantity = ref(0)
const totalPrice = ref(0)
const deliveryCost = ref(5)

const { data, error, refresh } = await useFetch('http://localhost:5000/api/product-sku', {
    query: { sku }
})

function getDiscount(price, discount) {
    const discounted = price - (price * (discount / 100))
    return Math.ceil(discounted)
}

watch(() => modal.isOpen, async (isOpened) => {
    if (!isOpened) return

    const cart = getData('cart') || null
    if (cart === null) return

    quantity.value = 0
    totalQuantity.value = 0
    totalPrice.value = 0

    let index = cart.length - 1
    sku.value = cart.at(index).sku
    quantity.value = cart.at(index).quantity
    cart.forEach(async item => {
        const sku = item.sku
        totalQuantity.value += item.quantity
        const { data, error } = await useFetch('http://localhost:5000/api/product-sku', {
            query: { sku }
        })

        totalPrice.value += data.value.product.price - (data.value.product.price * (data.value.product.discount / 100))
    });

    refresh()
})

</script>

<template>
    <Transition name="overlay">
        <div v-if="modal.openedModal === 'addedToCart'" class="modal-container">
            <div class="modal-content">
                <div class="header-s">
                    SUCCESSFULLY ADDED TO BAG
                </div>
                <div class="info">
                    <div class="product-card">
                        <NuxtImg :src="data.product.image" class="image" />
                        <div class="right-info">
                            <div class="title-m normal">
                                {{ data.product.name.toUpperCase() }}
                            </div>
                            <div v-if="Number(data.product.discount) === 0" class="title-m">
                                ${{ data.product.price }}
                            </div>
                            <div v-if="data.product.discount > 0" class="title-m discount">
                                <div class="original">
                                    ${{ data.product.price }}
                                </div>
                                ${{ getDiscount(data.product.price, data.product.discount) }}
                                <div class="discount-amount">
                                    -{{ data.product.discount }}%
                                </div>
                            </div>
                            <div>
                                <div class="title-m normal">
                                    Color: {{ unslugify(data.product.color_name).join() }}
                                </div>
                                <div class="title-m normal">
                                    Size: {{ unslugify(data.product.size).join() }}
                                </div>
                                <div class="title-m normal">
                                    Quantity: {{ modal.quantity }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="bag-info">
                        <div class="top-bag-info">
                            <div class="title-s normal">
                                Your Bag
                            </div>
                            <div class="title-m normal">
                                {{ totalQuantity }} Item
                            </div>
                            <div class="title-m normal price">
                                Product Cost: <span>${{ totalPrice }}</span>
                            </div>
                            <div class="title-m normal price">
                                Delivery Cost: <span>${{ deliveryCost }}</span>
                            </div>
                        </div>
                        <div class="line-2"></div>
                        <div class="title-m price">
                            Total: <span>${{ totalPrice + deliveryCost }}</span>
                        </div>
                        <ButtonsFilled to="/user/cart" class="view-bag-button" label="View Bag"
                            @click="modal.close()" />
                    </div>
                </div>
                <div class="exit-button" @click="modal.close()">
                    <X />
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #00000040;
    width: 100vw;
    height: 100vh;
    z-index: 99998;
}

.modal-content {
    position: relative;
    width: 50%;
    display: flex;
    gap: 25px;
    box-sizing: border-box;
    padding: 20px;
    flex-direction: column;
    background-color: #FFFFFF;
    z-index: 99999;
}

.exit-button {
    position: absolute;
    padding: 5px 5px 2px;
    background-color: #FFFFFF;
    border: 1px solid #000000;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    cursor: pointer;
}

.info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
}

.right-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
}

.product-card {
    display: flex;
    flex-direction: row;
    width: 45%;
    align-items: start;
    gap: 10px;
}

.image {
    aspect-ratio: 1/1;
    width: 50%;
    height: auto;
    object-fit: cover;
    object-position: center;
}

.original {
    opacity: 0.5;
    text-decoration: line-through;
}

.discount {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.discount-amount {
    color: var(--accent-2);
    padding: 0px 5px;
    margin-left: auto;
}

.line {
    height: 100%;
    width: 0.5px;
    background-color: #000000;
}

.line-2 {
    height: 0.5px;
    width: 100%;
    background-color: #000000;
}

.bag-info {
    display: flex;
    flex-direction: column;
    width: 45%;
    gap: 15px;
}

.top-bag-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5px;
}

.price {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.view-bag-button {
    padding: 10px 0px !important;
    width: 100% !important;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.5s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.overlay-enter-to,
.overlay-leave-from {
    opacity: 1;
}

@media (max-width: 960px) {
    .overlay {
        height: 100svh;
    }

    .modal-container {
        height: 100svh;
        justify-content: end;
    }

    .modal-content {
        width: 100%;
    }

    .discount-amount {
        margin-left: unset;
        padding-left: 35px;
    }

    .image {
        width: auto;
        height: 100%;
    }

    .exit-button {
        transform: translate(0, -50%);
    }

    .line {
        display: none;
    }

    .product-card {
        height: 150px;
    }

    .info {
        flex-direction: column;
        gap: 25px;
    }

    .bag-info {
        width: 100%;
        gap: 20px;
    }

}
</style>
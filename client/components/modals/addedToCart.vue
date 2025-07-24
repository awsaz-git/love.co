<script setup>
import { X } from 'lucide-vue-next';
import { getData, setData } from 'nuxt-storage/local-storage';

const addToCartModal = useModal()

const props = defineProps({
    data: Object
})

const cart = ref([])
const deliveryFee = ref(5)

const { data, error, refresh } = await useFetch('/api/cart', {
    credentials: 'include'
})

const getDiscount = (price, discount) => {
    const discounted = price - (price * (discount / 100))
    return Math.ceil(discounted)
}

const getQuantity = () => {
    let quantity = 0;

    data.value.cart.forEach(el => {
        quantity += el.quantity
    });

    return quantity
}

const getTotal = () => {
    let total = 0;

    data.value.cart.forEach(el => {
        for (let i = 0; i < el.quantity; i++) {
            total += getDiscount(Number(el.price), Number(el.discount))
        }
    });

    return total
}

watch(() => addToCartModal.isOpen, async (isOpen) => {
    if (isOpen) {
        await refresh()
    }
})

</script>

<template>
    <Transition name="overlay">
        <div v-if="addToCartModal.isOpen" class="modal-container">
            <div class="modal-content">
                <div class="header-s">
                    SUCCESSFULLY ADDED TO BAG
                </div>
                <div class="info">
                    <div class="product-card">
                        <NuxtImg :src="props.data.product.image" class="image" />
                        <div class="right-info">
                            <div class="title-m normal">
                                {{ props.data.product.name.toUpperCase() }}
                            </div>
                            <div v-if="Number(props.data.product.discount) === 0" class="title-m">
                                ${{ props.data.product.price }}
                            </div>
                            <div v-if="props.data.product.discount > 0" class="title-m discount">
                                <div class="original">
                                    ${{ props.data.product.price }}
                                </div>
                                ${{ getDiscount(props.data.product.price, props.data.product.discount) }}
                                <div class="discount-amount">
                                    -{{ props.data.product.discount }}%
                                </div>
                            </div>
                            <div>
                                <div class="title-m normal">
                                    Color: {{ unslugify(props.data.product.color_name).join() }}
                                </div>
                                <div class="title-m normal">
                                    Size: {{ unslugify(props.data.product.size).join() }}
                                </div>
                                <div class="title-m normal">
                                    Quantity: {{ props.data.quantity }}
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
                                {{ getQuantity() }} Item
                            </div>
                            <div class="title-m normal price">
                                Product Cost: <span>${{ getTotal() }}</span>
                            </div>
                            <div class="title-m normal price">
                                Delivery Cost: <span>${{ deliveryFee }}</span>
                            </div>
                        </div>
                        <div class="line-2"></div>
                        <div class="title-m price">
                            Total: <span>${{ getTotal() + deliveryFee }}</span>
                        </div>
                        <ButtonsFilled to="/cart" class="view-bag-button" label="View Bag"
                            @click="addToCartModal.close()" />
                    </div>
                </div>
                <div class="exit-button" @click="addToCartModal.close()">
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
        height: 100dvh;
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
        width: 100%;
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
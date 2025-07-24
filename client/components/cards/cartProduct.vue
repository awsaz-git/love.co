<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
    data: Object,
    onRefresh: Function
})

const navbarRefresh = useNavbarRefresh()
const slug = slugify(props.data.name)
const link = '/' + slug + '/' + props.data.product_code

const getDiscount = (price, discount) => {
    const discounted = price - (price * (discount / 100))
    return Math.ceil(discounted)
}

const removeProduct = async (sku) => {
    await useFetch('/api/cart/' + sku, {
        method: 'delete',
        credentials: 'include'
    })

    props.onRefresh()
    navbarRefresh.toggle()
}

</script>

<template>
    <div class="cart-product-card">
        <X @click="removeProduct(props.data.sku)" class="delete-icon" />
        <NuxtLink :to="link" class="image-wrapper">
            <NuxtImg :src="props.data.image" class="image" />
        </NuxtLink>
        <div class="right-info">
            <div class="top-info">
                <div class="title-l normal title">
                    {{ props.data.name.toUpperCase() }}
                </div>
                <div v-if="Number(props.data.discount) === 0" class="title-m">
                    ${{ props.data.price }}
                </div>
                <div v-if="props.data.discount > 0" class="title-m discount">
                    <div class="original">
                        ${{ props.data.price }}
                    </div>
                    ${{ getDiscount(props.data.price, props.data.discount) }}
                    <div class="discount-amount">
                        -{{ props.data.discount }}%
                    </div>
                </div>
            </div>
            <div class="bottom-info">
                <div class="title-m normal">
                    Color: {{ unslugify(props.data.color_name).join() }}
                </div>
                <div class="title-m normal">
                    Size: {{ unslugify(props.data.size).join() }}
                </div>
                <div class="title-m normal">
                    Quantity: {{ props.data.quantity }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cart-product-card {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: start;
    gap: 10px;
    border: 1px solid #000000;
}

.image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    width: 50%;
    height: auto;
    background-color: var(--secondary-3);
}

.image {
    width: 100%;
    height: 100%;
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

.right-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
}

.delete-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

.top-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5px;
    width: 100%;
}

.bottom-info {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.title {
    max-width: 90%;
}

@media (max-width: 600px) {
    .cart-product-card {
        border: unset;
    }

    .right-info {
        padding: unset;
    }

    .delete-icon {
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
    }

    .discount-amount {
        margin-left: unset;
    }
}
</style>
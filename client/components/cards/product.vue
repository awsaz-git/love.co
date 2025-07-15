<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
    data: Object,
    isMiniDisplay: {
        type: Boolean,
        default: false
    }
})

const product = props.data

const slug = slugify(product.title)
const link = '/' + slug + '/' + product.code
const isSelected = ref(false)
const displayImage = ref(0)
const images = product.images

function getDiscount() {
    const discounted = product.price - (product.price * (product.discount / 100))
    return Math.ceil(discounted)
}

function hasImageList() {
    return images.length > 1
}

function changeDisplayImage(index) {
    displayImage.value = index;
}

function resetImage() {
    displayImage.value = 0;
    isSelected.value = false;
}

function getStock() {
    return Number(product.total_stock)
}

</script>

<template>
    <div class="card-container">
        <ButtonsHeart v-if="!props.isMiniDisplay" class="wishlist-button" />
        <div v-if="getStock() === 0" class="sold-out subtitle-s">
            Sold Out
        </div>
        <NuxtLink :to="link" @mouseover="isSelected = true" @mouseleave="resetImage()" class="image-container">
            <NuxtImg class="image" :src="images.at(displayImage)" alt="product" v-slot="{ src, isLoaded, imgAttrs }">
                <img v-if="isLoaded" v-bind="imgAttrs" :src="src">
                <div v-else class="placeholder-skeleton"></div>
            </NuxtImg>
            <div v-if="isSelected && hasImageList() && !props.isMiniDisplay" class="image-list">
                <NuxtImg v-for="(image, index) in images.slice(0, 5)" @mouseover="changeDisplayImage(index)"
                    class="mini-image" :class="{ 'displayed': displayImage === index }" :key="index" :src="image"
                    v-slot="{ src, isLoaded, imgAttrs }">
                    <img v-if="isLoaded" v-bind="imgAttrs" :src="src">
                    <div v-else class="placeholder-skeleton"></div>
                </NuxtImg>
            </div>
        </NuxtLink>
        <NuxtLink :to="link" class="info">
            <div v-if="Number(product.discount) === 0" class="title-m">
                ${{ product.price }}
            </div>
            <div v-if="product.discount > 0" class="title-m discount">
                <div class="original">
                    ${{ product.price }}
                </div>
                ${{ getDiscount() }}
                <div class="discount-amount">
                    -{{ product.discount }}%
                </div>
            </div>
            <div class="title-m light">
                {{ product.title }}
            </div>
            <div class="title-m normal brand">
                {{ unslugify(product.brand)[0] }}
            </div>
        </NuxtLink>
    </div>
</template>

<style scoped>
.card-container {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 5px;
    width: 100%;
    border: 1px solid transparent;
    user-select: none;
}

.card-container:hover {
    border: 1px solid black;
}

.image {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1/1;
    width: 100%;
    height: auto;
    background-color: var(--secondary-3);
    box-sizing: border-box;
    object-fit: cover;
    object-position: center;
}

.image-container {
    display: flex;
    flex-direction: column;
    aspect-ratio: 1/1;
    width: 100%;
    height: auto;
}

.image-list {
    display: flex;
    flex-direction: row;
}

.mini-image {
    aspect-ratio: 1/1;
    width: 20%;
    height: auto;
    background-color: var(--secondary-3);
    object-fit: cover;
    object-position: center;
    border-bottom: 1px solid transparent;
}

.mini-image.displayed {
    border-bottom: 1px solid #000000;
}

.info {
    display: flex;
    flex-direction: column;
    padding: 0px 10px 10px;
    box-sizing: border-box;
}

.wishlist-button {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 9998;
}

.brand {
    opacity: 0.5;
}

.sold-out {
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px 15px;
    background-color: #000000;
    color: var(--text-3);
}

.discount {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.original {
    opacity: 0.5;
    text-decoration: line-through;
}

.discount-amount {
    color: var(--accent-2);
    padding: 0px 5px;
    margin-left: auto;
}

.placeholder-skeleton {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: var(--secondary-3);
    animation: pulseOpacity 1.5s infinite ease-in-out;
}

@keyframes pulseOpacity {
    0% {
        opacity: 0.2;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 0.2;
    }
}

@media (max-width: 768px) {
    .image-list {
        display: none;
    }
}

@media (max-width: 500px) {
    .wishlist-button {
        top: 10px;
        right: 10px;
        width: 18px;
        height: 18px;
    }
}
</style>
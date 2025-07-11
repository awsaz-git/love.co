<script setup>
import { ref, onMounted } from 'vue'

const { data, error } = await useFetch('http://localhost:5000/api/home-page')

const images = [
    '/images/featured1.png',
    '/images/featured2.png',
    '/images/featured3.png'
]

const currentImageIndex = ref(0)
const currentImage = computed(() => images[currentImageIndex.value])

const displayedNewArrivals = ref(8)
const displayedOnSale = ref(8)

let intervalId

onMounted(() => {
    intervalId = setInterval(() => {
        currentImageIndex.value = (currentImageIndex.value + 1) % images.length
    }, 5000)
})

onBeforeUnmount(() => {
    clearInterval(intervalId)
})
</script>


<template>
    <div class="container">
        <div class="featured-container">
            <div class="featured-content">
                <transition name="fade-slide" mode="out-in">
                    <NuxtImg src="/images/featured3.png" class="featured-image" preload />
                </transition>
                <div class="featured-text">
                    <div class="header-section">
                        <div class="header header-l">
                            WEAR STORIES, NOT JUST CLOTHES.
                        </div>
                        <div class="title-l sub-header">
                            Every piece has a past, make it part of yours.
                        </div>
                        <ButtonsFilled class="shop-now-button subtitle-l" to="/products/all" label="Shop Now"
                            padding="10px 20px" />
                    </div>
                </div>
            </div>
            <div class="brand-slider">
                <div class="brands">
                    <NuxtImg v-for="(brand, index) in [...data.brands, ...data.brands]" :key="index" class="brand-logo"
                        :src="brand.image" :alt="brand.name" preload />
                </div>
            </div>
        </div>
        <div class="section top">
            <div class="header-l">
                NEW ARRIVALS
            </div>
            <div class="cards">
                <CardsProduct v-for="product in data.newArrivals.slice(0, displayedNewArrivals)" :key="product.code"
                    :data="product" />
            </div>
            <ButtonsUnfilled v-if="displayedNewArrivals === 16" label="View All" :to="'/products/new_arrivals'" />
            <ButtonsUnfilled v-if="data.newArrivals.length > displayedNewArrivals && displayedNewArrivals !== 16"
                label="Load More" @click="displayedNewArrivals += 4" />
        </div>
        <div class="section">
            <div class="header-l">
                ON SALE
            </div>
            <div class="cards">
                <CardsProduct v-for="product in data.onSale.slice(0, displayedOnSale)" :key="product.code"
                    :data="product" />
            </div>
            <ButtonsUnfilled v-if="displayedOnSale === 16" label="View All" :to="'/products/new_arrivals'" />
            <ButtonsUnfilled v-if="data.onSale.length > displayedOnSale && displayedOnSale !== 16" label="Load More"
                @click="displayedOnSale += 4" />
        </div>
        <div class="section style">
            <div class="style-header header-l">
                BROWSE BY STYLE
            </div>
            <div class="style-section">
                <div class="styles-container">
                    <CardsStyle label="vintage" image="/images/vintage.png" />
                    <CardsStyle label="performance" image="/images/performance.png" />
                </div>
                <div class="styles-container second">
                    <CardsStyle label="casual" image="/images/casual.png" />
                    <CardsStyle label="formal" image="/images/formal.png" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100vw;
    gap: 75px;
    overflow-x: hidden;
}

.header-section {
    display: flex;
    flex-direction: column;
    text-align: start;
    gap: 10px;
    width: 90%;
}

.featured-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;
}

.header {
    width: 50%;
}

.sub-header {
    width: 35%;
}

.featured-content {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 600px;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    box-sizing: border-box;
}

.featured-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    transform: scale(1);
    transition: transform 0.3s ease;
}

.sub-header {
    font-weight: 600;
}

.featured-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    position: absolute;
    z-index: 2;
    top: 0;
    transform: translateY(50%);
    left: 0;
    text-align: start;
    width: 100%;
    padding: 50px 0px;
}

.shop-now-button {
    align-self: start;
}

.line {
    width: 1.5px;
    height: 90px;
    border-radius: 15px;
    background-color: #00000010;
}

.brand-slider {
    overflow: hidden;
    width: 100%;
    background-color: #000;
}

.brands {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0px;
    background-color: #000000;
    width: max-content;
    animation: scrollBrands 60s linear infinite
}

.brand-logo {
    width: 150px;
    height: auto;
    padding: 0 75px;
}

.section {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 85%;
    gap: 50px;
}

.section.top {
    border-bottom: 1px solid #00000040;
    padding-bottom: 75px;
}

.section.style {
    box-sizing: border-box;
    padding: 50px 0px;
    width: 95%;
    border-radius: 50px;
    background-color: var(--secondary-3);
}

.style-section {
    display: flex;
    flex-direction: column;
    width: 90%;
    gap: 25px;
}

.styles-container {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 25px;
    width: 100%;
    flex-wrap: wrap;
}

.styles-container.second {
    grid-template-columns: 3fr 2fr;
}

.cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: start;
    width: 100%;
    gap: 5px
}

@keyframes scrollBrands {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-50%);
    }
}

@media (max-width: 1024px) {
    .brand-logo {
        width: 100px;
    }

    .featured-text {
        transform: unset;
    }

    .featured-image {
        transform: scale(1.1);
        object-position: 70% center;
    }

    .style-section {
        gap: 10px;
    }

    .styles-container {
        gap: 10px;
    }

    .cards {
        grid-template-columns: repeat(3, 1fr);
    }

    .section {
        width: 90%;
        gap: 35px;
    }
}

@media (max-width: 768px) {
    .featured-text {
        top: 0;
        bottom: unset;
        gap: 15px;
        padding: 20px 0px;
    }

    .brand-logo {
        width: 75px;
        padding: 0px 50px;
    }

    .shop-now-button {
        padding: 5px 15px !important;
    }

    .featured-image {
        transform: scale(1.2);
    }

    .header {
        width: 60%;
    }

    .sub-header {
        width: 50%;
    }

    .cards {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px
    }

    .section {
        width: 98%;
        gap: 35px;
    }

    .container {
        gap: 50px;
    }

    .section.top {
        padding-bottom: 50px;
    }

    .styles-container {
        display: flex;
        flex-direction: column;
    }

    .section.style {
        width: 90%;
    }
}

@media (max-width: 600px) {
    .featured-content {
        aspect-ratio: 9 / 16;
    }
}

@media (max-width: 480px) {
    .featured-image {
        transform: scale(1.3);
    }

    .header {
        width: 75%;
    }

    .sub-header {
        font-size: 14px;
        width: 50%;
    }

    .cards {
        gap: 5px
    }

    .style-header {
        font-size: 24px;
    }
}

.slider-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
    position: absolute;
    width: 100%;
    height: 100%;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(50px);
}

.fade-slide-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-50px);
}
</style>

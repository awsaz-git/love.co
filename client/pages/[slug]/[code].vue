<script setup>
import { ref, computed, onMounted, nextTick, capitalize } from 'vue'
import { useRoute } from 'vue-router'
import { Check, ArrowDown, ArrowUp, Minus, Plus, AlertCircle } from 'lucide-vue-next'
import { getData, setData } from 'nuxt-storage/local-storage';

const route = useRoute()
const code = route.params.code
const slug = route.params.slug

const displayedImage = ref(0)
const selectedColor = ref(0)
const quantity = ref(0)
const selectedSize = ref(null)
const selector = ref('details')
const reviewsSection = ref(null)
const sizeError = ref(false)
const isMouseover = ref(false)
const miniImagesRef = ref(null)
const isAtTop = ref(true)
const isAtBottom = ref(false)
const reviewsShown = ref(6)
const shownSuggestions = ref(4)
const miniImagesWrapper = ref(null)
const modal = useModal()
const stockError = ref(false)

const { data, error } = await useFetch('http://localhost:5000/api/product-code/' + code)

const changeDisplayImage = (index) => {
    displayedImage.value = index;
}

const changeColor = (index) => {
    if (selectedColor.value === index) {
        return
    }
    selectedSize.value = null;
    selectedColor.value = index;
    displayedImage.value = 0
    setTimeout(updateScrollPosition, 500)
}

const changeSize = (index, colorList) => {
    if (getSizeStock(index, colorList) === 0) {
        return
    }
    if (selectedSize.value === index) {
        return
    }
    selectedSize.value = index;
    quantity.value = 1
    sizeError.value = false
    stockError.value = false
}

function getDiscount(price, discount) {
    const discounted = price - (price * (discount / 100))
    return Math.ceil(discounted)
}

function getStock(colorList) {
    let stock = 0;
    colorList.forEach(color => {
        color.sizes.forEach(size => {
            stock = stock + size.stock
        })
    })

    return stock
}

function getSizeStock(index, colorsList) {
    if (!index) return
    let stock = colorsList[selectedColor.value].sizes[index].stock
    return stock
}

const scrollUp = () => {
    const element = miniImagesRef.value
    if (element) {
        element.scrollBy({
            top: -element.clientHeight,
            behavior: 'smooth'
        })
        setTimeout(updateScrollPosition, 500)

    }
}

const scrollDown = () => {
    const element = miniImagesRef.value
    if (element) {
        element.scrollBy({
            top: element.clientHeight,
            behavior: 'smooth'
        })
        setTimeout(updateScrollPosition, 500)

    }
}

const updateScrollPosition = () => {
    const element = miniImagesRef.value
    if (element) {
        isAtTop.value = element.scrollTop === 0
        isAtBottom.value = element.scrollTop + element.clientHeight >= element.scrollHeight
    }
}

function decrementQuantity() {
    if (selectedSize.value === null) {
        return
    }
    if (quantity.value >= 1) {
        quantity.value--;
        if (quantity.value === 0) {
            selectedSize.value = null
        }
    }
    stockError.value = false
}

function incrementQuantity(colorsList) {
    if (selectedSize.value === null) {
        return
    }
    if (getSizeStock(selectedSize.value, colorsList) > quantity.value) {
        quantity.value++;
    }
    stockError.value = false
}

const addToCart = async (color, size) => {
    if (selectedSize.value === null) {
        sizeError.value = true
        return
    }

    const sku = code.toUpperCase() + '-' + color.toUpperCase() + '-' + size.toUpperCase()
    let cart = getData('cart') || []

    const itemIndex = cart.findIndex(item => item.sku === sku)

    const { data } = await useFetch('http://localhost:5000/api/product-sku', {
        query: { sku }
    })

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity < data.value.product.stock) {
            cart[itemIndex].quantity += quantity.value
        } else {
            stockError.value = true;
            return
        }
    } else {
        cart.push({ sku, quantity: quantity.value })
    }

    setData('cart', cart, 24, 'h')
    modal.open('addedToCart', quantity.value)
}


function changeSelector(name) {
    selector.value = name
}

function getRating(reviewList) {
    let rating = 0;

    if (reviewList === null) {
        return 0
    }
    reviewList.forEach(review => {
        rating = rating + review.rating
    })
    rating = rating / reviewList.length

    return rating
}

function goToReviews() {
    selector.value = 'reviews'
    nextTick(() => {
        reviewsSection.value?.scrollIntoView({ behavior: 'smooth' })
    })
}

onMounted(miniImagesWrapper.value, () => {
    updateScrollPosition()
})

</script>

<template>
    <div v-if="error" class="product-error header-l">
        PRODUCT NOT FOUND
    </div>
    <div v-else class="product-container">
        <div class="nav">
            <NavigationBreadcrumb :items="[
                { name: 'Home', to: '/' },
                { name: unslugify(data.product.gender).join(), to: '/products/' + data.product.gender },
                { name: unslugify(data.product.category).join(), to: '/products/' + data.product.category },
                { name: unslugify(data.product.style).join(), to: '/products/' + data.product.style },
                { name: data.product.name }
            ]" />
        </div>
        <div class="product-display">
            <div class="top tablet">
                <div class="info-top">
                    <div class="header-m">
                        {{ data.product.name }}
                    </div>
                    <div class="rating-container">
                        <ButtonsRating :rating="getRating(data.product.reviews)" />
                        <div @click="goToReviews()" class="subtitle-l reviews-amount">
                            {{ data.product.reviews?.length || 0 }}
                        </div>
                    </div>
                </div>
                <div v-if="Number(data.product.discount) === 0" class="title-xl">
                    ${{ data.product.price }}
                </div>
                <div v-if="Number(data.product.discount) > 0" class="title-xl discount">
                    <div class="original">
                        ${{ data.product.price }}
                    </div>
                    ${{ getDiscount(data.product.price, data.product.discount) }}
                    <div class="discount-amount">
                        -{{ data.product.discount }}%
                    </div>
                </div>
            </div>
            <div class="images-display">
                <template v-if="data.product.colors[selectedColor].images.length > 1">
                    <div @mouseover="isMouseover = true" @mouseleave="isMouseover = false" ref="miniImagesWrapper"
                        class="mini-images-wrapper">
                        <transition name="fade">
                            <div v-if="!isAtTop && isMouseover" @click="scrollUp()" class="scroll-button up">
                                <ArrowUp :stroke-width="1" :size="16" />
                            </div>
                        </transition>
                        <div class="mini-images" ref="miniImagesRef">
                            <NuxtImg :key="selectedColor"
                                v-for="(image, index) in data.product.colors[selectedColor].images" :src="image"
                                :class="{ displayed: displayedImage === index }" @click="changeDisplayImage(index)"
                                :custom="true" v-slot="{ src, isLoaded, imgAttrs }" preload>
                                <img v-if="isLoaded" v-bind="imgAttrs" :src="src">
                                <div v-else class="placeholder-skeleton"></div>
                            </NuxtImg>
                        </div>
                        <transition name="fade">
                            <div v-if="!isAtBottom && isMouseover && miniImagesRef.scrollHeight > miniImagesWrapper.clientHeight"
                                @click="scrollDown()" class="scroll-button down">
                                <ArrowDown :stroke-width="1" :size="16" />
                            </div>
                        </transition>
                    </div>
                </template>
                <div class="big-image">
                    <NuxtImg class="big-image-desktop" :key="selectedColor"
                        :src="data.product.colors[selectedColor].images[displayedImage]" alt="product image"
                        :custom="true" v-slot="{ src, isLoaded, imgAttrs }" preload>
                        <img v-if="isLoaded" v-bind="imgAttrs" :src="src">
                        <div v-else class="placeholder-skeleton"></div>
                    </NuxtImg>
                    <div class="big-image-tablet">
                        <NuxtImg :key="selectedColor"
                            v-for="(image, index) in data.product.colors[selectedColor].images" :src="image"
                            alt="product image" :custom="true" v-slot="{ src, isLoaded, imgAttrs }" preload>
                            <img v-if="isLoaded" v-bind="imgAttrs" :src="src">
                            <div v-else class="placeholder-skeleton"></div>
                        </NuxtImg>
                    </div>
                    <div class="slider-indicator-container">
                        <div class="slider-indicator"
                            v-for="(image, index) in data.product.colors[selectedColor].images" :key="index">
                        </div>
                    </div>
                </div>
            </div>
            <div class="info">
                <div class="top desktop">
                    <div class="header-m">
                        {{ data.product.name }}
                    </div>
                    <div class="rating-container">
                        <ButtonsRating :rating="getRating(data.product.reviews)" />
                        <div @click="goToReviews()" class="subtitle-l reviews-amount">
                            {{ data.product.reviews?.length || 0 }}
                        </div>
                    </div>
                    <div v-if="Number(data.product.discount) === 0" class="title-xl">
                        ${{ data.product.price }}
                    </div>
                    <div v-if="Number(data.product.discount) > 0" class="title-xl discount">
                        <div class="original">
                            ${{ data.product.price }}
                        </div>
                        ${{ getDiscount(data.product.price, data.product.discount) }}
                        <div class="discount-amount">
                            -{{ data.product.discount }}%
                        </div>
                    </div>
                </div>
                <div class="line desktop"></div>
                <div class="section">
                    <div class="title-m normal">
                        Color: <span class="opacity-high">
                            {{ unslugify(data.product.colors[selectedColor].name).join() }}
                        </span>
                    </div>
                    <div class="colors-container">
                        <template v-for="(color, index) in data.product.colors">
                            <div @click="changeColor(index)" class="color-circle"
                                :class="{ border: color.hex == '#FFFFFF' }" :style="{ backgroundColor: color.hex }">
                                <Check v-if="selectedColor === index" :size="18" color="#FFFFFF"
                                    :class="{ black: color.hex == '#FFFFFF' }" />
                            </div>
                        </template>
                    </div>
                </div>
                <div class="line"></div>
                <div class="section">
                    <div v-if="sizeError" class="title-m normal size-error">
                        <AlertCircle :size="18" color="#B7000D" />
                        PLEASE SELECT A SIZE
                    </div>
                    <div v-if="stockError" class="title-m normal size-error">
                        <AlertCircle :size="18" color="#B7000D" />
                        MAX STOCK REACHED FOR THIS SIZE
                    </div>
                    <div v-if="!sizeError && !stockError" class="title-m normal">
                        Sizes
                    </div>
                    <div class="colors-container">
                        <div v-for="(size, index) in data.product.colors[selectedColor].sizes"
                            @click="changeSize(index, data.product.colors)" class="size-button subtitle-l"
                            :class="{ selected: selectedSize === index, disabled: getSizeStock(index, data.product.colors) === 0 }">
                            {{ size.name }}
                        </div>
                    </div>
                    <template v-if="selectedSize !== null">
                        <div v-if="data.product.colors[selectedColor].sizes[selectedSize].measurements"
                            class="measurements-container">
                            <div class="measurement">
                                <div v-for="([key, value]) in Object.entries(data.product.colors[selectedColor].sizes[selectedSize].measurements)"
                                    class="subtitle-m">
                                    {{ unslugify(key.charAt(0).toUpperCase() + key.slice(1)).join() }}: {{ value }}
                                </div>
                            </div>
                        </div>
                        <div v-if="data.product.colors[selectedColor].sizes[selectedSize].stock < 6"
                            class="stock-alert subtitle-m">
                            Only {{ data.product.colors[selectedColor].sizes[selectedSize].stock }} left in stock
                        </div>
                    </template>
                </div>
                <div class="line"></div>
                <div class="bottom-section">
                    <div class="quantity-container">
                        <Minus @click="decrementQuantity()" class="quantity-button" :size="18" />
                        {{ quantity }}
                        <Plus @click="incrementQuantity(data.product.colors)" class="quantity-button" :size="18" />
                    </div>
                    <ButtonsFilled v-if="getStock(data.product.colors) !== 0" height="45px" width="70%"
                        label="ADD TO BAG" @click="addToCart(data.product.colors[selectedColor].name,
                            data.product.colors[selectedColor].sizes[selectedSize]?.name)"
                        :class="{ 'stock-error': stockError }" />
                    <ButtonsFilled v-if="getStock(data.product.colors) === 0" height="45px" width="70%" disabled
                        disabledLabel="OUT OF STOCK" />
                </div>
            </div>
        </div>
        <div class="selector-container" ref="reviewsSection">
            <div @click="changeSelector('details')" class="selector subtitle-xl"
                :class="{ selected: selector === 'details' }">
                Product Details
                <div class="selector-line"></div>
            </div>
            <div @click="changeSelector('reviews')" class="selector subtitle-xl"
                :class="{ selected: selector === 'reviews' }">
                Rating & Reviews
                <div class="selector-line"></div>
            </div>
        </div>
        <div v-if="selector === 'details'" class="details-container">
            <div class="description-container">
                <NuxtLink :to="'/products/' + data.product.brand" class="brand-detail title-l">
                    <NuxtImg class="brand-logo" :src="data.product.brand_image" alt="brand_logo" preload />
                    <!-- {{ unslugify(data.product.brand)[0] }} -->
                </NuxtLink>
                <div class="title-l normal">
                    {{ data.product.description }}
                </div>
                <div class="title-m normal code desktop">
                    Product Code: <span class="opacity-high">{{ data.product.product_code }}</span>
                </div>
            </div>
            <div class="description-container">
                <ul v-for="detail in data.product.details">
                    <li class="title-l normal description-item">{{ detail }}</li>
                </ul>
            </div>
            <div class="title-m normal code tablet">
                Product Code: <span class="opacity-high">{{ data.product.product_code }}</span>
            </div>
        </div>
        <div class="reviews-container" v-if="selector === 'reviews'">
            <div class="reviews-header">
                <div class="reviews-header left">
                    <div class="title-xl">
                        All Reviews
                    </div>
                    <div class="subtitle-xl">
                        ({{ data.product.reviews?.length || '0' }})
                    </div>
                </div>
                <ButtonsFilled class="review-button subtitle-l" label="Write a Review" width="25%" />
            </div>
            <div v-if="data.product.reviews" class="reviews-grid">
                <CardsReview v-for="review in data.product.reviews.slice(0, reviewsShown)" :data="review" />
            </div>
            <ButtonsUnfilled v-if="data.product.reviews && data.product.reviews?.length > reviewsShown"
                @click="reviewsShown += 6" label="Load More Reviews" />
        </div>
        <div class="bottom-container">
            <div v-if="data.completeTheLookProducts && data.completeTheLookProducts?.length > 0" class="cards-section">
                <div class="section-header header-l">
                    COMPLETE THE LOOK
                </div>
                <div class="cards">
                    <CardsProduct v-for="product in data.completeTheLookProducts" :key="product.code" :data="product" />
                </div>
            </div>
            <div v-if="data.youMayAlsoLikeProducts && data.youMayAlsoLikeProducts?.length > 0" class="cards-section">
                <div class="section-header header-l">
                    YOU MAY ALSO LIKE
                </div>
                <div class="cards">
                    <CardsProduct v-for="product in data.youMayAlsoLikeProducts.slice(0, shownSuggestions)"
                        :key="product.code" :data="product" />
                </div>
                <ButtonsUnfilled v-if="data.youMayAlsoLikeProducts?.length > shownSuggestions" label="Load More"
                    @click="shownSuggestions += 4" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-error {
    display: flex;
    flex-direction: row;
    padding-top: 50px;
    width: 85vw;
    justify-self: center;
}

.product-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 25px;
    width: 100vw;
}

.nav {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: 85%;
    box-sizing: border-box;
    padding: 25px 0px 0px;
}

.product-display {
    display: flex;
    flex-direction: row;
    gap: 35px;
    align-items: start;
    width: 85%;
}

.images-display {
    display: flex;
    flex-direction: row;
    width: 55%;
    gap: 5px;
    height: 500px;
}

.mini-images-wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    width: 15%;
    height: 100%;
}

.mini-images {
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    height: 100%;
    gap: 5px;
    height: 100%;
    overflow-y: hidden;
}

.mini-images::-webkit-scrollbar {
    display: none;
}

.scroll-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: #FFFFFF;
    border: 0.5px solid #000000;
    padding: 5px;
    z-index: 10;
}

.rating-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
}

.reviews-amount {
    color: #000000;
    cursor: pointer;
    text-decoration: underline;
}

.scroll-button.up {
    top: 0;
}

.scroll-button.down {
    bottom: 0;
}

.size-error {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    color: #B7000D;
}

.stock-alert {
    color: #B7000D;
}

.mini-images img {
    aspect-ratio: 1 / 1;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    object-fit: cover;
    object-position: center;
    border: 1px solid transparent;
    background-color: var(--secondary-3);
    border-radius: 5px;
}

.mini-images img:hover {
    border: 1px solid #000000;
}

.mini-images img.displayed {
    border: 1px solid #000000;
}

.big-image {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    min-width: 75%;
    flex: 1;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
}

.big-image img {
    height: 100%;
    width: 100%;
    background-color: var(--secondary-3);
    object-fit: cover;
    object-position: center;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 45%;
}

.top {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.bottom-section {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    align-items: center;
}

.quantity-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 25px;
    border-radius: 25px;
    height: 45px;
    box-sizing: border-box;
    background-color: var(--secondary-3);
    user-select: none;
    width: 30%;
    justify-content: space-between;
}

.quantity-button {
    cursor: pointer;
}

.stock-error {
    cursor: not-allowed;
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

.line {
    width: 100%;
    height: 1px;
    border-radius: 10px;
    background-color: #00000020;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.color-circle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    border-radius: 50px;
    cursor: pointer;
}

.color-circle.border {
    border: 0.5px solid #000000;
}

.colors-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.black {
    stroke: #000000;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

.size-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 12.5px;
    border-radius: 15px;
    background-color: var(--secondary-3);
    cursor: pointer;
}

.size-button.selected {
    background-color: var(--secondary-2);
    color: var(--text-3) !important;
}

.size-button.disabled {
    background-color: transparent;
    border: 1px dashed #00000060;
    color: #00000060 !important;
    cursor: not-allowed;
}

.measurements-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 100%;
    width: fit-content;
    padding: 10px 15px;
    background-color: var(--secondary-3);
}

.measurement {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
}

.selector-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    width: 85%;
    padding: 50px 0px 10px;
}

.selector {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 15px;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.selector-line {
    height: 1px;
    width: 100%;
    background-color: #00000020;
    border-radius: 0px;
    transition: all 0.3s ease;
}

.selector.selected {
    color: #000000;
}

.selector.selector.selected .selector-line {
    height: 1.5px;
    background-color: #000000;
    border-radius: 5px;
}

.details-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 85%;
    align-items: start;
}

.description-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 40%;
}

.brand-detail {
    display: flex;
    flex-direction: row;
    gap: 15px;
    width: fit-content;
}

.brand-logo {
    height: 35px;
    filter: invert(1);
    padding: 0px 0px 10px;
}

.reviews-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    gap: 40px;
}

.reviews-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    justify-content: center;
    gap: 15px;
}

.reviews-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.reviews-header.left {
    justify-content: start;
    gap: 10px;
}

.cards-section {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 85%;
    gap: 50px;
}

.section-header {
    text-align: center;
}

.bottom-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 40px;
    padding-top: 75px;
}

.cards {
    display: grid;
    justify-content: center;
    align-items: start;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    width: 100%;
}

.placeholder-skeleton {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: var(--secondary-3);
    animation: pulseOpacity 1.5s infinite ease-in-out;
}

.slider-indicator-container {
    display: none;
}

.big-image-desktop {
    display: block;
}

.big-image-tablet {
    display: none;
}

.top.tablet {
    display: none;
}

.code.tablet {
    display: none;
}

ul {
    padding: 0;
    margin: 0;
    list-style-position: inside;
}

li.description-item {
    margin: 0;
    padding: 0;
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

@media (max-width: 1280px) {
    .nav {
        width: 90%;
    }

    .product-display {
        width: 90%;
    }

    .quantity-container {
        width: 40%;
        padding: 10px 20px;
    }

    .button-container {
        width: 60%;
        padding: 15px 35px !important;
    }

    .images-display {
        height: 450px;
    }

    .review-button {
        width: 40% !important;
    }
}

@media (max-width: 1024px) {
    .cards {
        grid-template-columns: repeat(3, 1fr);
    }

    .cards-section {
        width: 90%;
        gap: 35px;
    }

}

@media (max-width: 960px) {
    .nav {
        width: 95%;
    }

    .product-display {
        flex-direction: column;
        width: 95%;
    }

    .mini-images-wrapper {
        display: none;
    }

    .images-display {
        width: 100vw;
        align-self: center;
        height: fit-content;
    }

    .big-image-desktop {
        display: none;
    }

    .big-image {
        position: relative;
        border-radius: 0px;
        width: 100%;
    }

    .big-image-tablet {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
        flex-grow: unset;
        scrollbar-width: 0;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -ms-overflow-style: none;
        height: fit-content;
        width: 100%;
    }

    .big-image-tablet img {
        aspect-ratio: 1/1;
        width: 100%;
        height: 100%;
        background-color: var(--secondary-3);
        object-fit: cover;
        object-position: center;
    }

    .big-image-tablet::-webkit-scrollbar {
        display: none;
    }

    .big-image-tablet>* {
        scroll-snap-align: start;
        flex-shrink: 0;
    }

    .slider-indicator-container {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        gap: 10px;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
    }

    .slider-indicator {
        width: 15px;
        height: 1px;
        background-color: #000000;

        transition: all 0.5s ease;
    }

    .slider-indicator.displayed {
        height: 3px;
    }

    .info {
        width: 100%;
    }

    .top.desktop {
        display: none;
    }

    .line.desktop {
        display: none;
    }

    .top.tablet {
        display: flex;
    }

    .info-top {
        display: flex;
        flex-direction: column;
        gap: 7.5px;
    }

    .rating-container {
        gap: 15px;
    }

    .details-container {
        flex-direction: column;
        gap: 25px;
    }

    .code.desktop {
        display: none;
    }

    .code.tablet {
        display: flex;
    }

    .description-container {
        width: 100%;
    }
}

@media (max-width: 768px) {
    .cards {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .cards-section {
        width: 98%;
    }

    .brand-logo {
        height: 25px;
    }

    .review-button {
        padding: 10px 5px !important;
        width: 50% !important;
    }

    .reviews-container {
        width: 80%;
    }

    .reviews-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media (max-width: 600px) {
    .review-button {
        padding: 10px 20px !important;
        width: 70% !important;
    }

    .reviews-container {
        width: 95%;
    }

    .reviews-header {
        width: 90%;
    }

    .selector-container {
        width: 100%;
    }
}

@media (max-width: 425px) {
    .bottom-section {
        gap: 10px;
    }

    .quantity-container {
        padding: 10px;
    }

    .review-button {
        padding: 10px 5px !important;
        width: 70% !important;
    }
}
</style>
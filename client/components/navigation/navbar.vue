<script setup>
import { Search, ShoppingBag, CircleUserRound, Heart, Dot, AlignJustify } from 'lucide-vue-next'
import { ref } from 'vue'

const isSelected = ref(false)
const brands = ref([])
const categories = ref([])
const container = ref(null)
const searchContainerOpen = ref(false)

const { data, error } = await useFetch('http://localhost:5000/api/nav-bar')

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

</script>

<template>
    <div class="nav-container">
        <div class="nav-discount">
            <NuxtLink to="/products/on_sale" class="subtitle-l discount-text">
                SUMMER SALE NOW ON! UP TO 70% OFF!
            </NuxtLink>
        </div>
        <div class="nav-content">
            <NuxtLink @click="scrollToTop()" to="/" class="header-s logo">
                LOVE.CO
            </NuxtLink>
            <div class="tabs">
                <ButtonsDropdown label="Shop" :tabs="[{
                    label: 'Men\'s', to: '/products/men', isDropdown: true, tabs: data.categories?.map(category => ({
                        label: capitalizeWords(unslugify(category.name)[0]),
                        to: category.name,
                        isDropdown: false
                    }))
                },
                {
                    label: 'Women\'s', to: '/products/women', isDropdown: true, tabs: data.categories?.map(category => ({
                        label: capitalizeWords(unslugify(category.name)[0]),
                        to: category.name,
                        isDropdown: false
                    }))
                }]" />
                <NuxtLink to="/products/on_sale" class="subtitle-l tab">
                    On Sale
                </NuxtLink>
                <NuxtLink to="/products/new_arrivals" class="subtitle-l tab">
                    New Arrivals
                </NuxtLink>
                <ButtonsDropdown label="Brands" :tabs="data.brands?.map(brand => ({
                    label: capitalizeWords(unslugify(brand.name)[0]),
                    to: '/products/' + brand.name,
                    isDropdown: false
                }))" />

            </div>
            <ButtonsInputField class="input-laptop-view" :icon="Search" placeholder="Search" />
            <div class="actions">
                <Search class="search-laptop-view" @click="searchContainerOpen = true" :stroke-width="1" />
                <NuxtLink class="action" to="/user/wishlist/1234">
                    <Heart :stroke-width="1" />
                </NuxtLink>
                <CircleUserRound :stroke-width="1" />
                <NuxtLink class="action" to="/user/cart/1234">
                    <ShoppingBag :stroke-width="1" />
                </NuxtLink>
            </div>
        </div>
        <div class="nav-content-tablet">
            <NuxtLink to="/" class="header-s logo">
                LOVE.CO
            </NuxtLink>
            <div class="actions">
                <NuxtLink class="action" to="/user/wishlist/1234">
                    <Heart :stroke-width="1" />
                </NuxtLink>
                <NuxtLink class="action" to="/user/cart/1234">
                    <ShoppingBag :stroke-width="1" />
                </NuxtLink>
                <AlignJustify :stroke-width="1" />
            </div>
        </div>
    </div>
    <Transition name="search-container">
        <div v-if="searchContainerOpen" class="search-container">
            <div class="search-content-top">
                <div class="header-s logo">
                    LOVE.CO
                </div>
                <ButtonsInputField :icon="Search" placeholder="Search" />
                <div @click="searchContainerOpen = false" class="subtitle-l">
                    Cancel
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="overlay">
        <div v-if="searchContainerOpen" @click="searchContainerOpen = false" class="overlay"></div>
    </Transition>
</template>

<style scoped>
.nav-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--primary);
    width: 100vw;
    height: 120px;
    top: 0;
    left: 0;
    z-index: 9999;
    border-bottom: 1px solid #00000010;
}

.nav-discount {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: var(--secondary-2);
    padding: 10px 0px;
    height: 20px;
}

.discount-text {
    color: #FFFFFF !important;
}

.discount-text:hover {
    text-decoration: underline;
}

.nav-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 85%;
    padding: 15px 0px;
    gap: 40px;
    box-sizing: border-box;
    height: 100px;
}

.nav-discount div {
    color: var(--text-3) !important;
}

.logo {
    padding-bottom: 5px;
}

.tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 25px;
    height: 100%;
}

.tab {
    color: var(--text);
    cursor: pointer;
}

.tab:hover {
    text-decoration: underline;
}

.search-bar {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    border-radius: 25px;
    background-color: var(--secondary);
    padding: 10px 20px;
    gap: 10px;
    flex: 1;
    border: 2px solid transparent;
    transition: all 0.5s ease;
}

.search-bar.selected {
    border: 2px solid #dedede;
}

.input-container {
    background-color: transparent;
    outline: none;
    border: none;
    flex: 1;
    color: var(--text) !important;
}

.actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.action {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.search-laptop-view {
    display: none;
}

.nav-content-tablet {
    display: none;
}

@media (max-width: 1200px) {
    .input-laptop-view {
        display: none;
    }

    .search-container {
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        position: fixed;
        align-items: center;
        top: 0;
        left: 0;
        width: 100vw;
        height: fit-content;
        z-index: 99999;
        min-height: 300px;
        padding-top: 15px;
    }

    .search-content-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        align-items: center;
        padding: 10px;
        width: 90%;
        gap: 50px;
    }

    .search-laptop-view {
        display: block;
    }

    .search-container-enter-active,
    .search-container-leave-active {
        transition: all 0.25s ease;
    }

    .search-container-enter-from,
    .search-container-leave-to {
        top: -100%
    }

    .search-container-enter-to,
    .search-container-leave-from {
        top: 0;
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

    .overlay {
        background-color: #00000040;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99998;
    }
}

@media (max-width: 960px) {
    .nav-content {
        display: none;
    }

    .nav-content-tablet {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        height: 100px;
    }

    .actions {
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .search-content-top .logo {
        display: none;
    }
}
</style>
<script setup>
import { Search, ShoppingBag, CircleUserRound, Heart, AlignJustify } from 'lucide-vue-next'
import { ref } from 'vue'
import { useNavSidebarStore } from '~/stores/navSidebar.js'
import { getData, setData } from 'nuxt-storage/local-storage';

const isSelected = ref(false)
const brands = ref([])
const categories = ref([])
const container = ref(null)
const searchContainerOpen = ref(false)
const isSidebarOpen = useNavSidebarStore()
const searchValue = ref('')
const searchHistory = ref([])

const { data: navData, error: navError } = await useFetch('http://localhost:5000/api/nav-bar')
const { data: searchData, pending: searchPending, error: searchError, refresh: search } = await useFetch('http://localhost:5000/api/search', {
    query: { searchValue }
})

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

const searchInput = ref(null)

const toggleSearchContainer = () => {
    searchContainerOpen.value = !searchContainerOpen.value
    searchValue.value = ''

    nextTick(() => {
        searchInput.value?.$el?.querySelector('input')?.focus()
    })
}

const handleSearch = async () => {
    if (searchValue.value.trim() === '') {
        return
    }
    searchContainerOpen.value = !searchContainerOpen.value
    let history = getData('search_history')

    if (history) {
        if (!history.includes(searchValue)) {
            history.push(searchValue)
        }
    } else {
        history = [searchValue.value]
    }

    setData('search_history', history, 24, 'h')
    window.location.href = '/products/all?search=' + searchValue.value
}

onMounted(() => {
    searchHistory.value = getData('search_history')
})

watch(searchValue, async () => {
    await search()
})

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
            <div v-if="!navError" class="tabs">
                <ButtonsDropdown label="Shop" :tabs="[{
                    label: 'Men\'s', to: '/products/men', isDropdown: true, tabs: navData.categories?.map(category => ({
                        label: capitalizeWords(unslugify(category.name)[0]),
                        to: category.name,
                        isDropdown: false
                    }))
                },
                {
                    label: 'Women\'s', to: '/products/women', isDropdown: true, tabs: navData.categories?.map(category => ({
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
                <ButtonsDropdown label="Brands" :tabs="navData.brands?.map(brand => ({
                    label: capitalizeWords(unslugify(brand.name)[0]),
                    to: '/products/' + brand.name,
                    isDropdown: false
                }))" />

            </div>
            <div class="input-laptop-view">
                <ButtonsInputField v-model="searchValue" @click="toggleSearchContainer()" :icon="Search"
                    placeholder="Search" />
            </div>
            <div class="actions">
                <Search class="search-laptop-view" @click="toggleSearchContainer()" :stroke-width="1" />
                <NuxtLink class="action" to="/user/wishlist/1234">
                    <Heart :stroke-width="1" />
                </NuxtLink>
                <CircleUserRound :stroke-width="1" />
                <NuxtLink class="action" to="/user/cart">
                    <ShoppingBag :stroke-width="1" />
                </NuxtLink>
            </div>
        </div>
        <div class="nav-content-tablet">
            <NuxtLink to="/" class="header-s logo">
                LOVE.CO
            </NuxtLink>
            <div class="actions">
                <Search :stroke-width="1" @click="toggleSearchContainer()" />
                <NuxtLink class="action" to="/user/cart">
                    <ShoppingBag :stroke-width="1" />
                </NuxtLink>
                <AlignJustify @click="isSidebarOpen.open()" :stroke-width="1" />
                <ButtonsNavSidebar v-if="!navError" :data="navData" />
            </div>
        </div>
    </div>
    <Transition name="search-container">
        <div v-if="searchContainerOpen" class="search-container">
            <div class="search-content-wrapper">
                <div class="search-content-top">
                    <NuxtLink to="/" class="header-s logo" @click="toggleSearchContainer()">
                        LOVE.CO
                    </NuxtLink>
                    <ButtonsInputField @keyup.enter="handleSearch()" ref="searchInput" v-model="searchValue"
                        :icon="Search" placeholder="Search" />
                    <div @click="toggleSearchContainer()" class="subtitle-l cancel">
                        Cancel
                    </div>
                </div>
            </div>
            <!-- <div v-if="searchHistory?.length > 0 && searchValue.trim() === ''" class="history-container">
                <div class="title-m">
                    Recent Searches
                </div>
                <div class="history-list">
                    <NuxtLink v-for="history in searchHistory" class="history title-l">
                        {{ history }}
                    </NuxtLink>
                </div>
            </div> -->
            <div v-if="searchValue.trim() !== ''" class="search-results">
                <div class="title-m result-text">
                    Top Suggestions For '{{ searchValue }}'
                </div>
                <div v-if="searchData.products.length > 0" class="nav-cards">
                    <CardsProduct v-for="product in searchData.products" :key="product.code" :data="product"
                        isMiniDisplay @click="toggleSearchContainer()" />
                </div>
                <div v-else class="title-m not-found result-text">
                    No Products Found.
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="overlay">
        <div v-if="searchContainerOpen" @click="toggleSearchContainer()" class="overlay"></div>
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

.cancel {
    cursor: pointer;
    color: #000000;
    font-weight: 600;
}

.cancel:hover {
    text-decoration: underline;
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
    position: relative;
    display: none;
}

.input-laptop-view {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.bar-container {
    width: 100%;
    box-sizing: border-box;
}

.search-container {
    position: relative;
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
    overflow-y: auto;
    max-height: 100vh;
}

.search-content-wrapper {
    position: sticky;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;
    background-color: #FFFFFF;
}

.search-content-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: center;
    padding: 20px 0px;
    width: 90%;
    gap: 50px;
}

.result-text {
    width: 90%;
}

.result-text.not-found {
    color: #00000070;
    text-align: center;
}

.search-results {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 0px 0px 15px;
    gap: 20px;
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.history-container {
    display: flex;
    flex-direction: column;
    width: 90%;
    padding: 0px 0px 20px;
    gap: 10px;
}

.history {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--secondary-3);
    width: fit-content;
    padding: 2px 15px;
    border-radius: 20px;
}

.nav-cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: start;
    gap: 5px;
    width: 90%;
    box-sizing: border-box;
}

.loading-circle {
    width: 100%;
    stroke: #00000090;
    animation: spin 2s linear infinite;
    transform-origin: center;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
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

@media (max-width: 1200px) {
    .input-laptop-view {
        display: none;
    }

    .search-laptop-view {
        display: block;
    }

    .nav-cards {
        grid-template-columns: repeat(5, 1fr);
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

    .search-container {
        max-height: 100svh;
    }

    .actions {
        gap: 20px;
    }

    .nav-cards {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 768px) {
    .search-content-top {
        gap: 25px;
    }

    .nav-cards {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 600px) {
    .search-content-top .logo {
        display: none;
    }

    .nav-cards {
        width: 100%;
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 425px) {
    .search-content-top {
        width: 95%;
        gap: 15px;
    }

    .nav-cards {
        gap: 0px;
    }
}
</style>
<script setup>
import { ChevronDown, X, SlidersHorizontal } from 'lucide-vue-next'
import { useSidebarStore } from '~/stores/sidebar'
import { useSelectedFilters } from '~/stores/filters'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

let { data, error } = await useFetch('http://localhost:5000/api/products/' + slug)

const slugArray = slug.split('-')

const genders = ref([])
const categories = ref([])
const styles = ref([])
const brands = ref([])
const flags = ref([])

const categoryList = ref([])
const brandList = ref([])
const styleList = ref([])

const currentSelector = ref(['all'])
const selectedFilters = useSelectedFilters()
const reloadKey = ref(0)
const priceSort = ref('')
const isNotFilter = ref(false)

const isSidebarOpen = useSidebarStore()

const fillFilters = () => {
    slugArray.forEach(el => {
        el.split('&').forEach(element => {
            if (['men', 'women', 'unisex'].includes(element)) {
                genders.value.push(element)
            } else if (categoryList.value.includes(element) || element === 'all') {
                if (element === 'all') return
                categories.value.push(element)
            } else if (styleList.value.includes(element)) {
                styles.value.push(element)
            } else if (brandList.value.includes(element)) {
                brands.value.push(element)
            } else if (['on_sale', 'new_arrivals'].includes(element)) {
                flags.value.push(element)
            } else {
                isNotFilter.value = true
            }
        })
    })

    if (categories.value.length > 0) {
        currentSelector.value = categories.value
    }
    const params = new URLSearchParams(route.query)
    if (params.has('price')) {
        priceSort.value = params.get('price')
    }

}

const fillCategories = () => {
    data.value.categories.forEach(el => {
        categoryList.value.push(el.name)
    })
    data.value.brands.forEach(el => {
        brandList.value.push(el.name)
    })
    data.value.styles.forEach(el => {
        styleList.value.push(el.name)
    })

    fillFilters()
}

fillCategories()

const header = ref(unslugify(slugArray.join(' ').replaceAll('&', ', ')).join())

const items = [
    { name: 'Home', to: '/' },
    ...slugArray.map((part, index) => ({
        name: unslugify(part.replaceAll('&', ' & ')).join(),
        to: '/products/' + slugArray.slice(0, index + 1).join('-')
    }))
]

const selectFilter = (name) => {
    if (selectedFilters.filters.includes(name)) {
        selectedFilters.filters = selectedFilters.filters.filter(n => n !== name)
        return
    }
    selectedFilters.filters.push(name)
}

const selectAll = () => {
    currentSelector.value = ['all']
    categories.value = []
    updateURL()
    reload()
}

const selectCategory = (name) => {
    currentSelector.value = currentSelector.value.filter(n => n !== 'all')

    if (currentSelector.value.includes(name)) {
        currentSelector.value = currentSelector.value.filter(n => n !== name)
        categories.value = categories.value.filter(n => n !== name)
        if (currentSelector.value.length === 0) {
            currentSelector.value = ['all']
            categories.value = []
        }
    } else {
        currentSelector.value.push(name)
        categories.value.push(name)
        if (categories.value.length === categoryList.value.length) {
            currentSelector.value = ['all']
            categories.value = []
        }
    }

    updateURL()
    reload()
}

const updateURL = async () => {
    let newSlug = [
        genders.value.join('&'),
        categories.value.join('&'),
        styles.value.join('&'),
        brands.value.join('&'),
        flags.value.join('&'),
    ].filter(Boolean).join('-')

    if (newSlug.trim('') === '') {
        newSlug = 'all'
    }

    await router.push(`/products/${newSlug}`)

    const newSlugArray = newSlug.split('-')
    header.value = unslugify(newSlugArray.join(' ').replaceAll('&', ', ')).join()

    const { data: newData, error: newError } = await useFetch('http://localhost:5000/api/products/' + newSlug)
    data.value = newData.value
    error.value = newError.value
}

const reload = () => {
    if (reloadKey.value === 10) reloadKey.value = 0
    reloadKey.value++
}

const addFilter = async (array, value) => {
    const index = array.indexOf(value)
    if (index !== -1) {
        array.splice(index, 1)
    } else {
        array.push(value)
    }

    await updateURL()
    reload()
}

const sort = async (name) => {
    if (name === 'new_arrivals' || name === 'on_sale') {
        addFilter(flags.value, name)
        return
    }
    const params = new URLSearchParams(route.query)

    if (priceSort.value === name) {
        priceSort.value = ''
        params.delete('price')
    } else {
        priceSort.value = name
        params.set('price', priceSort.value)
    }

    router.replace({
        path: route.path,
        query: Object.fromEntries(params.entries())
    })

    const queryString = params.toString()
    const fullUrl = `http://localhost:5000/api${route.path}${queryString ? '?' + queryString : ''}`

    console.log(fullUrl)

    const { data: newData, error: newError } = await useFetch(fullUrl)
    data.value = newData.value
    error.value = newError.value

    reload()
}

</script>

<template>
    <div v-if="error || isNotFilter" class="fetch-error header-m">
        FILTER DOES NOT EXIST
    </div>
    <div v-else class="products-canvas">
        <div class="products-content">
            <div class="nav">
                <NavigationBreadcrumb :items="items" />
            </div>
            <div class="header-m header">
                {{ unslugify(header).join() }}
            </div>
            <div class="selector-wrapper">
                <div class="selector-container">
                    <div class="selector title-m" :class="{ selected: currentSelector.includes('all') }"
                        @click="selectAll()">
                        All
                    </div>
                    <div v-for="category in data.categories" class="selector title-m"
                        :class="{ selected: currentSelector.includes(category.name) }"
                        @click="selectCategory(category.name)">
                        {{ unslugify(category.name).join() }}
                    </div>
                </div>
                <div @click="isSidebarOpen.toggle()" class="filters-button title-m">
                    FILTER & SORT
                    <SlidersHorizontal class="filter-icon" />
                </div>
            </div>
            <div v-if="data.products.length > 0" :key="reloadKey" class="products-container">
                <div class="cards">
                    <CardsProduct v-for="product in data.products" :key="product.code" :data="product" />
                </div>
            </div>
            <div v-else class="no-products-error">
                No Products Found
            </div>
        </div>
    </div>
    <Transition name="sidebar">
        <div v-if="isSidebarOpen.isOpen" class="sidebar-container">
            <div class="sidebar-option sidebar-top title-l">
                Filters & Sort
                <X class="sidebar-icon" @click="isSidebarOpen.toggle()" />
            </div>
            <div @click="selectFilter('sort by')" class="sidebar-option title-m"
                :class="{ 'has-options': flags.length > 0 || priceSort !== '' }">
                SORT BY
                <ChevronDown :class="{ selected: selectedFilters.filters.includes('sort by') }" class="sidebar-icon" />
            </div>
            <div v-if="selectedFilters.filters.includes('sort by')" class="sidebar-option-dropdown">
                <div class="filter-option sort title-m" :class="{ selected: priceSort === 'low_high' }"
                    @click="sort('low_high')">
                    PRICE (LOW - HIGH)
                </div>
                <div class="filter-option sort title-m" :class="{ selected: priceSort === 'high_low' }"
                    @click="sort('high_low')">
                    PRICE (HIGH - LOW)
                </div>
                <div class="filter-option sort title-m" :class="{ selected: flags.includes('new_arrivals') }"
                    @click="sort('new_arrivals')">
                    NEW ARRIVALS
                </div>
                <div class="filter-option sort title-m" :class="{ selected: flags.includes('on_sale') }"
                    @click="sort('on_sale')">
                    ON SALE
                </div>
            </div>
            <div @click="selectFilter('gender')" class="sidebar-option title-m"
                :class="{ 'has-options': genders.length > 0 }">
                GENDER
                <ChevronDown :class="{ selected: selectedFilters.filters.includes('gender') }" class="sidebar-icon" />
            </div>
            <div v-if="selectedFilters.filters.includes('gender')" class="sidebar-option-dropdown">
                <div class="filter-option title-m">
                    <ButtonsCheckBox :selected="genders.includes('men')" @click="addFilter(genders, 'men')" /> MEN
                </div>
                <div class="filter-option title-m">
                    <ButtonsCheckBox :selected="genders.includes('women')" @click="addFilter(genders, 'women')" /> WOMEN
                </div>
                <div class="filter-option title-m">
                    <ButtonsCheckBox :selected="genders.includes('unisex')" @click="addFilter(genders, 'unisex')" />
                    UNISEX
                </div>
            </div>
            <div @click="selectFilter('brand')" class="sidebar-option title-m"
                :class="{ 'has-options': brands.length > 0 }">
                BRAND
                <ChevronDown :class="{ selected: selectedFilters.filters.includes('brand') }" class="sidebar-icon" />
            </div>
            <div v-if="selectedFilters.filters.includes('brand')" class="sidebar-option-dropdown">
                <div v-for="brand in data.brands" class="filter-option title-m">
                    <ButtonsCheckBox :selected="brands.includes(brand.name)" @click="addFilter(brands, brand.name)" />
                    {{ unslugify(brand.name.toUpperCase()).join() }}
                </div>
            </div>
            <div @click="selectFilter('style')" class="sidebar-option title-m"
                :class="{ 'has-options': styles.length > 0 }">
                STYLE
                <ChevronDown :class="{ selected: selectedFilters.filters.includes('style') }" class="sidebar-icon" />
            </div>
            <div v-if="selectedFilters.filters.includes('style')" class="sidebar-option-dropdown">
                <div v-for="style in data.styles" class="filter-option title-m">
                    <ButtonsCheckBox :selected="styles.includes(style.name)" @click="addFilter(styles, style.name)" />
                    {{ unslugify(style.name.toUpperCase()).join() }}
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="overlay">
        <div v-if="isSidebarOpen.isOpen" @click="isSidebarOpen.toggle()" class="overlay"></div>
    </Transition>
</template>

<style scoped>
.fetch-error {
    display: flex;
    flex-direction: row;
    padding-top: 50px;
    width: 85vw;
    justify-self: center;
}

.sidebar-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    background-color: #FFFFFF;
    border-left: 1px solid #00000040;
    width: 30vw;
    height: 100vh;
    z-index: 99999;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.sidebar-container::-webkit-scrollbar {
    display: none;
}

.sidebar-option {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: fit-content;
    padding: 20px;
    border-bottom: 1px solid #00000020;
    cursor: pointer;
    border-left: 3px solid transparent;
}

.sidebar-option.has-options {
    border-left: 3px solid #000000;
}

.sidebar-icon {
    cursor: pointer;
    transition: all 0.5s ease;
}

.sidebar-icon.selected {
    transform: rotateZ(180deg);
}

.sidebar-option-dropdown {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding: 15px 0px;
}

.filter-option {
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 20px;
    gap: 10px;
    align-items: center;
    font-weight: 400;
}

.filter-option.sort {
    cursor: pointer;
}

.filter-option.sort.selected {
    border-left: 3px solid #000000;
}

.sidebar-top {
    position: sticky;
    top: 0;
    left: 0;
    cursor: default !important;
    background-color: #FFFFFF;
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

.sidebar-enter-active,
.sidebar-leave-active {
    transition: all 0.5s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
    right: -100%
}

.sidebar-enter-to,
.sidebar-leave-from {
    right: 0;
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




.products-canvas {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    padding: 35px 0px;
}

.products-content {
    display: flex;
    flex-direction: column;
    width: 85%;
    gap: 15px;
}

.selector-container {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    border-bottom: 1px solid #00000020;
    gap: 35px;
}

.selector-container::-webkit-scrollbar {
    display: none;
}

.selector-wrapper {
    display: flex;
    flex-direction: row;
    align-items: end;
    width: 100%;
}

.selector {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px 0px;
    border-bottom: 2.5px solid transparent;
    user-select: none;
    cursor: pointer;
    color: #00000040;
    font-weight: 400;
}

.selector.selected {
    border-bottom: 2.5px solid #000000;
    color: #000000;
    font-weight: 700;
}

.filters-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    border: 1px solid #000000;
    padding: 10px 20px;
    cursor: pointer;
    user-select: none;
    transition: all 0.5s ease;
}

.filters-button:active {
    transform: translateY(1px);
}

.products-container {
    display: flex;
    flex-direction: column;
}

.cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: start;
    width: 100%;
    gap: 10px
}

.no-products-error {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 100px 0px 0px;
}

@media (max-width: 1024px) {
    .cards {
        grid-template-columns: repeat(3, 1fr);
    }

    .products-content {
        width: 95%;
    }

    .sidebar-container {
        width: 40vw;
    }
}

@media (max-width: 768px) {
    .cards {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px
    }

    .products-content {
        width: 98%;
        align-items: center;
    }

    .nav {
        width: 95%;
    }

    .header {
        width: 95%;
    }

    .selector-wrapper {
        width: 95%;
    }

    .sidebar-container {
        width: 55vw;
    }
}

@media (max-width: 600px) {
    .filters-button {
        padding: 10px 10px !important;
        font-size: 12px;
    }

    .filter-icon {
        width: 16px;
        height: 16px;
    }

    .selector {
        padding: 10px 0px;
    }

    .sidebar-container {
        width: 80vw;
    }
}

@media (max-width: 425px) {
    .filters-button {
        padding: 7.5px 10px !important;
    }

    .filter-icon {
        display: none;
    }

    .cards {
        gap: 5px
    }

    .selector {
        padding: 7.5px 0px;
    }

    .sidebar-container {
        width: 100vw;
    }
}
</style>
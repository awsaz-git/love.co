<script setup>
import { ChevronRight, X } from 'lucide-vue-next';
import { useNavSidebarStore } from '~/stores/navSidebar.js'

const props = defineProps({
    data: Object
})

const isSidebarOpen = useNavSidebarStore()
const selectedDropdown = ref([])

const toggleDropdown = (name) => {
    if (selectedDropdown.value.includes(name)) {
        selectedDropdown.value = selectedDropdown.value.filter(n => n != name)
        return
    }
    selectedDropdown.value.push(name)
}

const isDropdownOpen = (name) => {
    return selectedDropdown.value.includes(name)
}

</script>

<template>
    <Transition name="navsidebar">
        <div v-if="isSidebarOpen.isOpen" class="nav-sidebar-container">
            <div class="nav-sidebar-top">
                <NuxtLink to="/" class="header-s" @click="isSidebarOpen.toggle()">
                    LOVE.CO
                </NuxtLink>
                <X class="nav-sidebar-icon" @click="isSidebarOpen.toggle()" />
            </div>
            <template v-for="gender in ['men', 'women']">
                <div class="nav-sidebar-option title-l" @click="toggleDropdown(gender)">
                    {{ gender.toUpperCase() }}
                    <ChevronRight :class="{ selected: isDropdownOpen(gender) }" class="nav-sidebar-icon" />
                </div>
                <template v-for="category in props.data.categories">
                    <NuxtLink v-if="isDropdownOpen(gender)" :to="`/products/${gender}-${category.name}`"
                        @click="isSidebarOpen.toggle(); toggleDropdown(gender);" class="nav-sidebar-option-dropdown">
                        <div class="nav-dropdown-option title-l">
                            {{ unslugify(category.name).join().toUpperCase() }}
                        </div>
                    </NuxtLink>
                </template>
            </template>
            <div class="nav-sidebar-option title-l" @click="toggleDropdown('brands')">
                BRANDS
                <ChevronRight :class="{ selected: isDropdownOpen('brands') }" class="nav-sidebar-icon" />
            </div>
            <template v-for="brand in props.data.brands">
                <NuxtLink v-if="isDropdownOpen('brands')" :to="`/products/${brand.name}`"
                    @click="isSidebarOpen.toggle(); toggleDropdown('brands');" class="nav-sidebar-option-dropdown">
                    <!-- <div class="nav-dropdown-option title-l">
                        {{ unslugify(brand.name).join().toUpperCase() }}
                    </div> -->
                    <NuxtImg :src="brand.image" alt="" class="nav-sidebar-icon brand-image" />
                </NuxtLink>
            </template>
            <template v-for="sort in ['new_arrivals', 'on_sale']">
                <NuxtLink :to="`/products/${sort}`" class="nav-sidebar-option title-l" @click="isSidebarOpen.toggle();">
                    {{ unslugify(sort).join().toUpperCase() }}
                    <ChevronRight class="nav-sidebar-icon" />
                </NuxtLink>
            </template>
            <div class="nav-sidebar-option title-l">
                ACCOUNT
            </div>
            <NuxtLink class="nav-sidebar-option title-l" to="/user/wishlist/1234" @click="isSidebarOpen.toggle();">
                WISHLIST
            </NuxtLink>
            <div class="nav-sidebar-option title-l light">
                LOGOUT
            </div>
        </div>
    </Transition>

    <Transition name="overlay">
        <div v-if="isSidebarOpen.isOpen" @click="isSidebarOpen.close()" class="overlay">

        </div>
    </Transition>

</template>

<style scoped>
.nav-sidebar-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    background-color: #FFFFFF;
    border-left: 1px solid #00000040;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.nav-sidebar-container::-webkit-scrollbar {
    display: none;
}

.nav-sidebar-option {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: fit-content;
    padding: 20px;
    border-bottom: 0.5px solid #00000020;
    border-top: 0.5px solid #00000020;
    cursor: pointer;
    border-left: 3px solid transparent;
}

.logout {
    font-weight: 400;
    border-top: 1px solid #00000020;
    border-bottom: unset;
    margin-top: auto;
}

.nav-sidebar-option.has-options {
    border-left: 3px solid #000000;
}

.nav-sidebar-icon {
    cursor: pointer;
    transition: all 0.5s ease;
}

.nav-sidebar-icon.selected {
    transform: rotateZ(180deg);
}

.nav-sidebar-option-dropdown {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
    padding: 15px 25px;
}

.nav-sidebar-top {
    position: sticky;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: fit-content;
    padding: 20px 35px;
    border-bottom: 1px solid #00000020;
    border-left: 3px solid transparent;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: #FFFFFF;
}

.nav-dropdown-option {
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
    gap: 10px;
    align-items: center;
    font-weight: 400;
}

.brand-image {
    height: 15px;
    filter: invert(1);
    padding-right: 25px;
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

.navsidebar-enter-active,
.navsidebar-leave-active {
    transition: all 0.5s ease;
}

.navsidebar-enter-from,
.navsidebar-leave-to {
    right: -100%
}

.navsidebar-enter-to,
.navsidebar-leave-from {
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

@media (max-width: 960px) {
    .nav-sidebar-container {
        height: 100svh;
    }

    .overlay {
        height: 100svh;
    }
}
</style>
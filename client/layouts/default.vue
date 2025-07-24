<script setup>
const modal = useModal()
</script>

<template>
    <ModalsAddedToCart :data="modal.data" />
    <nav>
        <NavigationNavbar />
    </nav>
    <main>
        <NuxtPage />
    </main>
    <footer>
        <NavigationFooter />
    </footer>
</template>

<style scoped>
main {
    padding: 120px 0px;
}
</style>
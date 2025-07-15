<template>
    <div class="card-container">
        <div class="image-container">
        </div>
        <div class="info">
            <div class="title">
            </div>
            <div class="price">
            </div>
            <div class="brand">
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    width: 100%;
}

.image-container {
    aspect-ratio: 1/1;
    width: 100%;
    height: auto;
    background-color: var(--secondary-3);
    animation: pulseOpacity 1.5s infinite ease-in-out;
}

.info {
    display: flex;
    flex-direction: column;
    padding: 0px 10px 10px;
    box-sizing: border-box;
}

.title {
    width: 100%;
    background-color: var(--secondary-3);
    animation: pulseOpacity 1.5s infinite ease-in-out;

}

.price {
    width: 20%;
    background-color: var(--secondary-3);
    animation: pulseOpacity 1.5s infinite ease-in-out;

}

.brand {
    width: 35%;
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
</style>
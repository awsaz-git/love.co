<script setup>

const props = defineProps({
    data: Object
})

const data = props.data

</script>


<template>
    <div class="review-card-container">
        <div class="review-user title-l normal">
            <ButtonsRating :rating="data.rating" />
            {{ data.name }}
        </div>
        <div class="review-content">
            <div class="title-m">
                {{ data.title }}
            </div>
            <div class="title-m normal review-text">
                {{ data.content }}
            </div>
        </div>
        <div class="subtitle-l date">
            {{ new Date(data.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) }}

        </div>
    </div>
</template>

<style scoped>
.review-card-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 25px;
    border-radius: 10px;
    border: 0.5px solid #00000050;
    cursor: default;
    transition: all 0.7s ease;
}

.review-card-container:hover {
    transform: translateY(-1.5px);
}

.review-user {
    display: flex;
    flex-direction: row;
    gap: 20px;
    font-size: 18px !important;
}

.review-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.review-text {
    width: 90%;
}

.date {
    margin-top: auto;
}
</style>
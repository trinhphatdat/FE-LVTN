<template>
    <div id="breadcrums"></div>
</template>
<script setup></script>
<style scoped>
#breadcrums {
    background-image: url(../assets/img/back_ground.png);
    background-position: center;
    /* background-repeat: no-repeat; */
    /* background-size: cover; */
    /* margin-top: 74px; */
    height: 400px;
}

@media (max-width: 739px) {
    #breadcrums {
        height: 230px;
    }
}
</style>
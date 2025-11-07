<script setup>
import { storeToRefs } from 'pinia'
import { useMenuClient } from '@/stores/use-menu-client.js';

const store = useMenuClient();
const { selectedKeys, openKeys } = storeToRefs(store);

import { useRoute } from 'vue-router';
import { watch } from 'vue';

const route = useRoute();

watch(
    () => route.name,
    (name) => {
        selectedKeys.value = [name];
    },
    { immediate: true }
);
</script>
<template>
    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline">
        <a-menu-item key="collections-all-teeshirt">
            <router-link :to="{ name: 'collections-all-teeshirt' }" class="text-decoration-none text-dark">
                <span>Tất cả sản phẩm</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="collections-male-teeshirt">
            <router-link :to="{ name: 'collections-male-teeshirt' }" class="text-decoration-none text-dark">
                <span>Áo thun nam</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="collections-female-teeshirt">
            <router-link :to="{ name: 'collections-female-teeshirt' }" class="text-decoration-none text-dark">
                <span>Áo thun nữ</span>
            </router-link>
        </a-menu-item>
    </a-menu>
</template>
<style scoped></style>
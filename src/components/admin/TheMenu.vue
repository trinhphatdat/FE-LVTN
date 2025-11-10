<script setup>
import { storeToRefs } from 'pinia'
import { useMenuAdmin } from '@/stores/use-menu-admin.js';

const store = useMenuAdmin();
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
        <a-menu-item key="admin-dashboard">
            <router-link :to="{ name: 'admin-dashboard' }" class="text-decoration-none text-dark">
                <i class="fa-solid fa-dashboard me-2"></i>
                <span>Dashboard</span>
            </router-link>
        </a-menu-item>

        <!-- Quản lí đơn hàng -->
        <a-menu-item key="admin-orders">
            <router-link :to="{ name: 'admin-orders' }" class="text-decoration-none text-dark">
                <i class="fa-solid fa-shopping-cart me-1"></i>
                <span> Quản lí đơn hàng</span>
            </router-link>
        </a-menu-item>

        <!-- Quản lí khuyến mãi -->
        <a-menu-item key="admin-promotions">
            <router-link :to="{ name: 'admin-promotions' }" class="text-decoration-none text-dark">
                <i class="fa-solid fa-tags me-1"></i>
                <span>Quản lí khuyến mãi</span>
            </router-link>
        </a-menu-item>

        <!-- Begin: Quản lí sản phẩm -->
        <a-sub-menu key="product-management">
            <template #icon>
                <i class="fa-solid fa-box"></i>
            </template>
            <template #title>Quản lí sản phẩm</template>

            <!-- Quản lí áo thun -->
            <a-menu-item key="admin-products">
                <router-link :to="{ name: 'admin-products' }" class="text-decoration-none text-dark">
                    <i class="fa-solid fa-shirt me-1"></i>
                    <span>Sản phẩm</span>
                </router-link>
            </a-menu-item>

            <!-- Quản lí size -->
            <a-menu-item key="admin-sizes">
                <router-link :to="{ name: 'admin-sizes' }" class="text-decoration-none text-dark">
                    <i class="fa-solid fa-ruler me-1"></i>
                    <span>Kích cỡ</span>
                </router-link>
            </a-menu-item>

            <!-- Quản lí màu sắc -->
            <a-menu-item key="admin-colors">
                <router-link :to="{ name: 'admin-colors' }" class="text-decoration-none text-dark">
                    <i class="fa-solid fa-palette me-1"></i>
                    <span>Màu sắc</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <!-- End: Quản lí sản phẩm -->

        <!-- Begin: Quản lí người dùng -->
        <a-sub-menu key="user-management">
            <template #icon>
                <i class="fa-solid fa-users"></i>
            </template>
            <template #title>Quản lí người dùng</template>

            <a-menu-item key="admin-users">
                <router-link :to="{ name: 'admin-users' }" class="text-decoration-none text-dark">
                    <i class="fa-solid fa-user me-1"></i>
                    <span>Tài khoản</span>
                </router-link>
            </a-menu-item>

            <a-menu-item key="admin-roles">
                <router-link :to="{ name: 'admin-roles' }" class="text-decoration-none text-dark">
                    <i class="fa-solid fa-tag me-1"></i>
                    <span>Vai trò</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <!-- End: Quản lí người dùng -->
    </a-menu>
</template>

<script setup>
import TheHeader from '@/components/client/TheHeader.vue';
import TheFooter from '@/components/client/TheFooter.vue';
import TheBreadcumbs from '@/components/TheBreadcumbs.vue';
import { ref } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const keyword = ref('');
const products = ref([]);
const isSearched = ref(false);

const searchProducts = () => {
    isSearched.value = true;
    if (keyword.value.trim() === '') {
        products.value = [];
        return;
    }
    // keyword.value = keyword.value.trim();
    axios.get(`${API_URL}/client/products/search`, { params: { q: keyword.value } })
        .then((response) => {
            products.value = response.data || [];
        })
        .catch((error) => {
            console.error('Error searching products:', error);
            products.value = [];
        });
};
const formatCurrency = (value) => {
    if (!value && value !== 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
</script>
<template>
    <TheHeader />
    <TheBreadcumbs />
    <div class="container mt-3">
        <div class="heading-page">
            <h3 class="text-center">Tìm kiếm</h3>
            <a-input-search v-model:value="keyword" placeholder="Nhập tên sản phẩm bạn muốn tìm kiếm"
                enter-button="Search" size="large" @search="searchProducts" />
            <p v-if="products.length > 0" class="count-cart text-center">Có <span>{{ products.length }}</span> sản phẩm
                cho tìm kiếm</p>
            <p v-else-if="isSearched && products.length == 0" class="count-cart text-center">Không tìm thấy sản phẩm có
                kí tự '{{ keyword }}'</p>
            <p v-else class=" count-cart text-center">Không có sản phẩm nào</p>
        </div>
        <div class="row mb-4">
            <div v-for="product in products" :key="product.id" class="col-lg-3 col-md-6 col-12">
                <div class="product-card">
                    <div class="product-image-wrapper position-relative">
                        <span v-if="product.discount" class="badge-discount"> -{{ product.discount }}% </span>
                        <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
                            <img v-if="product.thumbnail" :src="`${STORAGE_URL}/${product.thumbnail}`"
                                :alt="product.title" class="product-image">
                        </router-link>
                        <span v-if="!product.thumbnail" class="placeholder-image">No Image</span>
                    </div>

                    <h6 class="product-name">{{ product.title }}</h6>

                    <div class="product-price">
                        <span class="current-price">{{ formatCurrency(product.price) }}</span>
                        <span v-if="product.discount != 0" class="old-price">{{
                            formatCurrency(product.original_price)
                            }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <TheFooter />
</template>
<style scoped></style>
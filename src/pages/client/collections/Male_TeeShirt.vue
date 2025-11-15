<template>
    <TheLoadingSpinner v-if="isLoading" />
    <!-- Begin: form lọc -->
    <div class="row mb-4 align-items-center">
        <div class="col-lg-3 col-md-12 mb-2">
            <span class="fs-6 fw-bold">Hiển thị {{ products.length }} sản phẩm</span>
        </div>
        <div class="col-lg-9 col-md-12">
            <div class="row g-2">
                <div class="col-lg-4 col-md-6 col-12">
                    <a-select v-model:value="sortOrder" class="w-100" placeholder="Sắp xếp theo giá" @change="onFilter">
                        <a-select-option value="">Mặc định</a-select-option>
                        <a-select-option value="asc">Thứ tự theo giá: thấp đến cao</a-select-option>
                        <a-select-option value="desc">Thứ tự theo giá: cao xuống thấp</a-select-option>
                    </a-select>
                </div>
                <div class="col-lg-4 col-md-6 col-12">
                    <a-select v-model:value="selectedPriceRange" class="w-100" placeholder="Lọc theo khoảng giá"
                        @change="onFilter">
                        <a-select-option :value="null">Tất cả mức giá</a-select-option>
                        <a-select-option value="0-100000">Giá dưới 100.000đ</a-select-option>
                        <a-select-option value="100000-200000">100.000đ - 200.000đ</a-select-option>
                        <a-select-option value="200000-300000">200.000đ - 300.000đ</a-select-option>
                        <a-select-option value="300000-500000">300.000đ - 500.000đ</a-select-option>
                        <a-select-option value="500000-999999999">Giá trên 500.000đ</a-select-option>
                    </a-select>
                </div>
                <div class="col-lg-2 col-md-12 col-12">
                    <a-button type="default" class="btn-reset w-100" @click="onResetFilter">Reset</a-button>
                </div>
            </div>
        </div>
    </div>
    <!-- End: form lọc -->

    <!-- Begin: danh sách sản phẩm -->
    <div class="row g-4">
        <div v-for="product in products" :key="product.id" class="col-lg-3 col-md-6 col-12">
            <div class="product-card">
                <div class="product-image-wrapper position-relative">
                    <span v-if="product.discount" class="badge-discount"> -{{ product.discount }}% </span>
                    <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
                        <img v-if="product.thumbnail" :src="`${STORAGE_URL}/${product.thumbnail}`" :alt="product.title"
                            class="product-image">
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
    <!-- End: danh sách sản phẩm -->

    <!-- Begin: paginate -->
    <a-pagination v-model:current="current_page" :total="total" :page-size="perPage" show-less-items
        class="d-flex justify-content-center mt-4" />
    <!-- End: paginate -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const isLoading = ref(true);

const products = ref([]);
const current_page = ref(1);
const total = ref(0);
const perPage = ref(10);

const selectedPriceRange = ref(null);
const sortOrder = ref('');

const getProducts = (page = 1) => {
    isLoading.value = true;

    var minPrice = null;
    var maxPrice = null;

    if (selectedPriceRange.value) {
        const [min, max] = selectedPriceRange.value.split('-');
        minPrice = min;
        maxPrice = max;
    }

    const params = {
        page: page,
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
        ...(sortOrder.value && { sort: sortOrder.value })
    };

    axios.get(`${API_URL}/client/products`, { params })
        .then((response) => {
            const pageData = response.data;
            products.value = pageData.data || [];
            total.value = pageData.total ?? 0;
            perPage.value = pageData.per_page ?? 10;
            current_page.value = pageData.current_page ?? 1;
        })
        .catch((error) => {
            console.error('Lỗi lấy sản phẩm:', error);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    getProducts(current_page.value);
});

watch(current_page, (new_page) => {
    getProducts(new_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const onFilter = () => {
    current_page.value = 1;
    getProducts(1);
};

const onResetFilter = () => {
    selectedPriceRange.value = null;
    sortOrder.value = '';
    current_page.value = 1;
    getProducts(1);
};

const formatCurrency = (value) => {
    if (!value && value !== 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
</script>

<style scoped>
.btn-reset {
    background: #6c757d;
    color: #fff;
    border-color: #6c757d;
}

.btn-reset:hover {
    background: #5c636a;
    border-color: #5c636a;
}
</style>
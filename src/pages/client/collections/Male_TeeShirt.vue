<template>
    <TheLoadingSpinner v-if="isLoading" />
    <!-- Begin: form lọc -->
    <div class="row mb-4 align-items-center">
        <div class="col-lg-3 col-md-12 mb-2">
            <span class="fs-5 fw-bold">Hiển thị {{ products.length }} sản phẩm</span>
        </div>
        <div class="col-lg-9 col-md-12">
            <div class="row">
                <div class="col-lg-4 col-12 d-flex align-items-center">
                    <a-select v-model:value="sortOrder" class="w-100" placeholder="Sắp xếp theo giá">
                        <a-select-option value="">Mặc định</a-select-option>
                        <a-select-option value="asc">Thứ tự theo giá: thấp đến cao</a-select-option>
                        <a-select-option value="desc">Thứ tự theo giá: cao xuống thấp</a-select-option>
                    </a-select>
                </div>
                <div class="col-lg-8 col-12">
                    <form @submit.prevent="onFilter">
                        <div class="row">
                            <div class="col-sm-8 col-12 d-flex align-items-center gap-3 p-3">
                                <span class="text-primary fw-bold">{{ priceRange[0].toLocaleString('vi-VN')
                                    }}.000đ</span>
                                <a-slider v-model:value="priceRange" :min="min" :max="max" :step="1" range
                                    :tipFormatter="formatVND" class="flex-grow-1" />
                                <span class="text-primary fw-bold">{{ priceRange[1].toLocaleString('vi-VN')
                                    }}.000đ</span>
                            </div>
                            <div class="col-sm-3 col-12 d-flex align-items-center gap-2">
                                <a-button type="primary" class="btn-filter" html-type="submit"
                                    :loading="loadingSubmit">Lọc</a-button>
                                <a-button type="primary" class="btn-reset" @click="onResetFilter">Reset</a-button>
                            </div>
                        </div>
                    </form>
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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);

const current_page = ref(1);
const products = ref([]);
const total = ref(0);
const perPage = ref(10);

// Giá trị min/max cho slider (nghìn đồng)
// 100 = 100.000 đồng
const min = 10;
const max = 100;

// Khởi tạo giá trị slider min max từ query hoặc mặc định
const priceRange = ref([
    route.query.min_price ? Number(route.query.min_price) / 1000 : min,
    route.query.max_price ? Number(route.query.max_price) / 1000 : max
]);

const sortOrder = ref(route.query.sort || '');

const getProducts = (page = 1) => {
    isLoading.value = true;
    const params = {
        page: page,
        min_price: priceRange.value[0] * 1000,
        max_price: priceRange.value[1] * 1000,
        sort: sortOrder.value
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
    // products.value = [
    //     {
    //         id: 1,
    //         title: 'Sản phẩm mẫu 1',
    //         thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    //         price: 100000,
    //     },
    //     {
    //         id: 2,
    //         title: 'Sản phẩm mẫu 2',
    //         thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    //         price: 200000,
    //     },
    //     {
    //         id: 3,
    //         title: 'Sản phẩm mẫu 3',
    //         thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    //         price: 150000,
    //     },
    // ]
};

// Lấy dữ liệu khi component được tạo
onMounted(() => {
    getProducts(current_page.value);
});

// Theo dõi phân trang 
watch(current_page, (new_page) => {
    getProducts(new_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Theo dõi khi query thay đổi (lọc giá)
watch(
    () => [route.query.min_price, route.query.max_price, route.query.sort],
    ([newMin, newMax, newSort]) => {
        priceRange.value = [
            newMin ? Number(newMin) / 1000 : min,
            newMax ? Number(newMax) / 1000 : max
        ];
        sortOrder.value = newSort || '';
        // back về trang đầu khi lọc
        current_page.value = 1;
        getProducts(1);
    }
);

// Hàm xử lý khi nhấn nút lọc
const onFilter = () => {
    router.replace({
        query: {
            ...route.query,
            min_price: priceRange.value[0] * 1000,
            max_price: priceRange.value[1] * 1000,
            sort: sortOrder.value
        }
    });
};

const onResetFilter = () => {
    priceRange.value = [min, max];
    sortOrder.value = '';
    router.replace({ query: { ...route.query, min_price: undefined, max_price: undefined, sort: undefined } });
};

const formatVND = (value) => {
    return `${value}.000đ`;
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
.btn-filter {
    background: #d9363e;
}

.btn-filter:hover {
    background: #ff4d4f;
}

.btn-reset {
    background: gray;
    color: #fff;
}

.btn-reset:hover {
    background: #ccc;
}
</style>
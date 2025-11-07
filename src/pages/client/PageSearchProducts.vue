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
    // if (keyword.value.trim() === '') {
    //     products.value = [];
    //     return;
    // }
    // axios.get(`${API_URL}/products/search`, { params: { q: keyword.value } })
    //     .then((response) => {
    //         products.value = response.data || [];
    //     })
    //     .catch((error) => {
    //         console.error('Error searching products:', error);
    //         products.value = [];
    //     });
    products.value = [
        {
            id: 1,
            title: 'Sản phẩm mẫu 1',
            thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
            price: 100000,
        },
        {
            id: 2,
            title: 'Sản phẩm mẫu 2',
            thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
            price: 200000,
        },
        {
            id: 3,
            title: 'Sản phẩm mẫu 3',
            thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
            price: 150000,
        },
    ]
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
        <div class="row">
            <div v-for="item in products" :key="item.id" class="col-lg-4 col-md-6 col-6">
                <div class="product">
                    <div class="product-img">
                        <router-link :to="{ name: 'product-detail', params: { id: item.id } }">
                            <img :src="item.thumbnail.startsWith('http') ? item.thumbnail : `${STORAGE_URL}` + item.thumbnail"
                                :alt="item.title" />
                        </router-link>
                    </div>
                    <div class="product-detail">
                        <router-link :to="{ name: 'product-detail', params: { id: item.id } }">
                            <span class="pro-name">{{ item.title }}</span>
                        </router-link>
                        <div class="box-bottom">
                            <span class="price">
                                {{ (item.price || 0).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }) }}
                            </span>
                            <router-link :to="{ name: 'product-detail', params: { id: item.id } }">
                                <span class="btn-order">
                                    Đặt hàng
                                    <i class="fa-solid fa-plus plus-icon"></i>
                                    <i class="fa-solid fa-chevron-right arrow-right"></i>
                                </span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <TheFooter />
</template>
<style scoped></style>
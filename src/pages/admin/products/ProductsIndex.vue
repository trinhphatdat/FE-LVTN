<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
// import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';

// const isLoading = ref(true);

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-products']);

// Begin: Cấu hình cột cho bảng sản phẩm
const columns = [
    { title: 'Thumbnail', dataIndex: 'thumbnail', key: 'thumbnail', width: 103, fixed: 'left' },
    { title: 'Tên sản phẩm', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: 'Thương hiệu', dataIndex: ['brand', 'name'], key: 'brand', width: 120 },
    { title: 'Danh mục', dataIndex: ['category', 'name'], key: 'category', width: 120 },
    { title: 'Giá bán', dataIndex: 'price', key: 'price', width: 120 },
    { title: 'Giảm giá', key: 'discount', width: 90 },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 100 },
    { title: 'Chất liệu', dataIndex: 'material', key: 'material', width: 120 },
    { title: 'Tồn kho', key: 'total_stock', width: 90 },
    { title: 'Biến thể', key: 'variants', width: 200 },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 150 },
    { title: 'Công cụ', key: 'action', fixed: 'right', width: 100 },
]
// End: Cấu hình cột cho bảng sản phẩm

//Begin: Danh sách sản phẩm 
const products = ref([]);
const getProducts = () => {
    // Dữ liệu mẫu tạm thời
    products.value = [
        {
            id: 1,
            title: 'Áo thun basic cotton',
            thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
            brand: { id: 1, name: 'Nike' },
            category: { id: 1, name: 'Áo thun nam' },
            price: 250000,
            original_price: 350000,
            discount: 29,
            gender: 'male',
            material: 'Cotton 100%',
            status: true,
            product_variants: [
                { id: 1, size: { name: 'M' }, color: { name: 'Đen' }, stock: 15 },
                { id: 2, size: { name: 'L' }, color: { name: 'Đen' }, stock: 20 },
                { id: 3, size: { name: 'XL' }, color: { name: 'Trắng' }, stock: 0 }
            ],
            product_images: [
                { id: 1, image_url: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg' },
                { id: 2, image_url: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg' }
            ]
        },
        {
            id: 2,
            title: 'Áo thun nữ form rộng',
            thumbnail: 'https://cdn.hstatic.net/products/1000184601/women_trang__2__7b3ba69fda0646cf9f88fbd66c1ef06d_master.jpg',
            brand: { id: 2, name: 'Adidas' },
            category: { id: 2, name: 'Áo thun nữ' },
            price: 180000,
            original_price: 250000,
            discount: 28,
            gender: 'female',
            material: 'Cotton 97%',
            status: false,
            product_variants: [
                { id: 4, size: { name: 'S' }, color: { name: 'Hồng' }, stock: 0 },
                { id: 5, size: { name: 'M' }, color: { name: 'Hồng' }, stock: 0 },
                { id: 6, size: { name: 'L' }, color: { name: 'Trắng' }, stock: 0 }
            ],
            product_images: [
                { id: 3, image_url: 'https://cdn.hstatic.net/products/1000184601/women_trang__2__7b3ba69fda0646cf9f88fbd66c1ef06d_master.jpg' }
            ]
        }
    ];

    // Code gọi API thật (comment lại tạm thời)
    // isLoading.value = false;
    //     axios.get(`${API_URL}/admin/products/all`, {
    //         headers:
    //         {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         }
    //     })
    //         .then((response) => {
    //             products.value = response.data;
    //             console.log(response);
    //         })
    //         .catch((error) => {
    //             console.error('Lỗi lấy danh sách sản phẩm:', error);
    //         })
    //         .finally(() => {
    //             isLoading.value = false;
    //         });
};
onMounted(() => {
    getProducts();
});
// End: Danh sách sản phẩm

//Begin: Xoá sản phẩm
const handleDelete = (id) => {
    Modal.confirm({
        title: 'Xác nhận xóa sản phẩm',
        content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        okText: 'Xoá',
        cancelText: 'Huỷ',
        onOk: () => {
            axios.delete(`${API_URL}/admin/products` + `/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        getProducts();
                        message.success('Xoá sản phẩm thành công!');
                    }
                })
                .catch((error) => {
                    console.error('Lỗi xoá sản phẩm:', error);
                    message.error('Xoá sản phẩm thất bại!');
                });
        },
        onCancel: () => { }
    });
};
// End: Xoá sản phẩm
</script>

<template>
    <!-- <TheLoadingSpinner v-if="isLoading" /> -->
    <div class="container">
        <a-card title="Danh sách sản phẩm" style="width: 100%">
            <div class="row mb-3">
                <div class="col-12 d-flex justify-content-end">
                    <router-link :to="{ name: 'admin-products-create' }">
                        <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <a-table :dataSource="products" :columns="columns" :scroll="{ x: 1400 }">
                        <template #bodyCell="{ column, index, record }">
                            <!-- Thumbnail -->
                            <template v-if="column.key === 'thumbnail'">
                                <a-image v-if="record.thumbnail"
                                    :src="record.thumbnail.startsWith('http') ? record.thumbnail : `${STORAGE_URL}${record.thumbnail}`"
                                    alt="Thumbnail sản phẩm" :width="80" />
                            </template>

                            <!-- Giá bán -->
                            <template v-if="column.key === 'price'">
                                <span style="color: green; font-weight: 600;">
                                    {{ Number(record.price || 0).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }) }}
                                </span>
                            </template>

                            <!-- Giảm giá -->
                            <template v-if="column.key === 'discount'">
                                <a-tag v-if="record.discount > 0" color="red">-{{ record.discount }}%</a-tag>
                                <span v-else>-</span>
                            </template>

                            <!-- Giới tính -->
                            <template v-if="column.key === 'gender'">
                                <a-tag v-if="record.gender === 'male'" color="blue">Nam</a-tag>
                                <a-tag v-else-if="record.gender === 'female'" color="pink">Nữ</a-tag>
                                <a-tag v-else color="default">Unisex</a-tag>
                            </template>

                            <!-- Tồn kho -->
                            <template v-if="column.key === 'total_stock'">
                                <a-badge :count="record.product_variants?.reduce((sum, v) => sum + v.stock, 0) || 0"
                                    :number-style="{
                                        backgroundColor: (record.product_variants?.reduce((sum, v) => sum + v.stock, 0) || 0) > 0 ? '#52c41a' : '#ff4d4f'
                                    }" :show-zero="true" />
                            </template>

                            <!-- Biến thể -->
                            <template v-if="column.key === 'variants'">
                                <div v-if="record.product_variants && record.product_variants.length"
                                    style="display: flex; flex-direction: column; gap: 4px;">
                                    <div v-for="(variant, idx) in record.product_variants" :key="idx"
                                        style="display: flex; gap: 4px; flex-wrap: wrap;">
                                        <a-tag color="green">{{ variant.size?.name }}</a-tag>
                                        <a-tag :color="variant.color?.hex_code || 'default'">{{ variant.color?.name
                                            }}</a-tag>
                                        <a-tag :color="variant.stock === 0 ? 'default' : 'blue'">SL: {{ variant.stock
                                            }}</a-tag>
                                    </div>
                                </div>
                                <span v-else>-</span>
                            </template>

                            <!-- Trạng thái -->
                            <template v-if="column.key === 'status'">
                                <a-tag :color="record.status ? 'green' : 'red'">
                                    {{ record.status ? 'Hoạt động' : 'Ngưng hoạt động' }}
                                </a-tag>
                            </template>

                            <!-- Công cụ -->
                            <template v-if="column.key === 'action'">
                                <div style="display: flex; gap: 8px;">
                                    <router-link :to="{ name: 'admin-products-update', params: { id: record.id } }">
                                        <a-button type="primary" size="small">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </a-button>
                                    </router-link>
                                    <a-button type="primary" danger size="small" @click="handleDelete(record.id)">
                                        <i class="fa-solid fa-trash"></i>
                                    </a-button>
                                </div>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </a-card>
    </div>
</template>
<style></style>
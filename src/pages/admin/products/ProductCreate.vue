<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-products']);

const isLoadingSubmit = ref(false);
const router = useRouter();

const errors = ref({});
const products = reactive({
    brand_id: null,
    title: '',
    description: '',
    gender: null,
    material: '',
    original_price: 0,
    discount: 0,
    thumbnail: null,
});

// Lấy danh sách thương hiệu
const brands = ref([]);
const getBrands = () => {
    // Dữ liệu mẫu tạm thời
    brands.value = [
        { label: 'Nike', value: 1 },
        { label: 'Adidas', value: 2 },
        { label: 'Puma', value: 3 },
        { label: 'Uniqlo', value: 4 }
    ];

    // Code gọi API thật (comment lại)
    /*
    axios.get(`${API_URL}/admin/brands`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            if (response.status === 200) {
                brands.value = response.data.map(brand => ({
                    label: brand.name,
                    value: brand.id
                }));
            }
        })
        .catch((error) => {
            console.error('Error fetching brands:', error);
        });
    */
};

// Giới tính
const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Unisex', value: 'unisex' }
];

const imageFiles = ref([]);
const handleImageChange = ({ fileList }) => {
    imageFiles.value = fileList.map(f => f.originFileObj).filter(Boolean);
};

// Lấy danh sách sizes
const sizes = ref([]);
const getSizes = () => {
    // Dữ liệu mẫu tạm thời
    sizes.value = [
        { label: 'S', value: 1 },
        { label: 'M', value: 2 },
        { label: 'L', value: 3 },
        { label: 'XL', value: 4 },
        { label: 'XXL', value: 5 }
    ];

    // Code gọi API thật (comment lại)
    /*
    axios.get(`${API_URL}/admin/sizes`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => {
            sizes.value = res.data.map(item => ({
                label: item.name,
                value: item.id
            }));
        });
    */
};

// Lấy danh sách colors
const colors = ref([]);
const getColors = () => {
    // Dữ liệu mẫu tạm thời
    colors.value = [
        { label: 'Đen', value: 1 },
        { label: 'Trắng', value: 2 },
        { label: 'Xám', value: 3 },
        { label: 'Xanh navy', value: 4 },
        { label: 'Hồng', value: 5 }
    ];

    // Code gọi API thật (comment lại)
    /*
    axios.get(`${API_URL}/admin/colors`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => {
            colors.value = res.data.map(item => ({
                label: item.name,
                value: item.id
            }));
        });
    */
};

const variants = ref([
    { size_id: null, color_id: null, stock: 0 }
]);

const addVariant = () => {
    variants.value.push({ size_id: null, color_id: null, stock: 0 });
};

const removeVariant = (idx) => {
    if (variants.value.length > 1) variants.value.splice(idx, 1);
};

const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        products.thumbnail = event.target.files[0];
    } else {
        products.thumbnail = null;
    }
};

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('brand_id', products.brand_id);
    formData.append('title', products.title);
    formData.append('description', products.description);
    formData.append('gender', products.gender);
    formData.append('material', products.material);
    formData.append('original_price', products.original_price);
    formData.append('discount', products.discount);
    if (products.thumbnail) {
        formData.append('thumbnail', products.thumbnail);
    }

    // Biến thể sản phẩm
    formData.append('variants', JSON.stringify(variants.value));

    // Ảnh phụ
    imageFiles.value.forEach((file, idx) => {
        formData.append(`images[${idx}]`, file);
    });

    try {
        isLoadingSubmit.value = true;
        await axios.post(`${API_URL}/admin/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        message.success('Tạo sản phẩm thành công!');
        router.push({ name: 'admin-products' });
    } catch (error) {
        message.error('Tạo sản phẩm thất bại!');
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        }
        console.error('Error creating product:', error);
    } finally {
        isLoadingSubmit.value = false;
    }
};

onMounted(() => {
    getBrands();
    getSizes();
    getColors();
});
</script>

<template>
    <a-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <a-card title="Tạo mới sản phẩm" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Thương hiệu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.brand_id }">Thương hiệu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-select show-search placeholder="Chọn thương hiệu" style="width: 100%" :options="brands"
                                allow-clear v-model:value="products.brand_id"
                                :class="{ 'select-danger': errors.brand_id }">
                            </a-select>
                            <div class="w-100"></div>
                            <small v-if="errors.brand_id" class="text-danger">{{ errors.brand_id[0] }}</small>
                        </div>
                    </div>

                    <!-- Tên sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.title }">Tên sản phẩm</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Tên sản phẩm" allow-clear v-model:value="products.title"
                                :class="{ 'input-danger': errors.title }" />
                            <div class="w-100"></div>
                            <small v-if="errors.title" class="text-danger">{{ errors.title[0] }}</small>
                        </div>
                    </div>

                    <!-- Mô tả sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span :class="{ 'text-danger': errors.description }">Mô tả sản phẩm</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-textarea placeholder="Mô tả sản phẩm" allow-clear v-model:value="products.description"
                                :rows="4" />
                            <div class="w-100"></div>
                        </div>
                    </div>

                    <!-- Giới tính -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.gender }">Giới tính</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-select placeholder="Chọn giới tính" style="width: 100%" :options="genderOptions"
                                allow-clear v-model:value="products.gender" :class="{ 'select-danger': errors.gender }">
                            </a-select>
                            <div class="w-100"></div>
                            <small v-if="errors.gender" class="text-danger">{{ errors.gender[0] }}</small>
                        </div>
                    </div>

                    <!-- Chất liệu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span :class="{ 'text-danger': errors.material }">Chất liệu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="VD: Cotton 100%" allow-clear v-model:value="products.material"
                                :class="{ 'input-danger': errors.material }" />
                            <div class="w-100"></div>
                            <small v-if="errors.material" class="text-danger">{{ errors.material[0] }}</small>
                        </div>
                    </div>

                    <!-- Giá gốc sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.original_price }">Giá gốc</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number placeholder="Giá gốc" v-model:value="products.original_price"
                                :class="{ 'input-danger': errors.original_price }" :min="0" style="width: 100%"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" />
                            <div class="w-100"></div>
                            <small v-if="errors.original_price" class="text-danger">{{ errors.original_price[0]
                                }}</small>
                        </div>
                    </div>

                    <!-- Giảm giá -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>
                                <span :class="{ 'text-danger': errors.discount }">Giảm giá (%)</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number placeholder="Giảm giá" allow-clear v-model:value="products.discount"
                                :class="{ 'input-danger': errors.discount }" :min="0" :max="100" style="width: 100%" />
                            <div class="w-100"></div>
                            <small v-if="errors.discount" class="text-danger">{{ errors.discount[0] }}</small>
                        </div>
                    </div>

                    <!-- Giá bán ra sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>
                                <span>Giá chính thức</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <span class="fs-5 fw-bold text-primary">
                                {{
                                    (products.original_price - (products.original_price * products.discount) /
                                        100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- Thumbnail -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.thumbnail }">Ảnh thumbnail</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <input type="file" name="thumbnail" @change="handleFileChange" accept="image/*" />
                            <div class="w-100"></div>
                            <small v-if="errors.thumbnail" class="text-danger">{{ errors.thumbnail[0] }}</small>
                        </div>
                    </div>

                    <!-- Hình ảnh phụ -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span :class="{ 'text-danger': errors.images }">Ảnh phụ</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-upload multiple :show-upload-list="true" :before-upload="() => false"
                                @change="handleImageChange" accept="image/*" list-type="picture">
                                <a-button>
                                    <i class="fa-solid fa-upload me-2"></i>
                                    Chọn ảnh phụ
                                </a-button>
                            </a-upload>
                            <div class="w-100"></div>
                            <small v-if="errors.images" class="text-danger">{{ errors.images[0] }}</small>
                        </div>
                    </div>

                    <!-- Biến thể sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span>Biến thể sản phẩm</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-9">
                            <div class="row mb-2">
                                <div class="col-3">
                                    <strong>Size</strong>
                                </div>
                                <div class="col-3">
                                    <strong>Màu sắc</strong>
                                </div>
                                <div class="col-3">
                                    <strong>Số lượng</strong>
                                </div>
                                <div class="col-3">
                                    <strong>Hành động</strong>
                                </div>
                            </div>
                            <div v-for="(variant, idx) in variants" :key="idx" class="row mb-3">
                                <div class="col-3">
                                    <a-select v-model:value="variant.size_id" :options="sizes" placeholder="Chọn size"
                                        style="width: 100%" />
                                </div>
                                <div class="col-3">
                                    <a-select v-model:value="variant.color_id" :options="colors" placeholder="Chọn màu"
                                        style="width: 100%" />
                                </div>
                                <div class="col-3">
                                    <a-input-number v-model:value="variant.stock" :min="0" placeholder="Số lượng"
                                        style="width: 100%" />
                                </div>
                                <div class="col-3">
                                    <a-button type="primary" danger @click="removeVariant(idx)"
                                        v-if="variants.length > 1">
                                        <i class="fa-solid fa-trash"></i>
                                    </a-button>
                                </div>
                            </div>
                            <a-button type="dashed" @click="addVariant" block>
                                <i class="fa-solid fa-plus me-2"></i>
                                Thêm biến thể
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-products' }">
                        <a-button class="me-sm-2 mb-3 mb-sm-0">
                            <i class="fa-solid fa-xmark me-2"></i>
                            <span>Huỷ</span>
                        </a-button>
                    </router-link>
                    <a-button type="primary" html-type="submit" :loading="isLoadingSubmit">
                        <i class="fa-solid fa-floppy-disk me-2"></i>
                        <span>Lưu</span>
                    </a-button>
                </div>
            </div>
        </a-card>
    </a-form>
</template>

<style scoped>
.select-danger {
    border: 1px solid red;
    border-radius: 7px;
}

.input-danger {
    border-color: red;
}
</style>
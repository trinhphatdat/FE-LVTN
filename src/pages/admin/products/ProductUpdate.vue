<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-products']);

const router = useRouter();
const route = useRoute();

const errors = ref({});
const isLoadingSubmit = ref(false);

const products = reactive({
    id: null,
    brand_id: null,
    title: '',
    description: '',
    gender: null,
    material: '',
    original_price: 0,
    discount: 0,
    thumbnail: '', // đường dẫn ảnh cũ
});

const selectedThumbnail = ref(null); // file thumbnail mới

const imageFiles = ref([]); // file ảnh phụ mới
const oldImages = ref([]); // đường dẫn ảnh phụ cũ

const sizes = ref([]);
const colors = ref([]);
const variants = ref([]); // biến thể cũ hoặc mới

const brands = ref([]);

// Giới tính
const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Unisex', value: 'unisex' }
];

// Lấy thông tin sản phẩm cần sửa khi vào trang
const getProduct = async () => {
    try {
        // Dữ liệu mẫu tạm thời
        const data = {
            id: 1,
            brand_id: 1,
            title: 'Áo thun basic cotton',
            description: 'Áo thun cotton cao cấp, thoáng mát',
            gender: 'male',
            material: 'Cotton 100%',
            original_price: 350000,
            discount: 29,
            thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
            product_variants: [
                { size_id: 2, color_id: 1, stock: 15 },
                { size_id: 3, color_id: 1, stock: 20 }
            ],
            product_images: [
                { image_url: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg' }
            ]
        };

        // Code gọi API thật (comment lại)
        /*
        const res = await axios.get(`${API_URL}/admin/products/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = res.data;
        */

        products.id = data.id;
        products.brand_id = data.brand_id;
        products.title = data.title;
        products.description = data.description;
        products.gender = data.gender;
        products.material = data.material;
        products.original_price = data.original_price;
        products.discount = data.discount;
        products.thumbnail = data.thumbnail;

        // Biến thể
        variants.value = data.product_variants?.length
            ? data.product_variants.map(v => ({
                size_id: v.size_id,
                color_id: v.color_id,
                stock: v.stock
            }))
            : [{ size_id: null, color_id: null, stock: 0 }];

        // Ảnh phụ cũ
        oldImages.value = data.product_images?.map(img => img.image_url) || [];
    } catch (error) {
        message.error('Không tìm thấy sản phẩm!');
        router.push({ name: 'admin-products' });
    }
};

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

const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        selectedThumbnail.value = event.target.files[0];
    } else {
        selectedThumbnail.value = null;
    }
};

const handleImageChange = ({ fileList }) => {
    imageFiles.value = fileList.map(f => f.originFileObj).filter(Boolean);
};

const addVariant = () => {
    variants.value.push({ size_id: null, color_id: null, stock: 0 });
};

const removeVariant = (idx) => {
    if (variants.value.length > 1) variants.value.splice(idx, 1);
};

const handleRemoveOldImage = (img) => {
    oldImages.value = oldImages.value.filter(i => i !== img);
};

const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('brand_id', products.brand_id ? Number(products.brand_id) : '');
    formData.append('title', products.title ?? '');
    formData.append('description', products.description ?? '');
    formData.append('gender', products.gender ?? '');
    formData.append('material', products.material ?? '');
    formData.append('original_price', products.original_price ? Number(products.original_price) : '');
    formData.append('discount', products.discount !== null && products.discount !== undefined ? Number(products.discount) : '');

    // Thumbnail mới
    if (selectedThumbnail.value) {
        formData.append('thumbnail', selectedThumbnail.value);
    }

    // Biến thể sản phẩm
    formData.append('variants', JSON.stringify(variants.value));

    // Ảnh phụ mới
    imageFiles.value.forEach((file, idx) => {
        formData.append(`images[${idx}]`, file);
    });

    // Ảnh phụ cũ giữ lại
    formData.append('old_images', JSON.stringify(oldImages.value));

    try {
        isLoadingSubmit.value = true;
        await axios.post(
            `${API_URL}/admin/products/${products.id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: { _method: 'PUT' }
            }
        );
        message.success('Cập nhật sản phẩm thành công!');
        router.push({ name: 'admin-products' });
    } catch (error) {
        message.error('Cập nhật sản phẩm thất bại!');
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        }
    } finally {
        isLoadingSubmit.value = false;
    }
};

onMounted(() => {
    getProduct();
    getBrands();
    getSizes();
    getColors();
});
</script>

<template>
    <a-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <a-card title="Cập nhật sản phẩm" style="width: 100%;">
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
                            <label>
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
                                {{ (products.original_price - (products.original_price * products.discount) /
                                    100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                            </span>
                        </div>
                    </div>

                    <!-- Thumbnail -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.thumbnail }">Ảnh đại diện</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <input type="file" name="thumbnail" @change="handleFileChange" accept="image/*" />
                            <div class="w-100"></div>
                            <small v-if="errors.thumbnail" class="text-danger">{{ errors.thumbnail[0] }}</small>
                            <div v-if="products.thumbnail && !selectedThumbnail" class="mt-2">
                                <img :src="products.thumbnail.startsWith('http') ? products.thumbnail : STORAGE_URL + products.thumbnail"
                                    alt="Thumbnail" style="max-width: 120px; border: 1px solid #eee;" />
                            </div>
                            <div v-if="selectedThumbnail" class="mt-2">
                                <img :src="URL.createObjectURL(selectedThumbnail)" alt="Thumbnail mới"
                                    style="max-width: 120px; border: 1px solid #eee;" />
                            </div>
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
                                    Chọn ảnh phụ mới
                                </a-button>
                            </a-upload>
                            <div class="w-100"></div>
                            <small v-if="errors.images" class="text-danger">{{ errors.images[0] }}</small>
                            <div class="mt-2" v-if="oldImages.length">
                                <div v-for="img in oldImages" :key="img"
                                    style="display:inline-block;position:relative;margin-right:8px;margin-bottom:8px;">
                                    <img :src="img.startsWith('http') ? img : STORAGE_URL + img" alt="Ảnh phụ"
                                        style="max-width:80px;border:1px solid #eee;" />
                                    <a-button size="small" type="primary" danger
                                        style="position:absolute;top:0;right:0;" @click="handleRemoveOldImage(img)">
                                        <i class="fa-solid fa-times"></i>
                                    </a-button>
                                </div>
                            </div>
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
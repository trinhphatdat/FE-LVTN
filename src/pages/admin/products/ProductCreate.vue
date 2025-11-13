<script setup>
import { reactive, ref } from 'vue';
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

const brands = ref([]);
const getBrands = () => {
    axios.get(`${API_URL}/admin/brands`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            brands.value = response.data.map(brand => ({
                label: brand.name,
                value: brand.id
            }));
        })
        .catch((error) => {
            console.error('Error fetching brands:', error);
        });
};
getBrands();

// Giới tính
const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Unisex', value: 'unisex' }
];

const sizes = ref([]);
const getSizes = () => {
    axios.get(`${API_URL}/admin/sizes`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            sizes.value = response.data.map(item => ({
                label: item.name,
                value: item.id
            }));
        });
};
getSizes();

const colors = ref([]);
const getColors = () => {
    axios.get(`${API_URL}/admin/colors`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            colors.value = response.data.map(item => ({
                label: item.name,
                value: item.id
            }));
        });
};
getColors();

const variants = ref([
    { size_id: null, color_id: null, stock: 0, images: [] }
]);

const addVariant = () => {
    variants.value.push({ size_id: null, color_id: null, stock: 0, images: [] });
};

const removeVariant = (idx) => {
    if (variants.value.length > 1) variants.value.splice(idx, 1);
};

// Xử lý upload ảnh cho từng variant
const handleVariantImageChange = (index, { fileList }) => {
    variants.value[index].images = fileList.map(f => f.originFileObj).filter(Boolean);
};

const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        products.thumbnail = event.target.files[0];
    } else {
        products.thumbnail = null;
    }
};

const handleSubmit = async () => {
    // Validate variants
    const hasEmptyVariant = variants.value.some(v => !v.size_id || !v.color_id);
    if (hasEmptyVariant) {
        message.error('Vui lòng chọn đầy đủ size và màu cho các biến thể');
        return;
    }

    const formData = new FormData();
    formData.append('brand_id', products.brand_id);
    formData.append('title', products.title);
    formData.append('description', products.description || '');
    formData.append('gender', products.gender);
    formData.append('material', products.material || '');
    formData.append('original_price', products.original_price);
    formData.append('discount', products.discount);

    if (products.thumbnail) {
        formData.append('thumbnail', products.thumbnail);
    }

    // Biến thể sản phẩm (không bao gồm images)
    const variantsData = variants.value.map(v => ({
        size_id: v.size_id,
        color_id: v.color_id,
        stock: v.stock
    }));
    formData.append('variants', JSON.stringify(variantsData));

    // Ảnh cho từng biến thể
    const variantImageMapping = [];
    let imageCounter = 0;

    variants.value.forEach((variant, index) => {
        if (variant.images && variant.images.length > 0) {
            const imageKeys = [];
            variant.images.forEach((file) => {
                const key = imageCounter++;
                formData.append(`variant_image_${key}`, file);
                imageKeys.push(key);
            });
            variantImageMapping[index] = imageKeys;
        }
    });

    formData.append('variant_images', JSON.stringify(variantImageMapping));

    try {
        isLoadingSubmit.value = true;
        errors.value = {};

        await axios.post(`${API_URL}/admin/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        message.success('Tạo sản phẩm thành công!');
        router.push({ name: 'admin-products' });
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors;
            message.error('Vui lòng kiểm tra lại thông tin');
        } else {
            message.error('Tạo sản phẩm thất bại!');
        }
        console.error('Error creating product:', error);
    } finally {
        isLoadingSubmit.value = false;
    }
};
</script>

<template>
    <a-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <a-card title="Tạo mới sản phẩm" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Thương hiệu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">Thương hiệu <span class="text-danger">*</span></label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-select show-search placeholder="Chọn thương hiệu" style="width: 100%" :options="brands"
                                v-model:value="products.brand_id" :class="{ 'select-danger': errors.brand_id }" />
                            <div class="w-100"></div>
                            <small v-if="errors.brand_id" class="text-danger">{{ errors.brand_id[0] }}</small>
                        </div>
                    </div>

                    <!-- Tên sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">Tên sản phẩm <span class="text-danger">*</span></label>
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
                            <label for="">Mô tả</label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-textarea placeholder="Mô tả sản phẩm" allow-clear v-model:value="products.description"
                                :rows="4" />
                        </div>
                    </div>

                    <!-- Giới tính -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">Giới tính <span class="text-danger">*</span></label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-select placeholder="Chọn giới tính" style="width: 100%" :options="genderOptions"
                                v-model:value="products.gender" :class="{ 'select-danger': errors.gender }" />
                            <div class="w-100"></div>
                            <small v-if="errors.gender" class="text-danger">{{ errors.gender[0] }}</small>
                        </div>
                    </div>

                    <!-- Chất liệu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">Chất liệu</label>
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
                            <label>Giá gốc <span class="text-danger">*</span></label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number v-model:value="products.original_price" :min="0"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" style="width: 100%"
                                placeholder="0" />
                            <div class="w-100"></div>
                            <small v-if="errors.original_price" class="text-danger">{{ errors.original_price[0]
                                }}</small>
                        </div>
                    </div>

                    <!-- Giảm giá -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>Giảm giá (%)</label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number v-model:value="products.discount" :min="0" :max="100" style="width: 100%"
                                placeholder="0" />
                            <div class="w-100"></div>
                            <small v-if="errors.discount" class="text-danger">{{ errors.discount[0] }}</small>
                        </div>
                    </div>

                    <!-- Giá bán ra -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>Giá bán</label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input
                                :value="(products.original_price - (products.original_price * products.discount / 100)).toLocaleString('vi-VN')"
                                disabled style="width: 100%" />
                        </div>
                    </div>

                    <!-- Thumbnail -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>Ảnh đại diện <span class="text-danger">*</span></label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <input type="file" @change="handleFileChange" accept="image/*" class="form-control" />
                            <div class="w-100"></div>
                            <small v-if="errors.thumbnail" class="text-danger">{{ errors.thumbnail[0] }}</small>
                        </div>
                    </div>

                    <!-- Biến thể sản phẩm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label>Biến thể <span class="text-danger">*</span></label>
                        </div>
                        <div class="col-12 col-sm-9">
                            <div v-for="(variant, index) in variants" :key="index" class="border p-3 mb-3 rounded">
                                <div class="row mb-2">
                                    <div class="col-md-4">
                                        <label class="form-label">Size</label>
                                        <a-select placeholder="Chọn size" style="width: 100%" :options="sizes"
                                            v-model:value="variant.size_id" />
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Màu sắc</label>
                                        <a-select placeholder="Chọn màu" style="width: 100%" :options="colors"
                                            v-model:value="variant.color_id" />
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Số lượng</label>
                                        <a-input-number v-model:value="variant.stock" :min="0" style="width: 100%"
                                            placeholder="0" />
                                    </div>
                                    <div class="col-md-1 d-flex align-items-end">
                                        <a-button danger type="primary" @click="removeVariant(index)"
                                            :disabled="variants.length === 1">
                                            <i class="fa fa-trash"></i>
                                        </a-button>
                                    </div>
                                </div>

                                <!-- Upload ảnh cho biến thể này -->
                                <div class="row">
                                    <div class="col-12">
                                        <label class="form-label">Hình ảnh biến thể</label>
                                        <a-upload list-type="picture-card" :multiple="true" :before-upload="() => false"
                                            @change="(info) => handleVariantImageChange(index, info)" accept="image/*">
                                            <div>
                                                <i class="fa fa-plus"></i>
                                                <div style="margin-top: 8px">Upload</div>
                                            </div>
                                        </a-upload>
                                    </div>
                                </div>
                            </div>

                            <a-button type="dashed" block @click="addVariant">
                                <i class="fa fa-plus me-2"></i> Thêm biến thể
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-products' }">
                        <a-button class="me-sm-2 mb-3 mb-sm-0">
                            Hủy
                        </a-button>
                    </router-link>
                    <a-button type="primary" html-type="submit" :loading="isLoadingSubmit">
                        <span>Lưu</span>
                    </a-button>
                </div>
            </div>
        </a-card>
    </a-form>
</template>
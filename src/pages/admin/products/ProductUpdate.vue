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

const isLoadingSubmit = ref(false);
const isLoading = ref(true);

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

const currentThumbnailUrl = ref(''); // URL ảnh thumbnail hiện tại

const brands = ref([]);
const getBrands = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/brands`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        brands.value = response.data.map(brand => ({
            label: brand.name,
            value: brand.id
        }));
    } catch (error) {
        console.error('Error fetching brands:', error);
        message.error('Không thể tải danh sách thương hiệu');
    }
};

// Giới tính
const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Unisex', value: 'unisex' }
];

const sizes = ref([]);
const getSizes = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/sizes`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        sizes.value = response.data.map(item => ({
            label: item.name,
            value: item.id
        }));
    } catch (error) {
        console.error('Error fetching sizes:', error);
        message.error('Không thể tải danh sách kích thước');
    }
};

const colors = ref([]);
const getColors = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/colors`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        colors.value = response.data.map(item => ({
            label: item.name,
            value: item.id
        }));
    } catch (error) {
        console.error('Error fetching colors:', error);
        message.error('Không thể tải danh sách màu sắc');
    }
};

const variants = ref([
    { size_id: null, color_id: null, stock: 0, images: [], existingImages: [] }
]);

const addVariant = () => {
    variants.value.push({ size_id: null, color_id: null, stock: 0, images: [], existingImages: [] });
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
        // Preview new thumbnail
        currentThumbnailUrl.value = URL.createObjectURL(event.target.files[0]);
    } else {
        products.thumbnail = null;
    }
};

// Lấy thông tin sản phẩm
const getProduct = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get(`${API_URL}/admin/products/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = response.data;

        products.brand_id = data.brand_id;
        products.title = data.title;
        products.description = data.description;
        products.gender = data.gender;
        products.material = data.material;
        products.original_price = data.original_price;
        products.discount = data.discount;

        // Set current thumbnail URL
        currentThumbnailUrl.value = data.thumbnail
            ? (data.thumbnail.startsWith('http') ? data.thumbnail : `${STORAGE_URL}/${data.thumbnail}`)
            : '';

        // Load variants with existing images
        if (data.product_variants && data.product_variants.length > 0) {
            variants.value = data.product_variants.map(v => ({
                size_id: v.size_id,
                color_id: v.color_id,
                stock: v.stock,
                images: [],
                existingImages: v.product_images?.map(img => ({
                    url: img.image_url.startsWith('http') ? img.image_url : `${STORAGE_URL}/${img.image_url}`,
                    id: img.id
                })) || []
            }));
        } else {
            variants.value = [{ size_id: null, color_id: null, stock: 0, images: [], existingImages: [] }];
        }

    } catch (error) {
        console.error('Error fetching product:', error);
        message.error('Không thể tải thông tin sản phẩm');
        router.push({ name: 'admin-products' });
    } finally {
        isLoading.value = false;
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

    // Thumbnail mới (nếu có)
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

        await axios.post(`${API_URL}/admin/products/${route.params.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: { _method: 'PUT' }
        });

        message.success('Cập nhật sản phẩm thành công!');
        router.push({ name: 'admin-products' });
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors;
            message.error('Vui lòng kiểm tra lại thông tin');
        } else {
            message.error('Cập nhật sản phẩm thất bại!');
        }
        console.error('Error updating product:', error);
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
    <a-spin :spinning="isLoading" tip="Đang tải...">
        <a-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <a-card title="Cập nhật sản phẩm" style="width: 100%;">
                <div class="row mb-3">
                    <div class="col-12">
                        <!-- Thương hiệu -->
                        <div class="row mb-3">
                            <div class="col-12 col-sm-3 text-start text-sm-end">
                                <label for="">Thương hiệu <span class="text-danger">*</span></label>
                            </div>
                            <div class="col-12 col-sm-5">
                                <a-select show-search placeholder="Chọn thương hiệu" style="width: 100%"
                                    :options="brands" v-model:value="products.brand_id"
                                    :class="{ 'select-danger': errors.brand_id }" />
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
                                <a-textarea placeholder="Mô tả sản phẩm" allow-clear
                                    v-model:value="products.description" :rows="4" />
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
                                <a-input-number v-model:value="products.discount" :min="0" :max="100"
                                    style="width: 100%" placeholder="0" />
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

                                <!-- Preview thumbnail -->
                                <div v-if="currentThumbnailUrl" class="mt-2">
                                    <img :src="currentThumbnailUrl" alt="Thumbnail"
                                        style="max-width: 120px; border: 1px solid #eee; border-radius: 4px;" />
                                </div>
                            </div>
                        </div>

                        <!-- Biến thể sản phẩm -->
                        <div class="row mb-3">
                            <div class="col-12 col-sm-3 text-start text-sm-end">
                                <label>Biến thể <span class="text-danger">*</span></label>
                            </div>
                            <div class="col-12 col-sm-9 ">
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

                                    <!-- Existing images -->
                                    <div v-if="variant.existingImages && variant.existingImages.length > 0"
                                        class="row mb-2">
                                        <div class="col-12">
                                            <label class="form-label">Hình ảnh hiện tại</label>
                                            <div class="d-flex flex-wrap gap-2">
                                                <div v-for="(img, imgIdx) in variant.existingImages" :key="imgIdx"
                                                    style="position: relative;">
                                                    <img :src="img.url" alt="Variant image"
                                                        style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #eee; border-radius: 4px;" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Upload new images -->
                                    <div class="row">
                                        <div class="col-12">
                                            <label class="form-label">Thêm hình ảnh mới</label>
                                            <a-upload list-type="picture-card" :multiple="true"
                                                :before-upload="() => false"
                                                @change="(info) => handleVariantImageChange(index, info)"
                                                accept="image/*">
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
                            <span>Cập nhật</span>
                        </a-button>
                    </div>
                </div>
            </a-card>
        </a-form>
    </a-spin>
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
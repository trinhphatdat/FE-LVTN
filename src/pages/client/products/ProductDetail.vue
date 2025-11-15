<script setup>
import TheHeader from '@/components/client/TheHeader.vue';
import TheFooter from '@/components/client/TheFooter.vue';
import TheBreadcumbs from '@/components/TheBreadcumbs.vue';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';
import { reactive, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { useUserStore } from '@/stores/use-user-store';
import { storeToRefs } from 'pinia';
import { StarFilled } from '@ant-design/icons-vue';

const isLoading = ref(false);
const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const { isLoggedIn, user } = storeToRefs(userStore)

const quantity = ref(1);
const size_id = ref(null);
const color_id = ref(null);
const currentImageIndex = ref(0);
const showSizeGuide = ref(false);

// Review state
const reviewRating = ref(5);
const reviewComment = ref('');
const demoReviews = ref(
    [
        {
            id: 1,
            user_name: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Sản phẩm rất tốt, chất lượng tuyệt vời!',
            created_at: '2025-10-28 14:30:00',
        },
        {
            id: 2,
            user_name: 'Trần Thị B',
            rating: 4,
            comment: 'Sản phẩm tốt, giao hàng nhanh. Sẽ ủng hộ thêm!',
            created_at: '2025-10-27 10:15:00',
        },
        {
            id: 3,
            user_name: 'Lê Văn C',
            rating: 5,
            comment: 'Tuyệt vời, đúng như mô tả. Rất hài lòng!',
            created_at: '2025-10-26 16:45:00',
        }
    ]);
const averageRating = ref(4.7);
const totalReviews = ref(demoReviews.value.length);

const increaseQuantity = () => {
    quantity.value += 1;
}

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
}

const product = reactive({
    id: null,
    title: '',
    thumbnail: null,
    original_price: 0,
    discount: 0,
    price: 0,
    description: '',
    brand: null,
    material: '',
    gender: '',
    product_variants: [],
    size_guide_image: 'https://file.hstatic.net/1000364782/file/size_menao1_962bae68ced346199475c67fb804a14f.jpg'
});

// Computed properties để lấy danh sách colors và sizes từ variants
const availableColors = computed(() => {
    const colors = [];
    const colorMap = new Map();

    product.product_variants.forEach(variant => {
        if (variant.color && !colorMap.has(variant.color.id)) {
            colorMap.set(variant.color.id, {
                color_id: variant.color.id,
                name: variant.color.name,
                hex_code: variant.color.hex_code
            });
        }
    });

    return Array.from(colorMap.values());
});

const availableSizes = computed(() => {
    const sizes = [];
    const sizeMap = new Map();

    product.product_variants.forEach(variant => {
        if (variant.size) {
            const key = variant.size.id;
            if (!sizeMap.has(key)) {
                sizeMap.set(key, {
                    size_id: variant.size.id,
                    name: variant.size.name,
                    stock: 0
                });
            }
            // Cộng dồn stock của các variant cùng size
            const sizeData = sizeMap.get(key);
            sizeData.stock += variant.stock || 0;
        }
    });

    return Array.from(sizeMap.values());
});

// Computed property để lấy TẤT CẢ hình ảnh từ tất cả variants
const displayImages = computed(() => {
    const images = [];
    const imageSet = new Set(); // Để tránh ảnh trùng lặp

    // Lấy tất cả ảnh từ tất cả variants
    product.product_variants.forEach(variant => {
        if (variant.product_images && variant.product_images.length > 0) {
            variant.product_images.forEach(img => {
                const imageUrl = `${STORAGE_URL}/${img.image_url}`;
                if (!imageSet.has(imageUrl)) {
                    imageSet.add(imageUrl);
                    images.push(imageUrl);
                }
            });
        }
    });

    // Nếu không có ảnh từ variants, dùng thumbnail
    if (images.length === 0 && product.thumbnail) {
        images.push(`${STORAGE_URL}/${product.thumbnail}`);
    }

    return images;
});

const getProduct = () => {
    isLoading.value = true;
    axios.get(`${API_URL}/client/products/${route.params.id}`)
        .then((response) => {
            const data = response.data;
            product.id = data.id;
            product.title = data.title;
            product.thumbnail = data.thumbnail;
            product.original_price = parseFloat(data.original_price);
            product.discount = data.discount;
            product.price = parseFloat(data.price);
            product.description = data.description;
            product.brand = data.brand;
            product.material = data.material;
            product.gender = data.gender;
            product.product_variants = data.product_variants || [];

            // Tự động chọn màu đầu tiên nếu có
            if (availableColors.value.length > 0) {
                color_id.value = availableColors.value[0].color_id;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            message.error('Không tìm thấy sản phẩm!');
            router.push({ name: 'home' });
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    getProduct();
});

const handleAddToCart = () => {
    if (!size_id.value) {
        message.warning('Vui lòng chọn kích thước');
        return;
    }
    if (!color_id.value) {
        message.warning('Vui lòng chọn màu sắc');
        return;
    }

    // Tìm variant tương ứng với size và color đã chọn
    const selectedVariant = product.product_variants.find(
        v => v.size_id === size_id.value && v.color_id === color_id.value
    );

    if (!selectedVariant) {
        message.error('Sản phẩm với màu và size này không tồn tại');
        return;
    }

    if (selectedVariant.stock < quantity.value) {
        message.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho`);
        return;
    }

    if (!isLoggedIn.value) {
        message.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
        router.push({ name: 'account-login' });
    }
    else {
        axios.post(`${API_URL}/cartItems`, {
            cart_id: user.value.cart_id,
            product_id: product.id,
            product_variant_id: selectedVariant.id,
            quantity: quantity.value,
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(() => {
                message.success('Thêm sản phẩm vào giỏ hàng thành công');
                router.push({ name: 'cart' });
            })
            .catch((error) => {
                console.error('Error:', error);
                message.error('Thêm sản phẩm vào giỏ hàng thất bại');
            });
    }
}

const handleSubmitReview = () => {
    if (!isLoggedIn.value) {
        message.error('Bạn cần đăng nhập để đánh giá sản phẩm');
        return;
    }
    if (!reviewComment.value.trim()) {
        message.warning('Vui lòng nhập nội dung đánh giá');
        return;
    }

    const newReview = {
        id: demoReviews.value.length + 1,
        user_name: user.value?.name || 'Người dùng',
        rating: reviewRating.value,
        comment: reviewComment.value,
        created_at: new Date().toISOString(),
    };
    demoReviews.value.unshift(newReview);
    totalReviews.value = demoReviews.value.length;

    message.success('Đánh giá của bạn đã được gửi!');
    reviewComment.value = '';
    reviewRating.value = 5;
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

import defaultAvatarImg from '@/assets/img/default_avatar.png';
const defaultAvatar = defaultAvatarImg;

const changeMainImage = (index) => {
    currentImageIndex.value = index;
}

const toggleSizeGuide = () => {
    showSizeGuide.value = !showSizeGuide.value;
}
</script>

<template>
    <TheLoadingSpinner v-if="isLoading" />
    <TheHeader />
    <TheBreadcumbs />
    <div class="productDetail-page">
        <div class="container">
            <div class="row">
                <!-- left -->
                <div class="col-lg-8 col-md-12 col-12">
                    <div class="productPage-img">
                        <!-- Main Image -->
                        <div class="main-image-wrapper">
                            <a-image-preview-group v-if="displayImages.length > 0">
                                <a-image :src="displayImages[currentImageIndex]" :alt="product.title"
                                    class="main-image" />
                                <!-- Ẩn các hình khác -->
                                <a-image
                                    v-for="(image, index) in displayImages.filter((_, i) => i !== currentImageIndex)"
                                    :key="index" :src="image" :style="{ display: 'none' }" />
                            </a-image-preview-group>
                            <div v-else class="no-image-placeholder">
                                <span>Chưa có hình ảnh</span>
                            </div>
                        </div>

                        <!-- Thumbnails các ảnh -->
                        <div class="thumbnails-gallery mt-3" v-if="displayImages.length > 1">
                            <div class="row g-2">
                                <div v-for="(image, index) in displayImages" :key="index" class="col-3">
                                    <div class="thumbnail-item" :class="{ active: currentImageIndex === index }"
                                        @click="changeMainImage(index)">
                                        <img :src="image" :alt="`${product.title} ${index + 1}`"
                                            class="thumbnail-img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- right -->
                <div class="col-lg-4 col-md-12 col-12">
                    <div class="productPage-detail">
                        <!-- Begin: Tên sản phẩm -->
                        <div class="row product-title">
                            <div class="col-10">
                                <h1 id="product-title">{{ product.title }}</h1>
                            </div>
                            <div class="col-2 d-flex align-items-start justify-content-end">
                                <span style="font-size: 18px;" class=" d-flex align-items-center">
                                    <StarFilled style="color: #faad14;" />
                                    <span class="ms-1" style="font-weight: 600;">{{ averageRating }}</span>
                                </span>
                            </div>
                        </div>
                        <!-- End: Tên sản phẩm -->

                        <!-- Begin: Thương hiệu -->
                        <div class="product-brand mb-2" v-if="product.brand">
                            <span class="text-muted">Thương hiệu: </span>
                            <span class="fw-bold">{{ product.brand.name }}</span>
                        </div>
                        <!-- End: Thương hiệu -->

                        <!-- Begin: Giá sản phẩm -->
                        <div class="product-price" id="product-price">
                            <template v-if="Number(product.discount) > 0">
                                <span class="pro-original-price">
                                    {{ product.original_price.toLocaleString('vi-VN', {
                                        style: 'currency', currency: 'VND'
                                    }) }}
                                </span>
                                <span class="pro-discount">-{{ product.discount }}%</span>
                                <span class="pro-price">
                                    {{ product.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }) }}
                                </span>
                            </template>
                            <template v-else>
                                <span class="pro-price">
                                    {{ product.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }) }}
                                </span>
                            </template>
                        </div>
                        <!-- End: Giá sản phẩm -->

                        <!-- Begin: Mô tả sản phẩm -->
                        <div class="product-desc" v-if="product.description">
                            <h6>Mô tả sản phẩm:</h6>
                            <span>{{ product.description }}</span>
                        </div>
                        <!-- End: Mô tả sản phẩm -->

                        <!-- Begin: form thêm sản phẩm vào giỏ -->
                        <form @submit.prevent="handleAddToCart">
                            <div class="selector-actions">
                                <!-- Begin: màu sắc -->
                                <div class="product-color mb-3" v-if="availableColors.length > 0">
                                    <label class="form-label fw-bold">Màu sắc:</label>
                                    <div class="color-options">
                                        <div v-for="color in availableColors" :key="color.color_id" class="color-item"
                                            :class="{ active: color_id === color.color_id }"
                                            @click="color_id = color.color_id">
                                            <div class="color-circle" :style="{ backgroundColor: color.hex_code }">
                                            </div>
                                            <span class="color-name">{{ color.name }}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- End: màu sắc -->

                                <!-- Begin: kích thước -->
                                <div class="product-size mb-3" v-if="availableSizes.length > 0">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <label class="form-label fw-bold mb-0">Kích thước:</label>
                                        <a href="javascript:void(0)" class="size-guide-link" @click="toggleSizeGuide">
                                            <i class="fas fa-ruler"></i> Hướng dẫn chọn size
                                        </a>
                                    </div>

                                    <a-radio-group class="radio-group" v-model:value="size_id" button-style="solid">
                                        <a-radio-button v-for="size in availableSizes" :key="size.size_id"
                                            :value="size.size_id" class="radio-button me-2"
                                            :disabled="size.stock === 0">
                                            {{ size.name }}
                                        </a-radio-button>
                                    </a-radio-group>
                                </div>
                                <!-- End: kích thước -->

                                <div class="quantity-area">
                                    <input type="button" value="-" class="qty-btn" @click="decreaseQuantity">
                                    <input type="text" id="quantity" name="quantity" class="quantity" v-model="quantity"
                                        min="1" disabled>
                                    <input type="button" value="+" class="qty-btn" @click="increaseQuantity">
                                    <input type="submit" class="btn-add-cart" name="addcart" value="Đặt hàng">
                                </div>
                            </div>
                        </form>
                        <!-- End: form thêm sản phẩm vào giỏ -->
                    </div>
                </div>
            </div>

            <!-- Begin: Đánh giá sản phẩm -->
            <div class="row mt-5">
                <div class="col-12">
                    <div class="product-reviews">
                        <a-divider>
                            <h3 class="reviews-title">Đánh giá sản phẩm</h3>
                        </a-divider>

                        <!-- Form viết đánh giá -->
                        <div class="write-review mb-4">
                            <div v-if="!isLoggedIn" class="text-danger mb-3">
                                <span>Bạn cần đăng nhập để viết đánh giá</span>
                                <router-link :to="{ name: 'account-login' }" class="ms-2 text-primary">
                                    Đăng nhập
                                </router-link>
                            </div>
                            <a-card title="Viết đánh giá của bạn">
                                <a-form @submit.prevent="handleSubmitReview" :disabled="!isLoggedIn">
                                    <div class="mb-3">
                                        <label class="form-label">Đánh giá của bạn:</label>
                                        <div>
                                            <a-rate v-model:value="reviewRating" />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Nhận xét:</label>
                                        <a-textarea v-model:value="reviewComment"
                                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..." :rows="4"
                                            :maxlength="500" show-count />
                                    </div>
                                    <a-button type="primary" html-type="submit" size="large">
                                        Gửi đánh giá
                                    </a-button>
                                </a-form>
                            </a-card>
                        </div>

                        <!-- Begin: list bình luận sản phẩm -->
                        <div class="reviews-list">
                            <h5 class="mb-3">Đánh giá từ khách hàng ({{ demoReviews.length }})</h5>
                            <a-list :data-source="demoReviews" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-comment>
                                            <template #avatar>
                                                <a-avatar :src="defaultAvatar" />
                                            </template>
                                            <template #author>
                                                <span class="review-author">{{ item.user_name }}</span>
                                            </template>
                                            <template #datetime>
                                                <span class="review-date">{{ formatDate(item.created_at) }}</span>
                                            </template>
                                            <template #content>
                                                <div class="mb-2">
                                                    <a-rate :value="item.rating" disabled />
                                                </div>
                                                <p class="review-comment">{{ item.comment }}</p>
                                            </template>
                                        </a-comment>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </div>
                        <!-- End: list bình luận sản phẩm -->
                    </div>
                </div>
            </div>
            <!-- End: Đánh giá sản phẩm -->
        </div>
    </div>

    <!-- Size Guide Modal -->
    <a-modal v-model:open="showSizeGuide" title="Hướng Dẫn Chọn Size" :footer="null" width="800px" centered>
        <div class="size-guide-content">
            <img :src="product.size_guide_image" alt="Size Guide" style="width: 100%; height: auto;" />
            <div class="mt-3">
                <h6>Lưu ý khi chọn size:</h6>
                <ul>
                    <li>Đo chính xác số đo của bạn theo hướng dẫn</li>
                    <li>Nếu số đo nằm giữa 2 size, nên chọn size lớn hơn</li>
                    <li>Sản phẩm có form rộng, thoải mái</li>
                    <li>Liên hệ hotline nếu cần tư vấn thêm</li>
                </ul>
            </div>
        </div>
    </a-modal>

    <TheFooter />
</template>

<style scoped>
/* Image Gallery Styles */
.main-image-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    background-color: #f5f5f5;
    max-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-image {
    width: 100%;
    height: auto;
    max-height: 600px;
    object-fit: contain;
    border-radius: 8px;
    cursor: pointer;
}

:deep(.main-image .ant-image) {
    width: 100%;
    display: block;
}

:deep(.main-image .ant-image-img) {
    width: 100%;
    height: auto;
    max-height: 600px;
    object-fit: contain;
    border-radius: 8px;
}

.thumbnails-gallery {
    width: 100%;
}

.thumbnail-item {
    width: 100%;
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.thumbnail-item:hover {
    border-color: #1890ff;
}

.thumbnail-item.active {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* Color Selection Styles */
.product-color .form-label {
    display: block;
    margin-bottom: 10px;
}

.color-options {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    padding: 8px;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.color-item:hover {
    border-color: #d9d9d9;
}

.color-item.active {
    border-color: #1890ff;
    background-color: #f0f5ff;
}

.color-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #d9d9d9;
    transition: all 0.3s ease;
}

.color-item.active .color-circle {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1890ff;
}

.color-name {
    font-size: 12px;
    color: #666;
    text-align: center;
}

.color-item.active .color-name {
    color: #1890ff;
    font-weight: 600;
}

/* Size Guide Link */
.size-guide-link {
    color: #1890ff;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.size-guide-link:hover {
    color: #40a9ff;
    text-decoration: underline;
}

.size-guide-link i {
    margin-right: 4px;
}

/* Size Guide Modal Content */
.size-guide-content {
    padding: 10px 0;
}

.size-guide-content ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 0;
}

.size-guide-content li {
    margin-bottom: 8px;
    color: #666;
}

.radio-group .radio-button {
    border-radius: 0%;
    padding: 0 30px;
}

.pro-original-price {
    text-decoration: line-through;
    color: #888;
    margin-right: 8px;
}

.pro-discount {
    color: #e53935;
    font-weight: bold;
    margin-right: 8px;
}

.pro-price {
    color: #2e7d32;
    font-weight: bold;
    font-size: 1.2em;
}

/* Reviews Section Styles */
.product-reviews {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
}

.reviews-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0;
}

.rating-summary {
    background-color: #f9f9f9;
}

.average-rating {
    font-size: 48px;
    font-weight: bold;
    color: #faad14;
    line-height: 1;
}

.total-reviews {
    color: #666;
    font-size: 14px;
}

.write-review .form-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.reviews-list {
    margin-top: 30px;
}

.review-author {
    font-weight: 600;
    color: #333;
}

.review-date {
    color: #999;
    font-size: 13px;
}

.review-comment {
    color: #666;
    line-height: 1.6;
    margin: 0;
}

:deep(.ant-comment-content-author-name) {
    font-size: 15px;
}

:deep(.ant-rate-star) {
    font-size: 18px;
}

:deep(.ant-list-item) {
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-card) {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

/* Responsive */
@media (max-width: 768px) {
    .main-image-wrapper {
        max-height: 400px;
    }

    :deep(.main-image .ant-image-img) {
        max-height: 400px;
    }

    .color-circle {
        width: 35px;
        height: 35px;
    }
}

.no-image-placeholder {
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    color: #999;
    font-size: 18px;
    border-radius: 8px;
}
</style>
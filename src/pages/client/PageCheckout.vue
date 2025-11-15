<script setup>
import TheHeader from '@/components/client/TheHeader.vue';
import TheFooter from '@/components/client/TheFooter.vue';
import TheBreadcumbs from '@/components/TheBreadcumbs.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/use-user-store';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, cart_items, isUserLoading, user } = storeToRefs(userStore);

if (!isLoggedIn.value) {
    message.error('Bạn cần đăng nhập để thanh toán');
    router.push({ name: 'account-login' });
}

// Form data
const formData = ref({
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    payment_method: 'cod',
    discount_code: ''
});

// Khởi tạo thông tin người dùng
onMounted(() => {
    if (user.value) {
        formData.value.fullname = user.value.fullname || '';
        formData.value.phone_number = user.value.phone_number || '';
        formData.value.email = user.value.email || '';
        formData.value.address = user.value.address || '';
    }
});

// Tính toán
const shippingFee = ref(15000);
const discount = ref(0);

const totalMoney = computed(() => {
    return (cart_items.value.total_money || 0) + shippingFee.value - discount.value;
});

// Áp dụng mã giảm giá
const applyDiscountCode = () => {
    if (!formData.value.discount_code) {
        message.warning('Vui lòng nhập mã giảm giá');
        return;
    }
    // TODO: Gọi API kiểm tra mã giảm giá
    message.info('Chức năng áp dụng mã giảm giá sẽ được triển khai sau');
};

// Xử lý thanh toán
const handleCheckout = () => {
    if (!formData.value.fullname || !formData.value.phone_number || !formData.value.address) {
        message.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
    }

    // TODO: Gọi API tạo đơn hàng
    message.success('Đơn hàng sẽ được xử lý');
    console.log('Checkout data:', formData.value);
};
</script>

<template>
    <TheLoadingSpinner v-if="isUserLoading" />
    <TheHeader />
    <TheBreadcumbs />

    <div class="layoutPage-checkout">
        <div class="wrapper-checkout">
            <div class="container">
                <div class="heading-page text-center mb-4">
                    <h1>Thanh toán</h1>
                </div>

                <div class="row">
                    <!-- Left: Thông tin giao hàng -->
                    <div class="col-lg-7 col-12 mb-4">
                        <div class="checkout-info-box">
                            <h3 class="section-title">Thông tin giao hàng</h3>

                            <a-form layout="vertical">
                                <a-form-item label="Họ và tên" required>
                                    <a-input v-model:value="formData.fullname" placeholder="Nhập họ và tên"
                                        size="large" />
                                </a-form-item>

                                <div class="row">
                                    <div class="col-md-6">
                                        <a-form-item label="Số điện thoại" required>
                                            <a-input v-model:value="formData.phone_number"
                                                placeholder="Nhập số điện thoại" size="large" />
                                        </a-form-item>
                                    </div>
                                    <div class="col-md-6">
                                        <a-form-item label="Email" required>
                                            <a-input v-model:value="formData.email" placeholder="Nhập email"
                                                size="large" />
                                        </a-form-item>
                                    </div>
                                </div>

                                <a-form-item label="Địa chỉ" required>
                                    <a-textarea v-model:value="formData.address" placeholder="Nhập địa chỉ giao hàng"
                                        :rows="3" size="large" />
                                </a-form-item>

                                <a-form-item label="Ghi chú">
                                    <a-textarea v-model:value="formData.note"
                                        placeholder="Ghi chú về đơn hàng (tùy chọn)" :rows="3" size="large" />
                                </a-form-item>
                            </a-form>
                        </div>

                        <!-- Phương thức thanh toán -->
                        <div class="checkout-info-box mt-4">
                            <h3 class="section-title">Phương thức thanh toán</h3>
                            <a-radio-group v-model:value="formData.payment_method" class="payment-methods">
                                <a-radio value="cod" class="payment-option">
                                    <div class="payment-content">
                                        <strong>Thanh toán khi nhận hàng (COD)</strong>
                                        <p class="text-muted mb-0">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                    </div>
                                </a-radio>
                                <a-radio value="momo" class="payment-option">
                                    <div class="payment-content">
                                        <strong>Ví MoMo</strong>
                                        <p class="text-muted mb-0">Thanh toán qua ví điện tử MoMo</p>
                                    </div>
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>

                    <!-- Right: Thông tin đơn hàng -->
                    <div class="col-lg-5 col-12">
                        <div class="checkout-summary-box">
                            <h3 class="section-title">Đơn hàng của bạn</h3>

                            <!-- Danh sách sản phẩm -->
                            <div class="product-list">
                                <div v-for="item in cart_items.data" :key="item.id" class="product-item">
                                    <div class="product-item-close">
                                        <button type="button" class="btn-close-item">×</button>
                                    </div>
                                    <div class="d-flex">
                                        <div class="product-image">
                                            <a-image v-if="item.product_variant?.product?.thumbnail"
                                                :src="`${STORAGE_URL}/${item.product_variant?.product?.thumbnail}`"
                                                alt="Ảnh sản phẩm" :preview="false" />
                                        </div>
                                        <div class="product-info flex-grow-1">
                                            <h5 class="product-title">
                                                {{ item.product_variant?.product?.title || 'Sản phẩm' }}
                                            </h5>
                                            <div class="product-meta">
                                                <span class="meta-item">
                                                    Kích cỡ: <strong>{{ item.product_variant?.size?.name || 'N/A'
                                                    }}</strong>
                                                </span>
                                            </div>
                                            <div class="product-meta">
                                                <span class="meta-item">
                                                    Màu sắc: <strong>{{ item.product_variant?.color?.name || 'N/A'
                                                    }}</strong>
                                                </span>
                                            </div>
                                            <div class="product-meta mt-2">
                                                <span class="product-price">
                                                    Giá: <strong>{{ Number(item.price || 0).toLocaleString('vi-VN')
                                                        }}₫</strong>
                                                </span>
                                            </div>

                                            <div class="product-meta mt-2">
                                                <span class="product-quantity">
                                                    Số lượng: <strong>{{ item.quantity || 0 }}</strong>
                                                </span>
                                            </div>

                                            <div class="product-total mt-2">
                                                <strong>
                                                    Thành tiền: {{ ((item.price || 0) * (item.quantity ||
                                                        0)).toLocaleString('vi-VN') }}₫
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mã giảm giá -->
                            <div class="discount-code mt-3">
                                <div class="input-group row">
                                    <div class="col-10">
                                        <a-input v-model:value="formData.discount_code" placeholder="Nhập mã giảm giá"
                                            size="large" />
                                    </div>
                                    <div class="col-2">
                                        <a-button type="primary" size="large" @click="applyDiscountCode">
                                            Áp dụng
                                        </a-button>
                                    </div>
                                </div>
                            </div>

                            <!-- Tổng tiền -->
                            <div class="order-summary mt-4">
                                <div class="summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{{ (cart_items.total_money || 0).toLocaleString('vi-VN') }}₫</span>
                                </div>
                                <div class="summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>{{ shippingFee.toLocaleString('vi-VN') }}₫</span>
                                </div>
                                <div v-if="discount > 0" class="summary-row discount">
                                    <span>Giảm giá:</span>
                                    <span>-{{ discount.toLocaleString('vi-VN') }}₫</span>
                                </div>
                                <div class="summary-row total">
                                    <span>Tổng tiền:</span>
                                    <span class="total-amount">{{ totalMoney.toLocaleString('vi-VN') }}₫</span>
                                </div>
                            </div>

                            <div class="checkout-note mt-3">
                                <p class="text-muted">
                                    Phí vận chuyển sẽ được tính ở trang thanh toán. <br>
                                    Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
                                </p>
                            </div>

                            <!-- Buttons -->
                            <div class="checkout-actions mt-4">
                                <a-button type="primary" size="large" block @click="handleCheckout"
                                    class="btn-checkout">
                                    THANH TOÁN
                                </a-button>

                                <div class="text-center mt-3">
                                    <router-link :to="{ name: 'cart' }" class="link-back">
                                        <i class="fa-solid fa-reply"></i>
                                        Trở về giỏ hàng
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <TheFooter />
</template>

<style scoped>
.layoutPage-checkout {
    padding: 40px 0;
    background-color: #f8f9fa;
}

.heading-page h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 10px;
}

.checkout-info-box,
.checkout-summary-box {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
}

/* Product list */
.product-list {
    max-height: 400px;
    overflow-y: auto;
}

.product-item {
    position: relative;
    padding: 15px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    margin-bottom: 15px;
}

.product-item-close {
    position: absolute;
    top: 10px;
    right: 10px;
}

.btn-close-item {
    border: none;
    background: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    line-height: 1;
}

.btn-close-item:hover {
    color: #ff4d4f;
}

.product-image {
    width: 80px;
    height: 80px;
    margin-right: 15px;
    flex-shrink: 0;
}

.product-image :deep(.ant-image) {
    width: 100%;
    height: 100%;
}

.product-image :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
}

.product-info {
    flex: 1;
}

.product-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
}

.product-meta {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
}

.product-price,
.product-quantity {
    font-size: 14px;
    color: #666;
}

.product-total {
    font-size: 15px;
    color: #ff9800;
}

/* Payment methods */
.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.payment-option {
    padding: 15px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    display: block !important;
}

.payment-option:hover {
    border-color: #ffc107;
}

.payment-content {
    margin-left: 10px;
}

/* Order summary */
.order-summary {
    border-top: 2px solid #f0f0f0;
    padding-top: 15px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 15px;
}

.summary-row.discount {
    color: #52c41a;
}

.summary-row.total {
    font-size: 18px;
    font-weight: 600;
    padding-top: 15px;
    border-top: 2px solid #f0f0f0;
    margin-top: 15px;
}

.total-amount {
    color: #ff9800;
    font-size: 24px;
}

/* Buttons thanh toán trang giỏ hàng và thanh toán */
.btn-checkout {
    background-color: #ffc107;
    border-color: #ffc107;
    color: #000;
    font-weight: 600;
    height: 50px;
    font-size: 16px;
}

.btn-checkout:hover {
    background-color: #ffb300;
    border-color: #ffb300;
}

.link-back {
    color: #ffc107;
    text-decoration: none;
    font-size: 15px;
}

.link-back:hover {
    color: #ffb300;
}

.checkout-note {
    font-size: 13px;
    line-height: 1.6;
}

/* Responsive */
@media (max-width: 991px) {
    .checkout-summary-box {
        margin-top: 30px;
    }
}
</style>
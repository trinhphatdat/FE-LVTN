<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/use-user-store';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

if (!userStore.isLoggedIn) {
    router.push({ name: 'account-login' });
}

const orderId = route.params.id;

// Dữ liệu mẫu chi tiết đơn hàng
const order = ref({
    id: 1,
    promotion_id: null,
    user_id: 1,
    fullname: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone_number: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    text_note: 'Giao hàng giờ hành chính',
    order_status: 'shipping',
    shipping_status: 'shipping',
    items_total: 2500000,
    shipping_fee: 30000,
    promotion_discount: 100000,
    total_money: 2430000,
    payment_method: 'COD',
    payment_status: 'unpaid',
    paid_at: null,
    is_custom_order: false,
    shipped_at: '2025-11-06 14:20:00',
    delivered_at: null,
    cancelled_at: null,
    created_at: '2025-11-05 10:30:00',
    updated_at: '2025-11-06 14:20:00',
    order_items: [
        {
            id: 1,
            product_id: 1,
            product_name: 'Áo thun nam basic',
            product_image: 'https://via.placeholder.com/100',
            size: 'L',
            color: 'Đen',
            quantity: 2,
            price: 250000,
            total: 500000,
        },
        {
            id: 2,
            product_id: 2,
            product_name: 'Quần jean nam slim fit',
            product_image: 'https://via.placeholder.com/100',
            size: '32',
            color: 'Xanh đậm',
            quantity: 1,
            price: 2000000,
            total: 2000000,
        },
    ],
});

const getOrderStatusColor = (status) => {
    const colors = {
        pending: 'orange',
        confirmed: 'blue',
        shipping: 'cyan',
        delivered: 'green',
        cancelled: 'red',
    };
    return colors[status] || 'default';
};

const getOrderStatusText = (status) => {
    const texts = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        shipping: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy',
    };
    return texts[status] || status;
};

const getShippingStatusText = (status) => {
    const texts = {
        preparing: 'Đang chuẩn bị',
        shipping: 'Đang giao hàng',
        delivered: 'Đã giao hàng',
        failed: 'Giao hàng thất bại',
    };
    return texts[status] || status;
};

const getPaymentStatusColor = (status) => {
    const colors = {
        unpaid: 'orange',
        paid: 'green',
        refunded: 'purple',
        failed: 'red',
    };
    return colors[status] || 'default';
};

const getPaymentStatusText = (status) => {
    const texts = {
        unpaid: 'Chưa thanh toán',
        paid: 'Đã thanh toán',
        refunded: 'Đã hoàn tiền',
        failed: 'Thất bại',
    };
    return texts[status] || status;
};

const getPaymentMethodText = (method) => {
    const methods = {
        COD: 'Thanh toán khi nhận hàng',
        payos: 'PayOS',
        momo: 'MoMo',
    };
    return methods[method] || method;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleString('vi-VN');
};

const orderTimeline = computed(() => {
    const timeline = [
        {
            label: 'Đơn hàng đã đặt',
            time: order.value.created_at,
            status: 'finish',
        },
    ];
    if (order.value.order_status !== 'pending') {
        timeline.push({
            label: 'Đã xác nhận',
            time: order.value.updated_at,
            status: 'finish',
        });
    }
    if (order.value.shipped_at) {
        timeline.push({
            label: 'Đang giao hàng',
            time: order.value.shipped_at,
            status: order.value.shipping_status === 'shipping' ? 'process' : 'finish',
        });
    }
    if (order.value.delivered_at) {
        timeline.push({
            label: 'Đã giao hàng',
            time: order.value.delivered_at,
            status: 'finish',
        });
    }
    if (order.value.cancelled_at) {
        timeline.push({
            label: 'Đơn hàng đã hủy',
            time: order.value.cancelled_at,
            status: 'error',
        });
    }

    return timeline;
});

const goBack = () => {
    router.push({ name: 'account-orders' });
};

const handleCancelOrder = () => {
    // TODO: Implement cancel order
    console.log('Cancel order:', orderId);
};

const handleReorder = () => {
    // TODO: Implement reorder
    console.log('Reorder:', orderId);
};
</script>

<template>
    <div class="order-details-page">
        <a-card :bordered="false">
            <div class="page-header">
                <a-button @click="goBack" type="text" class="back-button">
                    <template #icon>
                        <ArrowLeftOutlined />
                    </template>
                    Quay lại
                </a-button>
                <h2>Chi tiết đơn hàng #{{ order.id }}</h2>
            </div>

            <!-- Order Status -->
            <a-card class="status-card" :bordered="true">
                <div class="status-header">
                    <a-tag :color="getOrderStatusColor(order.order_status)" class="status-tag">
                        {{ getOrderStatusText(order.order_status) }}
                    </a-tag>
                    <a-tag v-if="order.is_custom_order" color="purple">
                        Đơn hàng đặt riêng
                    </a-tag>
                </div>

                <!-- Timeline -->
                <a-steps :current="orderTimeline.length - 1" class="order-timeline">
                    <a-step v-for="(step, index) in orderTimeline" :key="index" :title="step.label"
                        :description="formatDate(step.time)" :status="step.status" />
                </a-steps>
            </a-card>

            <!-- Order Items -->
            <a-card title="Sản phẩm" class="section-card" :bordered="true">
                <div class="order-items">
                    <div v-for="item in order.order_items" :key="item.id" class="order-item">
                        <img :src="item.product_image" :alt="item.product_name" class="item-image" />
                        <div class="item-info">
                            <h4>{{ item.product_name }}</h4>
                            <p class="item-variant">
                                <span v-if="item.size">Size: {{ item.size }}</span>
                                <span v-if="item.color" class="separator">|</span>
                                <span v-if="item.color">Màu: {{ item.color }}</span>
                            </p>
                            <p class="item-quantity">Số lượng: {{ item.quantity }}</p>
                        </div>
                        <div class="item-price">
                            <p class="unit-price">{{ formatCurrency(item.price) }}</p>
                            <p class="total-price">{{ formatCurrency(item.total) }}</p>
                        </div>
                    </div>
                </div>
            </a-card>

            <a-row :gutter="16">
                <!-- Shipping Information -->
                <a-col :xs="24" :lg="12">
                    <a-card title="Thông tin giao hàng" class="section-card" :bordered="true">
                        <div class="info-group">
                            <p><strong>Người nhận:</strong> {{ order.fullname }}</p>
                            <p><strong>Email:</strong> {{ order.email }}</p>
                            <p><strong>Số điện thoại:</strong> {{ order.phone_number }}</p>
                            <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
                            <p v-if="order.text_note">
                                <strong>Ghi chú:</strong> {{ order.text_note }}
                            </p>
                            <p>
                                <strong>Trạng thái vận chuyển:</strong>
                                <a-tag :color="getOrderStatusColor(order.shipping_status)">
                                    {{ getShippingStatusText(order.shipping_status) }}
                                </a-tag>
                            </p>
                        </div>
                    </a-card>
                </a-col>

                <!-- Payment Information -->
                <a-col :xs="24" :lg="12">
                    <a-card title="Thông tin thanh toán" class="section-card" :bordered="true">
                        <div class="info-group">
                            <p>
                                <strong>Phương thức:</strong>
                                {{ getPaymentMethodText(order.payment_method) }}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <a-tag :color="getPaymentStatusColor(order.payment_status)">
                                    {{ getPaymentStatusText(order.payment_status) }}
                                </a-tag>
                            </p>
                            <p>
                                <strong>Thời gian thanh toán:</strong>
                                {{ formatDate(order.paid_at) }}
                            </p>
                        </div>
                    </a-card>
                </a-col>
            </a-row>

            <!-- Order Summary -->
            <a-card title="Tổng quan đơn hàng" class="section-card" :bordered="true">
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Tổng tiền hàng:</span>
                        <span>{{ formatCurrency(order.items_total) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Phí vận chuyển:</span>
                        <span>{{ formatCurrency(order.shipping_fee) }}</span>
                    </div>
                    <div v-if="order.promotion_discount > 0" class="summary-row discount">
                        <span>Giảm giá:</span>
                        <span>-{{ formatCurrency(order.promotion_discount) }}</span>
                    </div>
                    <a-divider style="margin: 16px 0" />
                    <div class="summary-row total">
                        <span><strong>Tổng cộng:</strong></span>
                        <span class="total-amount">
                            <strong>{{ formatCurrency(order.total_money) }}</strong>
                        </span>
                    </div>
                </div>
            </a-card>

            <!-- Order History -->
            <a-card title="Lịch sử đơn hàng" class="section-card" :bordered="true">
                <div class="info-group">
                    <p><strong>Ngày đặt hàng:</strong> {{ formatDate(order.created_at) }}</p>
                    <p v-if="order.shipped_at">
                        <strong>Ngày bắt đầu giao:</strong> {{ formatDate(order.shipped_at) }}
                    </p>
                    <p v-if="order.delivered_at">
                        <strong>Ngày giao hàng:</strong> {{ formatDate(order.delivered_at) }}
                    </p>
                    <p v-if="order.cancelled_at">
                        <strong>Ngày hủy:</strong> {{ formatDate(order.cancelled_at) }}
                    </p>
                    <p><strong>Cập nhật lần cuối:</strong> {{ formatDate(order.updated_at) }}</p>
                </div>
            </a-card>

            <!-- Actions -->
            <div class="order-actions">
                <a-button v-if="order.order_status === 'delivered' && order.payment_status === 'paid'" type="primary"
                    size="large" @click="handleReorder">
                    Mua lại
                </a-button>
                <a-popconfirm v-if="order.order_status === 'pending'" title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                    ok-text="Có" cancel-text="Không" @confirm="handleCancelOrder">
                    <a-button danger size="large">
                        Hủy đơn hàng
                    </a-button>
                </a-popconfirm>
            </div>
        </a-card>
    </div>
</template>

<style scoped>
.order-details-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    margin-bottom: 24px;
}

.back-button {
    margin-bottom: 16px;
    padding-left: 0;
}

.page-header h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
}

.status-card {
    margin-bottom: 16px;
    border-radius: 8px;
}

.status-header {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.status-tag {
    font-size: 14px;
    padding: 4px 12px;
}

.order-timeline {
    margin-top: 24px;
}

.section-card {
    margin-bottom: 16px;
    border-radius: 8px;
}

.order-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.order-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
}

.item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
}

.item-info {
    flex: 1;
}

.item-info h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
}

.item-variant {
    color: #666;
    font-size: 14px;
    margin: 4px 0;
}

.separator {
    margin: 0 8px;
}

.item-quantity {
    color: #666;
    font-size: 14px;
    margin: 4px 0;
}

.item-price {
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.unit-price {
    color: #666;
    font-size: 14px;
    margin-bottom: 4px;
}

.total-price {
    font-size: 16px;
    font-weight: 600;
    color: #1890ff;
}

.info-group p {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
}

.order-summary {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
}

.summary-row.discount {
    color: #ff4d4f;
}

.summary-row.total {
    font-size: 16px;
}

.total-amount {
    color: #1890ff;
    font-size: 20px;
}

.order-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .order-details-page {
        padding: 16px;
    }

    .order-item {
        flex-direction: column;
    }

    .item-price {
        text-align: left;
    }

    .order-actions {
        flex-direction: column;
    }

    .order-actions button {
        width: 100%;
    }
}
</style>
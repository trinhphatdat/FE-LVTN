<script setup>
import { ref, computed } from 'vue';
import router from '@/router';
import { useUserStore } from '@/stores/use-user-store';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';

const userStore = useUserStore();
if (!userStore.isLoggedIn) {
    router.push({ name: 'account-login' });
}

// Dữ liệu mẫu
const orders = ref([
    {
        id: 1,
        fullname: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone_number: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        text_note: 'Giao hàng giờ hành chính',
        order_status: 'confirmed',
        shipping_status: 'shipping',
        items_total: 2500000,
        shipping_fee: 30000,
        promotion_discount: 100000,
        total_money: 2430000,
        payment_method: 'COD',
        payment_status: 'unpaid',
        is_custom_order: false,
        created_at: '2025-11-05 10:30:00',
        shipped_at: '2025-11-06 14:20:00',
    },
    {
        id: 2,
        fullname: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone_number: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        text_note: '',
        order_status: 'delivered',
        shipping_status: 'delivered',
        items_total: 1200000,
        shipping_fee: 25000,
        promotion_discount: 0,
        total_money: 1225000,
        payment_method: 'momo',
        payment_status: 'paid',
        is_custom_order: false,
        created_at: '2025-10-28 09:15:00',
        delivered_at: '2025-11-01 16:45:00',
    },
    {
        id: 3,
        fullname: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone_number: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        text_note: '',
        order_status: 'cancelled',
        shipping_status: 'failed',
        items_total: 800000,
        shipping_fee: 20000,
        promotion_discount: 50000,
        total_money: 770000,
        payment_method: 'payos',
        payment_status: 'refunded',
        is_custom_order: false,
        created_at: '2025-10-20 14:30:00',
        cancelled_at: '2025-10-21 10:00:00',
    },
]);

const activeTab = ref('all');

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
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
};

const filteredOrders = computed(() => {
    if (activeTab.value === 'all') return orders.value;
    return orders.value.filter(order => order.order_status === activeTab.value);
});

const viewOrderDetail = (orderId) => {
    // TODO: Navigate to order detail page
    router.push({ name: 'account-order-detail', params: { id: orderId } });
};
</script>

<template>
    <div class="orders-page">
        <a-card :bordered="false">

            <a-tabs v-model:activeKey="activeTab">
                <a-tab-pane key="all" tab="Tất cả"></a-tab-pane>
                <a-tab-pane key="pending" tab="Chờ xác nhận"></a-tab-pane>
                <a-tab-pane key="confirmed" tab="Đã xác nhận"></a-tab-pane>
                <a-tab-pane key="shipping" tab="Đang giao"></a-tab-pane>
                <a-tab-pane key="delivered" tab="Đã giao"></a-tab-pane>
                <a-tab-pane key="cancelled" tab="Đã hủy"></a-tab-pane>
            </a-tabs>

            <div v-if="filteredOrders.length === 0" class="empty-state">
                <a-empty description="Không có đơn hàng nào" />
            </div>

            <div v-else class="orders-list">
                <a-card v-for="order in filteredOrders" :key="order.id" class="order-card" :bordered="true">
                    <div class="order-header">
                        <div class="order-info">
                            <span class="order-id">Đơn hàng #{{ order.id }}</span>
                            <a-tag :color="getOrderStatusColor(order.order_status)">
                                {{ getOrderStatusText(order.order_status) }}
                            </a-tag>
                            <a-tag v-if="order.is_custom_order" color="purple">
                                Đơn hàng đặt riêng
                            </a-tag>
                        </div>
                        <span class="order-date">{{ formatDate(order.created_at) }}</span>
                    </div>

                    <a-divider style="margin: 12px 0" />

                    <a-row :gutter="[16, 16]">
                        <a-col :xs="24" :md="12">
                            <div class="info-section">
                                <h4>Thông tin giao hàng</h4>
                                <p><strong>Người nhận:</strong> {{ order.fullname }}</p>
                                <p><strong>Điện thoại:</strong> {{ order.phone_number }}</p>
                                <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
                                <p v-if="order.text_note">
                                    <strong>Ghi chú:</strong> {{ order.text_note }}
                                </p>
                            </div>
                        </a-col>

                        <a-col :xs="24" :md="12">
                            <div class="info-section">
                                <h4>Thông tin thanh toán</h4>
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
                            </div>
                        </a-col>
                    </a-row>

                    <a-divider style="margin: 12px 0" />

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
                        <a-divider style="margin: 8px 0" />
                        <div class="summary-row total">
                            <span><strong>Tổng cộng:</strong></span>
                            <span class="total-amount">
                                <strong>{{ formatCurrency(order.total_money) }}</strong>
                            </span>
                        </div>
                    </div>

                    <div class="order-actions">
                        <a-button type="primary" @click="viewOrderDetail(order.id)">
                            Xem chi tiết
                        </a-button>
                        <a-button v-if="order.order_status === 'delivered' && order.payment_status === 'paid'"
                            type="default">
                            Mua lại
                        </a-button>
                        <a-button v-if="order.order_status === 'pending'" danger>
                            Hủy đơn
                        </a-button>
                    </div>
                </a-card>
            </div>
        </a-card>
    </div>
</template>

<style scoped>
.orders-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
}

.order-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.order-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.order-id {
    font-size: 16px;
    font-weight: 600;
}

.order-date {
    color: #666;
    font-size: 14px;
}

.info-section h4 {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
}

.info-section p {
    margin-bottom: 8px;
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
    margin-bottom: 8px;
    font-size: 14px;
}

.summary-row.discount {
    color: #ff4d4f;
}

.summary-row.total {
    font-size: 16px;
    margin-top: 8px;
}

.total-amount {
    color: #1890ff;
    font-size: 18px;
}

.order-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
}

.empty-state {
    padding: 60px 0;
    text-align: center;
}

@media (max-width: 768px) {
    .orders-page {
        padding: 16px;
    }

    .order-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .order-actions {
        flex-direction: column;
    }

    .order-actions button {
        width: 100%;
    }
}
</style>
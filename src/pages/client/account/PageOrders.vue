<script setup>
import { ref, computed, onMounted } from 'vue';
import router from '@/router';
import { useUserStore } from '@/stores/use-user-store';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';
import axios from 'axios';
import { message, Modal } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const userStore = useUserStore();
if (!userStore.isLoggedIn) {
    router.push({ name: 'account-login' });
}

// State
const orders = ref([]);
const loading = ref(false);
const activeTab = ref('all');

// Fetch orders từ API
const fetchOrders = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.data.success) {
            orders.value = response.data.data;
        }
    } catch (error) {
        console.error('Fetch orders error:', error);
        message.error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
        loading.value = false;
    }
};

// Hủy đơn hàng
const cancelOrder = async (orderId) => {
    try {
        const response = await axios.post(
            `${API_URL}/orders/${orderId}/cancel`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (response.data.success) {
            message.success('Hủy đơn hàng thành công');
            fetchOrders(); // Reload danh sách
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        message.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
};

// Confirm hủy đơn hàng
const confirmCancelOrder = (orderId) => {
    Modal.confirm({
        title: 'Xác nhận hủy đơn hàng',
        content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
        okText: 'Hủy đơn',
        cancelText: 'Không',
        okButtonProps: { danger: true },
        onOk: () => {
            cancelOrder(orderId);
        }
    });
};

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
    router.push({ name: 'account-order-detail', params: { id: orderId } });
};

// Mua lại đơn hàng
const reOrder = async (order) => {
    try {
        // TODO: Thêm sản phẩm từ đơn hàng vào giỏ hàng
        message.info('Chức năng mua lại đang được phát triển');
    } catch (error) {
        console.error('Re-order error:', error);
        message.error('Không thể mua lại đơn hàng');
    }
};

// Load orders khi component mount
onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div class="orders-page">
        <TheLoadingSpinner v-if="loading" />

        <a-card :bordered="false">
            <a-tabs v-model:activeKey="activeTab" @change="fetchOrders">
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

                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                            <div class="info-section">
                                <h4>Thông tin giao hàng</h4>
                                <p><strong>Người nhận:</strong> {{ order.fullname }}</p>
                                <p><strong>Điện thoại:</strong> {{ order.phone_number }}</p>
                                <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
                                <p v-if="order.text_note">
                                    <strong>Ghi chú:</strong> {{ order.text_note }}
                                </p>
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
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
                        </div>
                    </div>

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
                            type="default" @click="reOrder(order)">
                            Mua lại
                        </a-button>
                        <a-button v-if="order.order_status === 'pending'" danger @click="confirmCancelOrder(order.id)">
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
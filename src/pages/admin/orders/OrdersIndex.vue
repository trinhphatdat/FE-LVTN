<script setup>
import { ref, computed, onMounted } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-orders']);

const orders = ref([]);
const loading = ref(false);
const searchText = ref('');
const selectedStatus = ref('all');
const selectedOrder = ref(null);
const isModalVisible = ref(false);

const statistics = ref({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0
});

// Columns definition
const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', width: 100, fixed: 'left' },
    { title: 'Khách hàng', dataIndex: 'fullname', key: 'fullname', width: 150 },
    { title: 'Số điện thoại', dataIndex: 'phone_number', key: 'phone_number', width: 120 },
    { title: 'Tổng tiền', dataIndex: 'total_money', key: 'total_money', width: 130 },
    { title: 'Trạng thái', dataIndex: 'order_status', key: 'order_status', width: 130 },
    { title: 'Thanh toán', dataIndex: 'payment_method', key: 'payment_method', width: 120 },
    { title: 'Ngày đặt', dataIndex: 'created_at', key: 'created_at', width: 150 },
    { title: 'Thao tác', key: 'action', width: 130, fixed: 'right' }
];

// Lấy danh sách đơn hàng
const getOrders = async () => {
    try {
        loading.value = true;
        const response = await axios.get(`${API_URL}/admin/orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                status: selectedStatus.value,
                search: searchText.value
            }
        });

        if (response.data.success) {
            orders.value = response.data.data;
            statistics.value = response.data.statistics;
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('Không thể tải danh sách đơn hàng');
    } finally {
        loading.value = false;
    }
};

// Lọc đơn hàng theo tìm kiếm và trạng thái
const filteredOrders = computed(() => {
    let result = orders.value;

    if (searchText.value) {
        const search = searchText.value.toLowerCase();
        result = result.filter(order =>
            order.id.toString().includes(search) ||
            order.fullname.toLowerCase().includes(search) ||
            order.phone_number.includes(search)
        );
    }

    return result;
});

// Helper functions
const formatCurrency = (value) => {
    if (!value && value !== 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
const getStatusColor = (status) => {
    const colors = {
        pending: 'orange',
        confirmed: 'blue',
        shipping: 'cyan',
        completed: 'green',
        cancelled: 'red'
    };
    return colors[status] || 'default';
};
const getStatusText = (status) => {
    const texts = {
        pending: 'Chờ xử lý',
        confirmed: 'Đã xác nhận',
        shipping: 'Đang giao',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };
    return texts[status] || status;
};
const getPaymentMethodText = (method) => {
    const texts = {
        cod: 'COD',
        banking: 'Chuyển khoản',
        momo: 'MoMo'
    };
    return texts[method] || method;
};
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// View order details
const viewOrderDetails = async (order) => {
    try {
        const response = await axios.get(`${API_URL}/admin/orders/${order.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.data.success) {
            selectedOrder.value = response.data.data;
            isModalVisible.value = true;
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        message.error('Không thể tải chi tiết đơn hàng');
    }
};

// Update order status
const updateOrderStatus = (order, newStatus) => {
    Modal.confirm({
        title: 'Xác nhận',
        content: `Bạn có chắc muốn cập nhật trạng thái đơn hàng #${order.id} thành "${getStatusText(newStatus)}"?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        async onOk() {
            try {
                const response = await axios.put(
                    `${API_URL}/admin/orders/${order.id}/status`,
                    { order_status: newStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                if (response.data.success) {
                    message.success('Cập nhật trạng thái thành công!');
                    getOrders();
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                if (error.response?.data?.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    message.error(errorMessages[0] || 'Cập nhật trạng thái thất bại');
                } else {
                    message.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
                }
            }
        }
    });
};

// Delete order
const deleteOrder = (order) => {
    Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc muốn xóa đơn hàng #${order.id}? Chỉ có thể xóa đơn hàng đã hủy hoặc hoàn thành.`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        async onOk() {
            try {
                const response = await axios.delete(`${API_URL}/admin/orders/${order.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.success) {
                    message.success('Xóa đơn hàng thành công!');
                    getOrders();
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                message.error(error.response?.data?.message || 'Xóa đơn hàng thất bại');
            }
        }
    });
};

// Watch for filter changes
const handleSearch = () => {
    getOrders();
};

const handleStatusChange = () => {
    getOrders();
};

// Load data on mount
onMounted(() => {
    getOrders();
});
</script>

<template>
    <div class="orders-container">
        <h3 class="mb-4">Quản lý đơn hàng</h3>

        <!-- Statistics Cards -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card text-center">
                    <div class="card-body p-3">
                        <div class="stat-title">Tổng đơn</div>
                        <div class="stat-value text-primary">{{ statistics.total }}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card text-center">
                    <div class="card-body p-3">
                        <div class="stat-title">Chờ xử lý</div>
                        <div class="stat-value text-warning">{{ statistics.pending }}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card text-center">
                    <div class="card-body p-3">
                        <div class="stat-title">Đã xác nhận</div>
                        <div class="stat-value text-info">{{ statistics.confirmed }}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card text-center">
                    <div class="card-body p-3">
                        <div class="stat-title">Đang giao</div>
                        <div class="stat-value text-cyan">{{ statistics.shipping }}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card text-center">
                    <div class="card-body p-3">
                        <div class="stat-title">Hoàn thành</div>
                        <div class="stat-value text-success">{{ statistics.completed }}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card text-center">
                    <div class="card-body p-3">
                        <div class="stat-title">Đã hủy</div>
                        <div class="stat-value text-danger">{{ statistics.cancelled }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-12 col-sm-6 col-md-4">
                        <a-input-search v-model:value="searchText" @search="handleSearch" enter-button="Tìm kiếm"
                            placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..." allow-clear />
                    </div>
                    <div class="col-12 col-sm-6 col-md-4">
                        <a-select v-model:value="selectedStatus" @change="handleStatusChange" style="width: 100%">
                            <a-select-option value="all">Tất cả trạng thái</a-select-option>
                            <a-select-option value="pending">Chờ xử lý</a-select-option>
                            <a-select-option value="confirmed">Đã xác nhận</a-select-option>
                            <a-select-option value="shipping">Đang giao</a-select-option>
                            <a-select-option value="completed">Hoàn thành</a-select-option>
                            <a-select-option value="cancelled">Đã hủy</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <a-card>
            <a-table :columns="columns" :data-source="filteredOrders" :loading="loading" :scroll="{ x: 1200 }"
                :row-key="record => record.id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'id'">
                        <strong>#{{ record.id }}</strong>
                    </template>

                    <template v-if="column.key === 'total_money'">
                        <span class="fw-bold text-success">{{ formatCurrency(record.total_money) }}</span>
                    </template>

                    <template v-if="column.key === 'order_status'">
                        <a-tag :color="getStatusColor(record.order_status)">
                            {{ getStatusText(record.order_status) }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'payment_method'">
                        <a-tag :color="record.payment_method === 'cod' ? 'orange' : 'blue'">
                            {{ getPaymentMethodText(record.payment_method) }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'created_at'">
                        {{ formatDate(record.created_at) }}
                    </template>

                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-tooltip title="Xem chi tiết" class="me-2">
                                <a-button type="primary" size="small" @click="viewOrderDetails(record)">
                                    <i class="fa-solid fa-eye"></i>
                                </a-button>
                            </a-tooltip>

                            <a-dropdown class="me-2"
                                v-if="record.order_status !== 'completed' && record.order_status !== 'cancelled'">
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item v-if="record.order_status === 'pending'"
                                            @click="updateOrderStatus(record, 'confirmed')">
                                            <i class="fa-solid fa-check me-2"></i>Xác nhận
                                        </a-menu-item>
                                        <a-menu-item v-if="record.order_status === 'confirmed'"
                                            @click="updateOrderStatus(record, 'shipping')">
                                            <i class="fa-solid fa-truck me-2"></i>Đang giao
                                        </a-menu-item>
                                        <a-menu-item v-if="record.order_status === 'shipping'"
                                            @click="updateOrderStatus(record, 'completed')">
                                            <i class="fa-solid fa-check-double me-2"></i>Hoàn thành
                                        </a-menu-item>
                                        <a-menu-divider />
                                        <a-menu-item danger @click="updateOrderStatus(record, 'cancelled')">
                                            <i class="fa-solid fa-xmark me-2"></i>Hủy đơn
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                                <a-tooltip title="Cập nhật trạng thái">
                                    <a-button size="small">
                                        <i class="fa-solid fa-arrows-rotate"></i>
                                    </a-button>
                                </a-tooltip>
                            </a-dropdown>

                            <a-tooltip title="Xóa" class="me-2">
                                <a-button danger size="small" @click="deleteOrder(record)"
                                    :disabled="!['cancelled', 'completed'].includes(record.order_status)">
                                    <i class="fa-solid fa-trash"></i>
                                </a-button>
                            </a-tooltip>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>

        <!-- Order Details Modal -->
        <a-modal v-model:open="isModalVisible" title="Chi tiết đơn hàng" :footer="null" width="900px">
            <div v-if="selectedOrder">
                <a-descriptions bordered :column="2" size="small">
                    <a-descriptions-item label="Mã đơn hàng">
                        <strong>#{{ selectedOrder.id }}</strong>
                    </a-descriptions-item>
                    <a-descriptions-item label="Trạng thái">
                        <a-tag :color="getStatusColor(selectedOrder.order_status)">
                            {{ getStatusText(selectedOrder.order_status) }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="Khách hàng">
                        {{ selectedOrder.fullname }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Số điện thoại">
                        {{ selectedOrder.phone_number }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Email" :span="2">
                        {{ selectedOrder.email }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Địa chỉ" :span="2">
                        {{ selectedOrder.address }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Ghi chú" :span="2" v-if="selectedOrder.text_note">
                        {{ selectedOrder.text_note }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Phương thức thanh toán">
                        <a-tag :color="selectedOrder.payment_method === 'cod' ? 'orange' : 'blue'">
                            {{ getPaymentMethodText(selectedOrder.payment_method) }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="Trạng thái thanh toán">
                        <a-tag :color="selectedOrder.payment_status === 'paid' ? 'green' : 'orange'">
                            {{ selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="Ngày đặt">
                        {{ formatDate(selectedOrder.created_at) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Cập nhật lần cuối">
                        {{ formatDate(selectedOrder.updated_at) }}
                    </a-descriptions-item>
                </a-descriptions>

                <!-- Thông tin khuyến mãi -->
                <div v-if="selectedOrder.promotion" class="mt-3 p-3 bg-light rounded">
                    <h6><i class="fa-solid fa-ticket me-2"></i>Mã giảm giá áp dụng</h6>
                    <p class="mb-0">
                        <strong>{{ selectedOrder.promotion.name }}</strong> -
                        Giảm {{ formatCurrency(selectedOrder.promotion_discount) }}
                    </p>
                </div>

                <a-divider>Sản phẩm</a-divider>
                <a-table :columns="[
                    { title: 'Sản phẩm', key: 'product', width: 250 },
                    { title: 'Size', key: 'size', width: 80 },
                    { title: 'Màu', key: 'color', width: 100 },
                    { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 60 },
                    { title: 'Đơn giá', key: 'price', width: 120 },
                    { title: 'Thành tiền', key: 'total', width: 120 }
                ]" :data-source="selectedOrder.order_details" :pagination="false" size="small"
                    :row-key="record => record.id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'product'">
                            <div class="d-flex align-items-center">
                                <a-image v-if="record.product_variant?.product?.thumbnail"
                                    :src="`${STORAGE_URL}/${record.product_variant.product.thumbnail}`" :width="50"
                                    :height="50" style="object-fit: cover; border-radius: 4px;" class="me-2" />
                                <span>{{ record.product_variant?.product?.title }}</span>
                            </div>
                        </template>
                        <template v-if="column.key === 'size'">
                            {{ record.product_variant?.size?.name }}
                        </template>
                        <template v-if="column.key === 'color'">
                            <a-tag :color="record.product_variant?.color?.hex_code">
                                {{ record.product_variant?.color?.name }}
                            </a-tag>
                        </template>
                        <template v-if="column.key === 'price'">
                            {{ formatCurrency(record.price) }}
                        </template>
                        <template v-if="column.key === 'total'">
                            <strong>{{ formatCurrency(record.total_price) }}</strong>
                        </template>
                    </template>
                </a-table>

                <!-- Order Summary -->
                <div class="mt-4">
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex justify-content-end">
                                <div style="min-width: 300px;">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Tổng tiền sản phẩm:</span>
                                        <strong>{{ formatCurrency(selectedOrder.items_total) }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Phí vận chuyển:</span>
                                        <strong>{{ formatCurrency(selectedOrder.shipping_fee) }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2"
                                        v-if="selectedOrder.promotion_discount > 0">
                                        <span>Giảm giá:</span>
                                        <strong class="text-danger">-{{ formatCurrency(selectedOrder.promotion_discount)
                                            }}</strong>
                                    </div>
                                    <a-divider style="margin: 8px 0;" />
                                    <div class="d-flex justify-content-between">
                                        <h5 class="mb-0">Tổng cộng:</h5>
                                        <h5 class="mb-0 text-danger">{{ formatCurrency(selectedOrder.total_money) }}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<style scoped>
.orders-container {
    padding: 24px;
}

.stat-title {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
}

.text-cyan {
    color: #13c2c2;
}

.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
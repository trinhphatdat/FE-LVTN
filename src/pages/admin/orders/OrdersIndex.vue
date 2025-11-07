<script setup>
import { ref, computed } from 'vue';
import { Modal, message } from 'ant-design-vue';

// Dữ liệu mẫu - sau này sẽ lấy từ API
const orders = ref([
    {
        id: 1,
        orderCode: 'ORD001',
        customerName: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@email.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        totalAmount: 450000,
        status: 'pending',
        paymentMethod: 'cod',
        createdAt: '2025-11-03 10:30:00',
        items: [
            { productName: 'Áo thun Basic Trắng', size: 'M', color: 'Trắng', quantity: 2, price: 150000 },
            { productName: 'Áo thun Polo Đen', size: 'L', color: 'Đen', quantity: 1, price: 150000 }
        ]
    },
    {
        id: 2,
        orderCode: 'ORD002',
        customerName: 'Trần Thị B',
        phone: '0987654321',
        email: 'tranthib@email.com',
        address: '456 Đường XYZ, Quận 3, TP.HCM',
        totalAmount: 320000,
        status: 'processing',
        paymentMethod: 'banking',
        createdAt: '2025-11-03 09:15:00',
        items: [
            { productName: 'Áo thun Oversize Xám', size: 'XL', color: 'Xám', quantity: 2, price: 160000 }
        ]
    },
    {
        id: 3,
        orderCode: 'ORD003',
        customerName: 'Lê Văn C',
        phone: '0369852147',
        email: 'levanc@email.com',
        address: '789 Đường DEF, Quận 5, TP.HCM',
        totalAmount: 890000,
        status: 'shipping',
        paymentMethod: 'cod',
        createdAt: '2025-11-02 14:20:00',
        items: [
            { productName: 'Áo thun Basic Trắng', size: 'M', color: 'Trắng', quantity: 3, price: 150000 },
            { productName: 'Áo thun Cotton Xanh Navy', size: 'L', color: 'Xanh Navy', quantity: 2, price: 170000 }
        ]
    },
    {
        id: 4,
        orderCode: 'ORD004',
        customerName: 'Phạm Thị D',
        phone: '0912345678',
        email: 'phamthid@email.com',
        address: '321 Đường GHI, Quận 7, TP.HCM',
        totalAmount: 560000,
        status: 'completed',
        paymentMethod: 'banking',
        createdAt: '2025-11-02 11:45:00',
        items: [
            { productName: 'Áo thun Form Rộng Nâu', size: 'XL', color: 'Nâu', quantity: 4, price: 140000 }
        ]
    },
    {
        id: 5,
        orderCode: 'ORD005',
        customerName: 'Hoàng Văn E',
        phone: '0978123456',
        email: 'hoangvane@email.com',
        address: '654 Đường JKL, Quận 10, TP.HCM',
        totalAmount: 720000,
        status: 'cancelled',
        paymentMethod: 'cod',
        createdAt: '2025-11-01 16:30:00',
        items: [
            { productName: 'Áo thun Polo Đen', size: 'M', color: 'Đen', quantity: 3, price: 150000 },
            { productName: 'Áo thun Basic Trắng', size: 'L', color: 'Trắng', quantity: 2, price: 150000 }
        ]
    }
]);

const loading = ref(false);
const searchText = ref('');
const selectedStatus = ref('all');
const selectedOrder = ref(null);
const isModalVisible = ref(false);

// Columns definition
const columns = [
    { title: 'Mã đơn', dataIndex: 'orderCode', key: 'orderCode', width: 100 },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', width: 130 },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130 },
    { title: 'Thanh toán', dataIndex: 'paymentMethod', key: 'paymentMethod', width: 120 },
    { title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
    { title: 'Thao tác', key: 'action', width: 150, fixed: 'right' }
];

// Filter orders
const filteredOrders = computed(() => {
    let result = orders.value;

    // Filter by status
    if (selectedStatus.value !== 'all') {
        result = result.filter(order => order.status === selectedStatus.value);
    }

    // Filter by search text
    if (searchText.value) {
        const search = searchText.value.toLowerCase();
        result = result.filter(order =>
            order.orderCode.toLowerCase().includes(search) ||
            order.customerName.toLowerCase().includes(search) ||
            order.phone.includes(search)
        );
    }

    return result;
});

// Statistics
const statistics = computed(() => {
    return {
        total: orders.value.length,
        pending: orders.value.filter(o => o.status === 'pending').length,
        processing: orders.value.filter(o => o.status === 'processing').length,
        shipping: orders.value.filter(o => o.status === 'shipping').length,
        completed: orders.value.filter(o => o.status === 'completed').length,
        cancelled: orders.value.filter(o => o.status === 'cancelled').length
    };
});

// Helper functions
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusColor = (status) => {
    const colors = {
        pending: 'orange',
        processing: 'blue',
        shipping: 'cyan',
        completed: 'green',
        cancelled: 'red'
    };
    return colors[status] || 'default';
};

const getStatusText = (status) => {
    const texts = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        shipping: 'Đang giao',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };
    return texts[status] || status;
};

const getPaymentMethodText = (method) => {
    const texts = {
        cod: 'COD',
        banking: 'Chuyển khoản'
    };
    return texts[method] || method;
};

// View order details
const viewOrderDetails = (order) => {
    selectedOrder.value = order;
    isModalVisible.value = true;
};

// Update order status
const updateOrderStatus = (order, newStatus) => {
    Modal.confirm({
        title: 'Xác nhận',
        content: `Bạn có chắc muốn cập nhật trạng thái đơn hàng ${order.orderCode} thành "${getStatusText(newStatus)}"?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk() {
            const index = orders.value.findIndex(o => o.id === order.id);
            if (index !== -1) {
                orders.value[index].status = newStatus;
                message.success('Cập nhật trạng thái thành công!');
            }
        }
    });
};

// Delete order
const deleteOrder = (order) => {
    Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc muốn xóa đơn hàng ${order.orderCode}?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk() {
            const index = orders.value.findIndex(o => o.id === order.id);
            if (index !== -1) {
                orders.value.splice(index, 1);
                message.success('Xóa đơn hàng thành công!');
            }
        }
    });
};

// Print order
const printOrder = (order) => {
    message.info(`Đang in đơn hàng ${order.orderCode}...`);
    // Implement print functionality
};
</script>

<template>
    <div class="orders-container">
        <h3 class="mb-4">Quản lý đơn hàng</h3>

        <!-- Statistics Cards -->
        <a-row :gutter="[16, 16]" class="mb-4">
            <a-col :xs="12" :sm="8" :md="4">
                <a-card>
                    <a-statistic title="Tổng đơn" :value="statistics.total" :value-style="{ color: '#1890ff' }" />
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="8" :md="4">
                <a-card>
                    <a-statistic title="Chờ xử lý" :value="statistics.pending" :value-style="{ color: '#faad14' }" />
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="8" :md="4">
                <a-card>
                    <a-statistic title="Đang xử lý" :value="statistics.processing"
                        :value-style="{ color: '#1890ff' }" />
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="8" :md="4">
                <a-card>
                    <a-statistic title="Đang giao" :value="statistics.shipping" :value-style="{ color: '#13c2c2' }" />
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="8" :md="4">
                <a-card>
                    <a-statistic title="Hoàn thành" :value="statistics.completed" :value-style="{ color: '#52c41a' }" />
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="8" :md="4">
                <a-card>
                    <a-statistic title="Đã hủy" :value="statistics.cancelled" :value-style="{ color: '#f5222d' }" />
                </a-card>
            </a-col>
        </a-row>

        <!-- Filters -->
        <a-card class="mb-4">
            <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="12" :md="8">
                    <a-input-search v-model:value="searchText" placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..."
                        allow-clear />
                </a-col>
                <a-col :xs="24" :sm="12" :md="8">
                    <a-select v-model:value="selectedStatus" style="width: 100%">
                        <a-select-option value="all">Tất cả trạng thái</a-select-option>
                        <a-select-option value="pending">Chờ xử lý</a-select-option>
                        <a-select-option value="processing">Đang xử lý</a-select-option>
                        <a-select-option value="shipping">Đang giao</a-select-option>
                        <a-select-option value="completed">Hoàn thành</a-select-option>
                        <a-select-option value="cancelled">Đã hủy</a-select-option>
                    </a-select>
                </a-col>
            </a-row>
        </a-card>

        <!-- Orders Table -->
        <a-card>
            <a-table :columns="columns" :data-source="filteredOrders" :loading="loading" :scroll="{ x: 1200 }"
                :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} đơn hàng` }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'totalAmount'">
                        <span class="fw-bold text-success">{{ formatCurrency(record.totalAmount) }}</span>
                    </template>

                    <template v-if="column.key === 'status'">
                        <a-tag :color="getStatusColor(record.status)">
                            {{ getStatusText(record.status) }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'paymentMethod'">
                        <a-tag :color="record.paymentMethod === 'cod' ? 'orange' : 'blue'">
                            {{ getPaymentMethodText(record.paymentMethod) }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-tooltip title="Xem chi tiết">
                                <a-button type="primary" size="small" @click="viewOrderDetails(record)">
                                    <i class="fa-solid fa-eye"></i>
                                </a-button>
                            </a-tooltip>

                            <a-dropdown v-if="record.status !== 'completed' && record.status !== 'cancelled'">
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item v-if="record.status === 'pending'"
                                            @click="updateOrderStatus(record, 'processing')">
                                            <i class="fa-solid fa-spinner me-2"></i>Đang xử lý
                                        </a-menu-item>
                                        <a-menu-item v-if="record.status === 'processing'"
                                            @click="updateOrderStatus(record, 'shipping')">
                                            <i class="fa-solid fa-truck me-2"></i>Đang giao
                                        </a-menu-item>
                                        <a-menu-item v-if="record.status === 'shipping'"
                                            @click="updateOrderStatus(record, 'completed')">
                                            <i class="fa-solid fa-check me-2"></i>Hoàn thành
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

                            <a-tooltip title="In đơn hàng">
                                <a-button size="small" @click="printOrder(record)">
                                    <i class="fa-solid fa-print"></i>
                                </a-button>
                            </a-tooltip>

                            <a-tooltip title="Xóa">
                                <a-button danger size="small" @click="deleteOrder(record)">
                                    <i class="fa-solid fa-trash"></i>
                                </a-button>
                            </a-tooltip>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>

        <!-- Order Details Modal -->
        <a-modal v-model:open="isModalVisible" title="Chi tiết đơn hàng" :footer="null" width="800px">
            <div v-if="selectedOrder">
                <a-descriptions bordered :column="2">
                    <a-descriptions-item label="Mã đơn hàng">
                        <strong>{{ selectedOrder.orderCode }}</strong>
                    </a-descriptions-item>
                    <a-descriptions-item label="Trạng thái">
                        <a-tag :color="getStatusColor(selectedOrder.status)">
                            {{ getStatusText(selectedOrder.status) }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="Khách hàng">
                        {{ selectedOrder.customerName }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Số điện thoại">
                        {{ selectedOrder.phone }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Email" :span="2">
                        {{ selectedOrder.email }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Địa chỉ" :span="2">
                        {{ selectedOrder.address }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Phương thức thanh toán">
                        <a-tag :color="selectedOrder.paymentMethod === 'cod' ? 'orange' : 'blue'">
                            {{ getPaymentMethodText(selectedOrder.paymentMethod) }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="Ngày đặt">
                        {{ selectedOrder.createdAt }}
                    </a-descriptions-item>
                </a-descriptions>

                <a-divider>Sản phẩm</a-divider>

                <a-table :columns="[
                    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
                    { title: 'Size', dataIndex: 'size', key: 'size' },
                    { title: 'Màu', dataIndex: 'color', key: 'color' },
                    { title: 'SL', dataIndex: 'quantity', key: 'quantity' },
                    { title: 'Đơn giá', dataIndex: 'price', key: 'price' },
                    { title: 'Thành tiền', key: 'total' }
                ]" :data-source="selectedOrder.items" :pagination="false" size="small">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'price'">
                            {{ formatCurrency(record.price) }}
                        </template>
                        <template v-if="column.key === 'total'">
                            <strong>{{ formatCurrency(record.price * record.quantity) }}</strong>
                        </template>
                    </template>
                </a-table>

                <div class="text-end mt-3">
                    <h4>Tổng cộng: <span class="text-danger">{{ formatCurrency(selectedOrder.totalAmount) }}</span></h4>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<style scoped>
.orders-container {
    padding: 24px;
}

:deep(.ant-statistic-title) {
    font-size: 13px;
}

:deep(.ant-statistic-content) {
    font-size: 20px;
    font-weight: 600;
}
</style>
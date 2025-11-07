<script setup>
import { ref } from 'vue';

// Dữ liệu mẫu - sau này sẽ lấy từ API
const statistics = ref({
    totalRevenue: 125000000,
    totalOrders: 1234,
    totalProducts: 156,
    totalCustomers: 892
});

const recentOrders = ref([
    { id: 'ORD001', customer: 'Nguyễn Văn A', total: 450000, status: 'completed', date: '03-11-2025' },
    { id: 'ORD002', customer: 'Trần Thị B', total: 320000, status: 'pending', date: '03-11-2025' },
    { id: 'ORD003', customer: 'Lê Văn C', total: 890000, status: 'processing', date: '02-11-2025' },
    { id: 'ORD004', customer: 'Phạm Thị D', total: 560000, status: 'completed', date: '02-11-2025' },
    { id: 'ORD005', customer: 'Hoàng Văn E', total: 720000, status: 'shipping', date: '01-11-2025' }
]);

const topProducts = ref([
    { name: 'Áo thun Basic Trắng', sold: 234, revenue: 11700000 },
    { name: 'Áo thun Polo Đen', sold: 189, revenue: 9450000 },
    { name: 'Áo thun Oversize Xám', sold: 156, revenue: 7800000 },
    { name: 'Áo thun Form Rộng Nâu', sold: 142, revenue: 7100000 },
    { name: 'Áo thun Cotton Xanh Navy', sold: 128, revenue: 6400000 }
]);

const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Ngày đặt', dataIndex: 'date', key: 'date' }
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusColor = (status) => {
    const colors = {
        completed: 'success',
        pending: 'warning',
        processing: 'processing',
        shipping: 'cyan',
        cancelled: 'error'
    };
    return colors[status] || 'default';
};

const getStatusText = (status) => {
    const texts = {
        completed: 'Hoàn thành',
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        shipping: 'Đang giao',
        cancelled: 'Đã hủy'
    };
    return texts[status] || status;
};
</script>

<template>
    <div class="dashboard-container">
        <h3 class="mb-4">Dashboard</h3>

        <!-- Statistics Cards -->
        <a-row :gutter="[16, 16]" class="mb-4">
            <a-col :xs="24" :sm="12" :lg="6">
                <a-card>
                    <a-statistic title="Tổng doanh thu" :value="statistics.totalRevenue" :precision="0" suffix="₫"
                        :value-style="{ color: '#3f8600' }">
                        <template #prefix>
                            <i class="fa-solid fa-dollar-sign"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card>
                    <a-statistic title="Tổng đơn hàng" :value="statistics.totalOrders"
                        :value-style="{ color: '#1890ff' }">
                        <template #prefix>
                            <i class="fa-solid fa-shopping-cart"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card>
                    <a-statistic title="Tổng sản phẩm" :value="statistics.totalProducts"
                        :value-style="{ color: '#cf1322' }">
                        <template #prefix>
                            <i class="fa-solid fa-shirt"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>

            <a-col :xs="24" :sm="12" :lg="6">
                <a-card>
                    <a-statistic title="Tổng khách hàng" :value="statistics.totalCustomers"
                        :value-style="{ color: '#722ed1' }">
                        <template #prefix>
                            <i class="fa-solid fa-users"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
        </a-row>

        <!-- Charts and Lists -->
        <a-row :gutter="[16, 16]">
            <!-- Recent Orders -->
            <a-col :xs="24" :lg="14">
                <a-card title="Đơn hàng gần đây" :bordered="false">
                    <a-table :columns="columns" :data-source="recentOrders" :pagination="false" :scroll="{ x: 600 }">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'total'">
                                <span class="fw-bold">{{ formatCurrency(record.total) }}</span>
                            </template>
                            <template v-if="column.key === 'status'">
                                <a-tag :color="getStatusColor(record.status)">
                                    {{ getStatusText(record.status) }}
                                </a-tag>
                            </template>
                        </template>
                    </a-table>
                    <div class="text-center mt-3">
                        <a-button type="link">Xem tất cả đơn hàng →</a-button>
                    </div>
                </a-card>
            </a-col>

            <!-- Top Products -->
            <a-col :xs="24" :lg="10">
                <a-card title="Sản phẩm bán chạy" :bordered="false">
                    <a-list :data-source="topProducts" :split="true">
                        <template #renderItem="{ item, index }">
                            <a-list-item>
                                <a-list-item-meta>
                                    <template #avatar>
                                        <a-badge :count="index + 1" :number-style="{ backgroundColor: '#52c41a' }">
                                            <a-avatar shape="square" size="large">
                                                <i class="fa-solid fa-shirt"></i>
                                            </a-avatar>
                                        </a-badge>
                                    </template>
                                    <template #title>
                                        <div class="fw-bold">{{ item.name }}</div>
                                    </template>
                                    <template #description>
                                        <div class="d-flex justify-content-between">
                                            <span>Đã bán: <strong>{{ item.sold }}</strong></span>
                                            <span class="text-success fw-bold">{{ formatCurrency(item.revenue) }}</span>
                                        </div>
                                    </template>
                                </a-list-item-meta>
                            </a-list-item>
                        </template>
                    </a-list>
                </a-card>
            </a-col>
        </a-row>

        <!-- Quick Actions -->
        <!-- <a-row :gutter="[16, 16]" class="mt-4">
            <a-col :span="24">
                <a-card title="Thao tác nhanh" :bordered="false">
                    <a-space :size="16" wrap>
                        <a-button type="primary" size="large">
                            <i class="fa-solid fa-plus me-2"></i>
                            Thêm sản phẩm mới
                        </a-button>
                        <a-button size="large">
                            <i class="fa-solid fa-shopping-cart me-2"></i>
                            Xem đơn hàng
                        </a-button>
                        <a-button size="large">
                            <i class="fa-solid fa-users me-2"></i>
                            Quản lý khách hàng
                        </a-button>
                        <a-button size="large">
                            <i class="fa-solid fa-chart-line me-2"></i>
                            Báo cáo chi tiết
                        </a-button>
                    </a-space>
                </a-card>
            </a-col>
        </a-row> -->
    </div>
</template>

<style scoped>
.dashboard-container {
    padding: 24px;
}

:deep(.ant-statistic-title) {
    font-size: 14px;
    margin-bottom: 8px;
}

:deep(.ant-statistic-content) {
    font-size: 24px;
    font-weight: 600;
}

:deep(.ant-card-head-title) {
    font-size: 18px;
    font-weight: 600;
}

:deep(.ant-table) {
    font-size: 14px;
}
</style>
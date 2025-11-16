<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-dashboard']);

const loading = ref(false);

// Dữ liệu thống kê
const statistics = ref({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    currentMonthRevenue: 0,
    revenueGrowth: 0,
});

// Dữ liệu doanh thu theo tháng
const monthlyRevenue = ref([]);

// Lấy thống kê tổng quan
const getStatistics = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/dashboard/statistics`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.data.success) {
            statistics.value = response.data.data;
        }
    } catch (error) {
        console.error('Error fetching statistics:', error);
        message.error('Không thể tải thống kê');
    }
};

// Lấy doanh thu theo tháng
const getMonthlyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/dashboard/monthly-revenue`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.data.success) {
            monthlyRevenue.value = response.data.data;
        }
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        message.error('Không thể tải doanh thu theo tháng');
    }
};

// Cấu hình biểu đồ
const chartOption = computed(() => ({
    title: {
        text: 'Doanh thu theo tháng',
        left: 'center',
        textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: (params) => {
            const value = params[0].value;
            const orderCount = monthlyRevenue.value[params[0].dataIndex]?.order_count || 0;
            return `${params[0].name}<br/>Doanh thu: ${formatCurrency(value)}<br/>Số đơn: ${orderCount}`;
        }
    },
    xAxis: {
        type: 'category',
        data: monthlyRevenue.value.map(item => item.month),
        axisLabel: {
            interval: 0
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: (value) => {
                return (value / 1000000) + 'M';
            }
        }
    },
    series: [
        {
            name: 'Doanh thu',
            type: 'line',
            data: monthlyRevenue.value.map(item => item.revenue),
            smooth: true,
            lineStyle: {
                color: '#1890ff',
                width: 3
            },
            itemStyle: {
                color: '#1890ff'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                        { offset: 1, color: 'rgba(24, 144, 255, 0)' }
                    ]
                }
            }
        }
    ],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
}));

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const loadData = async () => {
    loading.value = true;
    try {
        await Promise.all([
            getStatistics(),
            getMonthlyRevenue()
        ]);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadData();
});
</script>

<template>
    <div class="dashboard-container">
        <h3 class="mb-4">Dashboard</h3>

        <!-- Thống kê chính -->
        <div class="row g-3 mb-4">
            <div class="col-12 col-sm-6 col-lg-3">
                <a-card class="card" :loading="loading">
                    <a-statistic title="Tổng doanh thu" :value="statistics.totalRevenue" :precision="0"
                        :value-style="{ color: '#3f8600' }">
                        <template #prefix>
                            <i class="fa-solid fa-dollar-sign"></i>
                        </template>
                        <template #suffix>
                            <span style="font-size: 14px;">₫</span>
                        </template>
                    </a-statistic>
                    <div class="mt-2 text-muted" style="font-size: 12px;">
                        <span :class="statistics.revenueGrowth >= 0 ? 'text-success' : 'text-danger'">
                            <i
                                :class="statistics.revenueGrowth >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
                            {{ statistics.revenueGrowth }}%
                        </span>
                        so với tháng trước
                    </div>
                </a-card>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
                <a-card class="card" :loading="loading">
                    <a-statistic title="Tổng đơn hàng" :value="statistics.totalOrders"
                        :value-style="{ color: '#1890ff' }">
                        <template #prefix>
                            <i class="fa-solid fa-shopping-cart"></i>
                        </template>
                    </a-statistic>
                    <div class="mt-2 text-muted" style="font-size: 12px;">
                        <a-tag color="orange">{{ statistics.pendingOrders }}</a-tag>
                        đơn chờ xử lý
                    </div>
                </a-card>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
                <a-card class="card" :loading="loading">
                    <a-statistic title="Tổng sản phẩm" :value="statistics.totalProducts"
                        :value-style="{ color: '#cf1322' }">
                        <template #prefix>
                            <i class="fa-solid fa-shirt"></i>
                        </template>
                    </a-statistic>
                    <div class="mt-2 text-muted" style="font-size: 12px;">
                        <a-tag v-if="statistics.lowStockProducts > 0" color="red">
                            {{ statistics.lowStockProducts }}
                        </a-tag>
                        <span v-if="statistics.lowStockProducts > 0">sắp hết hàng</span>
                        <span v-else class="text-success">Tồn kho ổn định</span>
                    </div>
                </a-card>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
                <a-card class="card" :loading="loading">
                    <a-statistic title="Tổng khách hàng" :value="statistics.totalCustomers"
                        :value-style="{ color: '#722ed1' }">
                        <template #prefix>
                            <i class="fa-solid fa-users"></i>
                        </template>
                    </a-statistic>
                    <div class="mt-2 text-muted" style="font-size: 12px;">
                        Khách hàng đã đăng ký
                    </div>
                </a-card>
            </div>
        </div>

        <!-- Doanh thu tháng hiện tại -->
        <div class="row g-3 mb-4">
            <div class="col-12">
                <a-card class="card" :loading="loading">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-2">Doanh thu tháng này</h6>
                            <h3 class="mb-0 text-success">{{ formatCurrency(statistics.currentMonthRevenue) }}</h3>
                        </div>
                        <div class="text-end">
                            <a-tag :color="statistics.revenueGrowth >= 0 ? 'green' : 'red'" style="font-size: 16px;">
                                <i
                                    :class="statistics.revenueGrowth >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"></i>
                                {{ statistics.revenueGrowth >= 0 ? '+' : '' }}{{ statistics.revenueGrowth }}%
                            </a-tag>
                        </div>
                    </div>
                </a-card>
            </div>
        </div>

        <!-- Biểu đồ doanh thu -->
        <div class="row">
            <div class="col-12">
                <a-card :loading="loading">
                    <v-chart class="chart" :option="chartOption" autoresize />
                </a-card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard-container {
    padding: 24px;
}

.chart {
    height: 400px;
}

:deep(.ant-statistic-title) {
    font-size: 14px;
    margin-bottom: 8px;
}

:deep(.ant-statistic-content) {
    font-size: 24px;
    font-weight: 600;
}
</style>
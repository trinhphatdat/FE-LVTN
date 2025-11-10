<script setup>
import { ref, computed } from 'vue';

// Dữ liệu mẫu - sau này sẽ lấy từ API
const statistics = ref({
    totalRevenue: 125000000,
    totalOrders: 1234,
    totalProducts: 156,
});

// Dữ liệu doanh thu theo tháng
const monthlyRevenue = ref([
    { month: 'T1', revenue: 8500000 },
    { month: 'T2', revenue: 9200000 },
    { month: 'T3', revenue: 11000000 },
    { month: 'T4', revenue: 10500000 },
    { month: 'T5', revenue: 12300000 },
    { month: 'T6', revenue: 13800000 },
    { month: 'T7', revenue: 15200000 },
    { month: 'T8', revenue: 14500000 },
    { month: 'T9', revenue: 13000000 },
    { month: 'T10', revenue: 14800000 },
    { month: 'T11', revenue: 16500000 },
    { month: 'T12', revenue: 15800000 },
]);

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
            return `${params[0].name}<br/>Doanh thu: ${formatCurrency(value)}`;
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
</script>

<template>
    <div class="dashboard-container">
        <h3 class="mb-4">Dashboard</h3>

        <!-- Thống kê -->
        <div class="row g-3 mb-4">
            <div class="col-12 col-md-6 col-lg-4">
                <a-card class="card">
                    <a-statistic title="Tổng doanh thu" :value="statistics.totalRevenue" :precision="0" suffix="₫"
                        :value-style="{ color: '#3f8600' }">
                        <template #prefix>
                            <i class="fa-solid fa-dollar-sign"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </div>

            <div class="col-12 col-md-6 col-lg-4">
                <a-card class="card">
                    <a-statistic title="Tổng đơn hàng" :value="statistics.totalOrders"
                        :value-style="{ color: '#1890ff' }">
                        <template #prefix>
                            <i class="fa-solid fa-shopping-cart"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </div>

            <div class="col-12 col-md-6 col-lg-4">
                <a-card class="card">
                    <a-statistic title="Tổng sản phẩm" :value="statistics.totalProducts"
                        :value-style="{ color: '#cf1322' }">
                        <template #prefix>
                            <i class="fa-solid fa-shirt"></i>
                        </template>
                    </a-statistic>
                </a-card>
            </div>
        </div>

        <!-- Biểu đồ doanh thu -->
        <div class="row">
            <div class="col-12">
                <a-card>
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
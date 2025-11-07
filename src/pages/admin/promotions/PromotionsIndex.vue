<template>
    <a-card title="Khuyến mãi" style="width: 100%">
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end">
                <router-link :to="{ name: 'admin-promotions-create' }">
                    <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <a-table :dataSource="promotions" :columns="columns" :scroll="{ x: 1200 }">
                    <template #bodyCell="{ column, index, record }">
                        <template v-if="column.key === 'index'">
                            <span>{{ index + 1 }}</span>
                        </template>
                        <template v-if="column.key === 'url_image'">
                            <a-img :src="record.url_image" :alt="record.name"
                                style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                        </template>
                        <template v-if="column.key === 'discount_type'">
                            <a-tag :color="getDiscountTypeColor(record.discount_type)">
                                {{ getDiscountTypeText(record.discount_type) }}
                            </a-tag>
                        </template>
                        <template v-if="column.key === 'discount_value'">
                            <span v-if="record.discount_type === 'percentage'">
                                {{ record.discount_value }}%
                            </span>
                            <span v-else-if="record.discount_type === 'fixed_amount'">
                                {{ formatCurrency(record.discount_value) }}
                            </span>
                            <span v-else>
                                Miễn phí ship
                            </span>
                        </template>
                        <template v-if="column.key === 'usage'">
                            <span>{{ record.used_count }} / {{ record.usage_limit || '∞' }}</span>
                        </template>
                        <template v-if="column.key === 'date_range'">
                            <div style="font-size: 12px;">
                                <div><strong>Bắt đầu:</strong> {{ formatDate(record.start_date) }}</div>
                                <div><strong>Kết thúc:</strong> {{ formatDate(record.end_date) }}</div>
                            </div>
                        </template>
                        <template v-if="column.key === 'status'">
                            <a-tag :color="record.status ? 'green' : 'red'">
                                {{ record.status ? 'Hoạt động' : 'Ngừng hoạt động' }}
                            </a-tag>
                        </template>
                        <template v-if="column.key === 'action'">
                            <router-link :to="{ name: 'admin-promotions-update', params: { id: record.id } }">
                                <a-button type="primary" class="me-2" size="small">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </a-button>
                            </router-link>
                            <a-button type="primary" danger @click="handleDelete(record)" size="small">
                                <i class="fa-solid fa-trash"></i>
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-card>
</template>

<script setup>
import { ref } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { Modal, message } from 'ant-design-vue';

const store = useMenuAdmin();
store.onSelectedKeys(['admin-promotions']);

const columns = [
    {
        title: '#',
        key: 'index',
        width: 50,
        fixed: 'left',
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'url_image',
        key: 'url_image',
        width: 100,
    },
    {
        title: 'Tên khuyến mãi',
        dataIndex: 'name',
        key: 'name',
        width: 200,
    },
    {
        title: 'Loại giảm giá',
        dataIndex: 'discount_type',
        key: 'discount_type',
        width: 150,
    },
    {
        title: 'Giá trị giảm',
        dataIndex: 'discount_value',
        key: 'discount_value',
        width: 120,
    },
    {
        title: 'Đơn tối thiểu',
        dataIndex: 'min_order_value',
        key: 'min_order_value',
        width: 130,
        customRender: ({ text }) => formatCurrency(text),
    },
    {
        title: 'Sử dụng',
        key: 'usage',
        width: 100,
    },
    {
        title: 'Thời gian',
        key: 'date_range',
        width: 180,
    },
    {
        title: 'Tình trạng',
        dataIndex: 'status',
        key: 'status',
        width: 120,
    },
    {
        title: 'Công cụ',
        key: 'action',
        fixed: 'right',
        width: 120,
    },
];

const promotions = ref([]);

const getPromotions = () => {
    promotions.value = [
        {
            id: 1,
            name: 'Giảm 20% toàn bộ đơn hàng',
            url_image: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=20%',
            description: 'Áp dụng cho tất cả sản phẩm',
            discount_type: 'percentage',
            discount_value: 20.00,
            min_order_value: 500000.00,
            usage_limit: 100,
            used_count: 25,
            start_date: '2025-11-01T00:00:00',
            end_date: '2025-11-30T23:59:59',
            status: true,
            created_at: '2025-10-25T10:00:00',
            updated_at: '2025-11-05T15:30:00',
        },
        {
            id: 2,
            name: 'Giảm 100.000đ cho đơn hàng mới',
            url_image: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=100K',
            description: 'Dành cho khách hàng mới',
            discount_type: 'fixed_amount',
            discount_value: 100000.00,
            min_order_value: 300000.00,
            usage_limit: 50,
            used_count: 15,
            start_date: '2025-11-01T00:00:00',
            end_date: '2025-12-31T23:59:59',
            status: true,
            created_at: '2025-10-20T09:00:00',
            updated_at: '2025-11-04T12:20:00',
        },
        {
            id: 3,
            name: 'Miễn phí vận chuyển',
            url_image: 'https://via.placeholder.com/150/95E1D3/FFFFFF?text=FREE+SHIP',
            description: 'Áp dụng cho đơn hàng từ 200k',
            discount_type: 'free_shipping',
            discount_value: 0.00,
            min_order_value: 200000.00,
            usage_limit: null,
            used_count: 45,
            start_date: '2025-11-01T00:00:00',
            end_date: '2025-11-15T23:59:59',
            status: true,
            created_at: '2025-10-15T08:00:00',
            updated_at: '2025-11-03T10:15:00',
        },
        {
            id: 4,
            name: 'Flash Sale - Giảm 50%',
            url_image: 'https://via.placeholder.com/150/F38181/FFFFFF?text=50%',
            description: 'Flash sale cuối tuần',
            discount_type: 'percentage',
            discount_value: 50.00,
            min_order_value: 1000000.00,
            usage_limit: 20,
            used_count: 20,
            start_date: '2025-10-20T00:00:00',
            end_date: '2025-10-31T23:59:59',
            status: false,
            created_at: '2025-10-10T07:00:00',
            updated_at: '2025-11-01T08:00:00',
        },
    ];
};

const getDiscountTypeColor = (type) => {
    const colors = {
        percentage: 'blue',
        fixed_amount: 'green',
        free_shipping: 'orange',
    };
    return colors[type] || 'default';
};

const getDiscountTypeText = (type) => {
    const texts = {
        percentage: 'Phần trăm',
        fixed_amount: 'Số tiền cố định',
        free_shipping: 'Miễn phí ship',
    };
    return texts[type] || type;
};

const formatCurrency = (value) => {
    if (!value) return '0đ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const handleDelete = (record) => {
    Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa khuyến mãi "${record.name}"?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk() {
            // Xử lý xóa ở đây
            message.success('Xóa khuyến mãi thành công!');
        },
    });
};

getPromotions();
</script>
<script setup>
import { ref } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { Modal, message } from 'ant-design-vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-promotions']);

const columns = [
    {
        title: 'Hình ảnh',
        dataIndex: 'url_image',
        key: 'url_image',
        fixed: 'left',
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
        width: 200,
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
    axios.get(`${API_URL}/admin/promotions`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            console.log(response);
            promotions.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};
getPromotions();

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

const handleDelete = (id) => {
    Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa khuyến mãi này?',
        okText: 'Xóa',
        cancelText: 'Hủy',
        onOk() {
            axios.delete(`${API_URL}/admin/promotions/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    console.log(response);
                    getPromotions()
                    message.success('Xoá khuyến mãi thành công!')
                })
                .catch((error) => {
                    console.log(error);
                })
        },
    });
};
</script>
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
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'url_image'">
                            <a-image :src="`${STORAGE_URL}/${record.url_image}`" :alt="record.name"
                                style="max-width: 100px;" />
                        </template>
                        <template v-if="column.key === 'discount_type'">
                            <a-tag :color="getDiscountTypeColor(record.discount_type)">
                                {{ getDiscountTypeText(record.discount_type) }}
                            </a-tag>
                        </template>
                        <template v-if="column.key === 'discount_value'">
                            <span v-if="record.discount_type === 'percentage'">
                                {{ Math.floor(record.discount_value) }}%
                            </span>
                            <span v-else-if="record.discount_type === 'fixed_amount'">
                                {{ formatCurrency(record.discount_value) }}
                            </span>
                            <span v-else>
                                Miễn phí ship
                            </span>
                        </template>
                        <template v-if="column.key === 'min_order_value'">
                            <span>
                                {{ formatCurrency(record.min_order_value) || '0đ' }}
                            </span>
                        </template>
                        <template v-if="column.key === 'usage'">
                            <span>{{ record.used_count }} / {{ record.usage_limit || '∞' }}</span>
                        </template>
                        <template v-if="column.key === 'date_range'">
                            <div style="font-size: 14px;">
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
                            <a-button type="primary" danger @click="handleDelete(record.id)" size="small">
                                <i class="fa-solid fa-trash"></i>
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-card>
</template>
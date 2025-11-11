<script setup>
import { ref } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-sizes']);

const columns =
    [
        {
            title: '#',
            key: 'index',
            width: 50,
        },
        {
            title: 'Tên kích cỡ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Dài áo (cm)',
            dataIndex: 'length',
            key: 'length',
        },
        {
            title: 'Ngang áo (cm)',
            dataIndex: 'width',
            key: 'width',
        },
        {
            title: 'Dài tay (cm)',
            dataIndex: 'sleeve',
            key: 'sleeve',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Công cụ',
            key: 'action',
            fixed: 'right',
            width: 150,
        },
    ]

const sizes = ref([]);
const getSizes = () => {
    axios.get(`${API_URL}/admin/sizes`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            // console.log(response);
            sizes.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
getSizes()

const handleDelete = (id) => {
    Modal.confirm({
        title: 'Xác nhận xoá kích cỡ',
        content: 'Bạn có chắc chắn muốn xóa kích cỡ này?',
        okText: 'Xoá',
        cancelText: 'Huỷ',
        onOk: () => {
            axios.delete(`${API_URL}/admin/sizes/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    console.log(response);
                    getSizes()
                    message.success('Xoá kích cỡ thành công!')
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        onCancel: () => { },
    });
}
</script>
<template>
    <a-card title="Kích cỡ" style="width: 100%">
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end">
                <router-link :to="{ name: 'admin-sizes-create' }">
                    <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <a-table :dataSource="sizes" :columns="columns" :scroll="{ x: 800 }">
                    <template #bodyCell="{ column, index, record }">
                        <template v-if="column.key === 'index'">
                            <span>{{ index + 1 }}</span>
                        </template>

                        <template v-if="column.key === 'status'">
                            <span v-if="record.status == 1">
                                <a-tag :color="'green'">
                                    {{ 'Hoạt động'.toUpperCase() }}
                                </a-tag>
                            </span>
                            <span v-else-if="record.status == 0">
                                <a-tag :color="'red'">
                                    {{ 'Tạm khoá'.toUpperCase() }}
                                </a-tag>
                            </span>
                        </template>

                        <template v-if="column.key === 'action'">
                            <router-link :to="{ name: 'admin-sizes-update', params: { id: record.id } }">
                                <a-button type="primary" class="me-2">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </a-button>
                            </router-link>
                            <a-button type="primary" danger @click="handleDelete(record.id)" class="me-2">
                                <i class="fa-solid fa-trash"></i>
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-card>
</template>
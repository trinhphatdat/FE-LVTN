<script setup>
import { ref } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-colors']);


const columns = [
    {
        title: '#',
        key: 'index',
        width: 50,
    },
    {
        title: 'Tên màu',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mã màu',
        dataIndex: 'hex_code',
        key: 'hex_code',
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
    },
]

const colors = ref([]);
const getColors = () => {
    axios.get(`${API_URL}/admin/colors`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            // console.log(response);
            colors.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
getColors()

const handleDelete = (id) => {
    Modal.confirm({
        title: 'Xác nhận xoá màu sắc',
        content: 'Bạn có chắc chắn muốn xóa màu sắc này?',
        okText: 'Xoá',
        cancelText: 'Huỷ',
        onOk: () => {
            axios.delete(`${API_URL}/admin/colors/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    console.log(response);
                    getColors()
                    message.success('Xoá màu sắc thành công!')
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
    <a-card title="Màu sắc" style="width: 100%">
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end">
                <router-link :to="{ name: 'admin-colors-create' }">
                    <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <a-table :dataSource="colors" :columns="columns" :scroll="{ x: 600 }">
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
                            <router-link :to="{ name: 'admin-colors-update', params: { id: record.id } }">
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
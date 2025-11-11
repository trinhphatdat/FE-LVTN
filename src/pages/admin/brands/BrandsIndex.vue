<script setup>
import { ref } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-brands']);


const columns = [
    {
        title: 'Logo',
        dataIndex: 'logo_url',
        key: 'logo_url',
    },
    {
        title: 'Tên thương hiệu',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
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

const brands = ref([]);
const getBrands = () => {
    axios.get(`${API_URL}/admin/brands`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            console.log(response);
            brands.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
getBrands()

const handleDelete = (id) => {
    Modal.confirm({
        title: 'Xác nhận xoá thương hiệu',
        content: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
        okText: 'Xoá',
        cancelText: 'Huỷ',
        onOk: () => {
            axios.delete(`${API_URL}/admin/brands/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    console.log(response);
                    getBrands()
                    message.success('Xoá thương hiệu thành công!')
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
    <a-card title="Thương hiệu" style="width: 100%">
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end">
                <router-link :to="{ name: 'admin-brands-create' }">
                    <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <a-table :dataSource="brands" :columns="columns" :scroll="{ x: 600 }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'logo_url'">
                            <a-image v-if="record.logo_url" :src="`${STORAGE_URL}/${record.logo_url}`"
                                alt="Thumbnail sản phẩm" style="max-width: 100px;" />
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
                            <router-link :to="{ name: 'admin-brands-update', params: { id: record.id } }">
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
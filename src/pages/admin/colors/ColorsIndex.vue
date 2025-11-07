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
                            <a-tag :color="record.status === 'Hoạt động' ? 'green' : 'red'">
                                {{ record.status }}
                            </a-tag>
                        </template>
                        <template v-if="column.key === 'action'">
                            <router-link :to="{ name: 'admin-colors-update', params: { id: record.id } }">
                                <a-button type="primary" class="me-2">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </a-button>
                            </router-link>
                            <a-button type="primary" danger @click="" class="me-2">
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
// import axios from 'axios';
// import { Modal } from 'ant-design-vue';
// import { message } from 'ant-design-vue';

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
    colors.value = [
        { id: 1, name: 'Đỏ', hex_code: '#FF0000', status: 'Hoạt động' },
        { id: 2, name: 'Xanh lá', hex_code: '#00FF00', status: 'Hoạt động' },
        { id: 3, name: 'Xanh dương', hex_code: '#0000FF', status: 'Ngừng hoạt động' },
        { id: 4, name: 'Vàng', hex_code: '#FFFF00', status: 'Hoạt động' },
    ]
}
getColors()
</script>
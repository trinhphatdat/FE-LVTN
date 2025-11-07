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
                            <a-tag :color="record.status === 'Hoạt động' ? 'green' : 'red'">
                                {{ record.status }}
                            </a-tag>
                        </template>
                        <template v-if="column.key === 'action'">
                            <router-link :to="{ name: 'admin-sizes-update', params: { id: record.id } }">
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
import axios from 'axios';
// import { Modal } from 'ant-design-vue';
// import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
// import { message } from 'ant-design-vue';

const store = useMenuAdmin();
store.onSelectedKeys(['admin-sizes']);

const columns = [
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
        title: 'Dài áo',
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: 'Ngang áo',
        dataIndex: 'width',
        key: 'width',
    },
    {
        title: 'Dài tay',
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
    sizes.value = [
        { id: 1, name: 'S', length: 65, width: 45, sleeve: 20, status: 'Hoạt động' },
        { id: 2, name: 'M', length: 67, width: 47, sleeve: 21, status: 'Hoạt động' },
        { id: 3, name: 'L', length: 69, width: 49, sleeve: 22, status: 'Ngừng hoạt động' },
        { id: 4, name: 'XL', length: 71, width: 51, sleeve: 23, status: 'Hoạt động' },
    ]
}
getSizes()
</script>
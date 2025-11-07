<template>
    <a-card title="Vai trò" style="width: 100%">
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end">
                <router-link :to="{ name: 'admin-roles-create' }">
                    <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <a-table :dataSource="roles" :columns="columns">
                    <template #bodyCell="{ column, index, record }">
                        <template v-if="column.key === 'index'">
                            <span>{{ index + 1 }}</span>
                        </template>
                        <template v-if="column.key === 'action'">
                            <router-link :to="{ name: 'admin-roles-update', params: { id: record.id } }">
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
store.onSelectedKeys(['admin-roles']);

const columns = [
    {
        title: '#',
        key: 'index',
        width: 50,
    },
    {
        title: 'Vai trò',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Công cụ',
        key: 'action',
        fixed: 'right',
    },
]

const roles = ref([]);
const getRoles = () => {
    roles.value = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Nhân viên' },
        { id: 3, name: 'Khách hàng' },
    ]
}
getRoles()
</script>
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
                        <!-- Begin: Status -->
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
                        <!-- End: Status -->
                        <template v-if="column.key === 'action'">
                            <a-button type="primary" class="me-2" @click="handleUpdateUser(record.id)">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </a-button>
                            <a-button type="primary" danger @click="handleDeleteUser(record.id)" class="me-2">
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
import router from '@/router';
import { Modal } from 'ant-design-vue';
// import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
// import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;

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
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Công cụ',
        key: 'action',
        fixed: 'right',
    },
]

const errors = ref([]);

const roles = ref([]);
const getRoles = () => {
    axios.get(`${API_URL}/admin/roles`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            roles.value = response.data
        })
        .catch((error) => {
            errors.value = error.response.data.errors;
            console.error('Lỗi khi lấy danh sách vai trò:', error);
        });
}
getRoles()

const handleDeleteUser = (id) => {
    Modal.confirm({
        title: 'Xác nhận xoá',
        content: 'Bạn có chắc chắn muốn xoá vai trò này không?',
        okText: 'Xoá',
        okType: 'danger',
        cancelText: 'Huỷ',
        // icon: h(ExclamationCircleOutlined),
        onOk() {
            axios.delete(`${API_URL}/admin/roles/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    // message.success('Xoá vai trò thành công');
                    getRoles();
                })
                .catch((error) => {
                    errors.value = error.response.data.errors;
                    console.error('Lỗi khi xoá vai trò:', error);
                });
        },
        onCancel() {
            console.log('Hủy xoá vai trò');
        },
    });
}

const status = ref([]);

const handleUpdateUser = (id) => {
    router.push({ name: 'admin-roles-update', params: { id } });
}
</script>
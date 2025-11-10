<script setup>

import { ref } from 'vue';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import router from '@/router';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';

const isLoading = ref(true);

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-users']);

// Begin: Cấu hình cột cho bảng người dùng
const columns = [
    {
        title: '#',
        key: 'index',
        width: 50,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Họ tên',
        dataIndex: 'fullname',
        key: 'fullname',
    },
    {
        title: 'Vai trò',
        dataIndex: 'role_id',
        key: 'role',
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
// End: Cấu hình cột cho bảng người dùng

//Begin: Danh sách người dùng
const users = ref([])
const getUsers = () => {
    axios.get(`${API_URL}/admin/users`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            users.value = response.data
            // console.log(response);
        })
        .catch((error) => {
            message.error('Lỗi khi lấy danh sách người dùng!')
            console.log(error)
        })
        .finally(() => {
            isLoading.value = false
        });
}
getUsers()
// End: Danh sách người dùng

//Begin: Xoá người dùng
const handleDeleteUser = (id) => {
    Modal.confirm({
        title: 'Xác nhận xoá người dùng',
        content: 'Bạn có chắc chắn muốn xóa người dùng này?',
        okText: 'Xoá',
        cancelText: 'Huỷ',
        onOk: () => {
            axios.delete(`${API_URL}/admin/users/${id}`, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        getUsers()
                        message.success('Xoá người dùng thành công!')
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        onCancel: () => { },
    });
}
// End: Xoá người dùng

const handleUpdateUser = (id) => {
    // Chuyển hướng đến trang cập nhật người 
    router.push({ name: 'admin-users-update', params: { id } });
}

</script>

<template>
    <TheLoadingSpinner v-if="isLoading" />
    <a-card title="Tài khoản" style="width: 100%">
        <!-- Button create -->
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-end">
                <router-link :to="{ name: 'admin-users-create' }">
                    <a-button type="primary"><i class="fa-solid fa-plus"></i></a-button>
                </router-link>
            </div>
        </div>
        <!--  -->
        <div class="row">
            <div class="col-12">
                <a-table :dataSource="users" :columns="columns" :scroll="{ x: 576 }">
                    <template #bodyCell="{ column, index, record }">
                        <!-- Begin: # -->
                        <template v-if="column.key === 'index'">
                            <span>{{ index + 1 }}</span>
                        </template>
                        <!-- End: # -->

                        <!-- Begin: Role -->
                        <template v-if="column.key === 'role'">
                            <span v-if="record.role_id == 1">
                                <a-tag :color="'darkgray'">
                                    {{ 'Quản trị viên'.toUpperCase() }}
                                </a-tag>
                            </span>
                            <span v-else-if="record.role_id == 2">
                                <a-tag :color="'orange'">
                                    {{ 'Nhân viên'.toUpperCase() }}
                                </a-tag>
                            </span>
                            <span v-else-if="record.role_id == 3">
                                <a-tag :color="'blue'">
                                    {{ 'Khách hàng'.toUpperCase() }}
                                </a-tag>
                            </span>
                        </template>
                        <!-- End: Role -->

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

                        <!-- Begin: Action -->
                        <template v-if="column.key === 'action'">
                            <a-button type="primary" class="mb-2 me-sm-2" @click="handleUpdateUser(record.id)">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </a-button>
                            <a-button type="primary" danger @click="handleDeleteUser(record.id)">
                                <i class="fa-solid fa-trash"></i>
                            </a-button>
                        </template>
                        <!-- End: Action -->
                    </template>
                </a-table>
            </div>
        </div>
    </a-card>
</template>

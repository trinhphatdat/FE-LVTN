<template>
    <div class="container-fluid">
        <div class="row text-white" style="background-color: #1890ff; padding: 1rem;">
            <div class="col-3 d-flex align-items-center justify-content-start">
                <button class="d-flex d-sm-none btn btn-primary" @click="showDrawerLeft">
                    <span><i class="fa-solid fa-align-justify"></i></span>
                </button>
                <span class="d-none d-sm-flex fw-bold fs-6">Quản Trị Viên</span>
            </div>
            <div class="col-5"></div>
            <div class="col-4 d-flex align-items-center justify-content-end">
                <a-dropdown>
                    <button class="ant-dropdown-link btn btn-primary">
                        <span class="me-1">{{ user.fullname || 'Admin' }}</span>
                        <span><i class="fa-solid fa-caret-down"></i></span>
                    </button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <router-link :to="{ name: '' }">
                                    Thông tin tài khoản
                                </router-link>
                            </a-menu-item>
                            <a-menu-item>
                                <span @click.prevent="logout">Đăng xuất</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <!-- <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
                <span @click="showDrawerRight"><i class="fa-solid fa-user"></i></span>
            </div> -->
        </div>
    </div>
    <a-drawer v-model:open="open_left" root-class-name="root-class-name" :root-style="{ color: 'blue' }"
        title="Danh Mục" placement="left">
        <TheMenu />
    </a-drawer>
</template>

<script setup>
import { ref } from 'vue';
import TheMenu from './TheMenu.vue';
import { useUserStore } from '@/stores/use-user-store.js'
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { isLoggedIn, user } = storeToRefs(userStore)


const open_left = ref(false);
const showDrawerLeft = () => {
    open_left.value = true;
};

</script>
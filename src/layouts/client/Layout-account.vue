<script setup>
import TheHeader from "@/components/client/TheHeader.vue"
import TheFooter from "@/components/client/TheFooter.vue"
import TheBreadcumbs from '@/components/TheBreadcumbs.vue'
import TheContact from '@/components/client/TheContact.vue';
import { useRoute } from 'vue-router'
import { computed } from "vue"

const route = useRoute()

//computed tự động cập nhật title dựa trên route hiện tại
const title = computed(() => {
    if (route.name === 'account-login') return 'Đăng nhập'
    if (route.name === 'account-register') return 'Đăng kí'
    if (route.name === 'account-profile') return 'Thông tin tài khoản'
    if (route.name === 'account-profile-edit') return 'Chỉnh sửa thông tin cá nhân'
    if (route.name === 'account-reset-password') return 'Đặt lại mật khẩu'
    if (route.name === 'account-forgot-password') return 'Quên mật khẩu'
    return ''
})
</script>

<template>
    <TheHeader />
    <TheBreadcumbs />
    <div class="container mt-5 mb-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="account-card">
                    <h1 class="text-center mb-3">{{ title }}</h1>
                    <router-view />
                </div>
            </div>
        </div>
    </div>
    <TheContact />
    <TheFooter />
</template>

<style scoped>
.account-card {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .account-card {
        padding: 1.5rem;
    }
}
</style>
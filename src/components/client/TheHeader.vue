<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/use-user-store.js'
import { message } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'

const isMenuOpen = ref(false)
const isSubnavOpen = ref(false) // Sản phẩm

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}
const closeMenu = () => {
    isMenuOpen.value = false
}

//Toggle sản phẩm
const toggleSubnav = () => {
    isSubnavOpen.value = !isSubnavOpen.value
}

// Begin: login
const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn, user, cart_items } = storeToRefs(userStore)

const login = () => {
    router.push({ name: 'account-login' })
}
const logout = () => {
    userStore.logout()
    router.push({ name: 'home' })
    message.success('Đăng xuất thành công!')
}

onMounted(() => {
    if (isLoggedIn.value) {
        userStore.fetchProfile()
    }
    // Sau khi đã đăng nhập và có token, gọi fetchProfile để lấy thông tin người dùng
    const token = localStorage.getItem('token')
    if (token && !isLoggedIn.value) {
        userStore.fetchProfile()
    }
})
// End: login

// Begin: Scroll header
const showHeader = ref(true)
let lastScrollY = window.scrollY

const handleScroll = () => {
    const currentScrollY = window.scrollY
    if (currentScrollY <= 0) {
        showHeader.value = true
    } else if (currentScrollY > lastScrollY) {
        showHeader.value = false
    } else {
        showHeader.value = true
    }
    lastScrollY = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
// End: Scroll header

</script>

<template>

    <div id="header" :class="{ 'header--hidden': !showHeader }">
        <div class="logo-header">
            <router-link :to="{ name: 'home' }">
                <img src="https://marketplace.canva.com/MqU2g/MAFLfcMqU2g/1/tl/canva-smiley-sticker-MAFLfcMqU2g.png"
                    alt="logo">
            </router-link>
        </div>
        <!-- Nav PC -->
        <ul class="nav-main">
            <li>
                <router-link :to="{ name: 'home' }">
                    Trang chủ
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'collections-all-teeshirt' }">
                    Sản phẩm
                </router-link>
                <ul class="subnav-product">
                    <li>
                        <router-link :to="{ name: 'collections-male-teeshirt' }">
                            Áo thun nam
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'collections-female-teeshirt' }">Áo thun nữ</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'collections-all-teeshirt' }">
                            Tất cả sản phẩm
                        </router-link>
                    </li>
                </ul>
            </li>
            <li>
                <router-link :to="{ name: 'about' }">
                    <span>Giới thiệu</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'contact' }">
                    <span>Liên hệ</span>
                </router-link>
            </li>
            <li>
                <a href="#">Tuyển dụng</a>
            </li>
        </ul>
        <!-- Nav Right -->
        <div class="nav-right">
            <div class="btn-cart">
                <router-link :to="{ name: 'cart' }">
                    <i class=" fa-solid fa-cart-shopping"></i>
                    <span class="count">{{ cart_items.count || 0 }}</span>
                </router-link>
            </div>
            <div class="btn-search">
                <router-link :to="{ name: 'search' }">
                    <i class=" fa-solid fa-magnifying-glass"></i>
                </router-link>
            </div>

            <div class="btn-user">
                <button v-if="!isLoggedIn" @click="login" class="btn btn-warning">
                    Đăng nhập
                </button>

                <!-- dropdown adv -->
                <div v-else>
                    <a-dropdown>
                        <button class="ant-dropdown-link btn btn-warning">
                            <span>{{ user.fullname }}</span>
                            <DownOutlined />
                        </button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <router-link :to="{ name: 'account-profile' }">
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
            </div>
            <div class="btn-menu-mobile" @click="toggleMenu">
                <i class="fa-solid fa-bars"></i>
            </div>
        </div>
    </div>
    <!-- Overlay Mobile -->
    <div class="nav__overlay" :class="{ open: isMenuOpen }" @click="closeMenu">
        <!-- Nav Mobile -->
        <nav class="nav-mobile" @click.stop>
            <ul class="nav-mobile-list">
                <li>
                    <router-link :to="{ name: 'home' }">
                        Trang chủ
                    </router-link>
                </li>
                <li class="has-subnav-mobile">
                    <router-link :to="{ name: 'collections-all-teeshirt' }">
                        Sản phẩm
                    </router-link>
                    <div class="toggle-subnav" :class="{ open: isSubnavOpen }" @click.stop="toggleSubnav">
                        <i class="fa-solid fa-plus plus-icon" v-if="!isSubnavOpen"></i>
                        <i class="fa-solid fa-minus minus-icon" v-else></i>
                    </div>
                    <ul class="subnav-mobile-1" :class="{ open: isSubnavOpen }">
                        <li class="has-subnav-mobile">
                            <router-link :to="{ name: 'collections-male-teeshirt' }">
                                Áo thun nam
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'collections-female-teeshirt' }">
                                Áo thun nữ
                            </router-link>
                        </li>
                        <li class="has-subnav-mobile">
                            <router-link :to="{ name: 'collections-all-teeshirt' }">
                                Tất cả sản phẩm
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>
                    <router-link :to="{ name: 'about' }">
                        Giới thiệu
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'contact' }">
                        Liên hệ
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: '' }">
                        Tuyển dụng
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>
.demo-dropdown-wrap :deep(.ant-dropdown-button) {
    margin-right: 8px;
    margin-bottom: 8px;
}

#header {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
    will-change: transform, opacity;
}

.header--hidden {
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
}
</style>
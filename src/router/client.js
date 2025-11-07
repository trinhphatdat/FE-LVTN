const client = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/pages/client/PageHome.vue'),
        meta: { title: 'Trang chủ' }
    },
    // /account/login + /account/register + /account/profile
    {
        path: '/account',
        name: 'account',
        component: () => import('@/layouts/client/Layout-account.vue'),
        children: [
            {
                path: 'login',
                name: 'account-login',
                component: () => import('@/pages/client/account/PageLogin.vue'),
                meta: { title: 'Đăng nhập' }
            },
            {
                path: 'register',
                name: 'account-register',
                component: () => import('@/pages/client/account/PageRegister.vue'),
                meta: { title: 'Đăng kí' }
            },
            {
                path: 'profile',
                name: 'account-profile',
                component: () => import('@/pages/client/account/PageProfileUser.vue'),
                meta: { title: 'Thông tin tài khoản' }
            },
            {
                path: 'forgot-password',
                name: 'account-forgot-password',
                component: () => import('@/pages/client/account/PageForgotPassword.vue'),
                meta: { title: 'Quên mật khẩu' }
            },
            {
                path: 'reset-password',
                name: 'account-reset-password',
                component: () => import('@/pages/client/account/PageResetPassword.vue'),
                meta: { title: 'Đặt lại mật khẩu' }
            },
        ]
    },
    // search products
    {
        path: '/search',
        name: 'search',
        component: () => import('@/pages/client/PageSearchProducts.vue'),
        meta: { title: 'Tìm kiếm' }
    },
    // chi tiết sản phẩm
    {
        path: '/products/:id',
        name: 'product-detail',
        component: () => import('@/pages/client/products/ProductDetail.vue'),
        meta: { title: '' },
    },
    //collections
    {
        path: '/collections',
        component: () => import('@/layouts/client/Layout-products.vue'),
        children: [
            //
            {
                path: 'all-teeshirt',
                name: 'collections-all-teeshirt',
                component: () => import('@/pages/client/collections/All_TeeShirt.vue'),
                meta: { title: '' }
            },
            //
            {
                path: 'male-teeshirt',
                name: 'collections-male-teeshirt',
                component: () => import('@/pages/client/collections/Male_TeeShirt.vue'),
                meta: { title: '' }
            },
            //
            {
                path: 'female-teeshirt',
                name: 'collections-female-teeshirt',
                component: () => import('@/pages/client/collections/Female_TeeShirt.vue'),
                meta: { title: '' }
            },
        ]
    },
    //about
    {
        path: '/about',
        name: 'about',
        component: () => import('@/pages/client/PageAbout.vue'),
        meta: { title: 'Giới thiệu' }
    },
    //contact
    {
        path: '/contact',
        name: 'contact',
        component: () => import('@/pages/client/PageContact.vue'),
        meta: { title: 'Liên hệ' }
    },
    //cart
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/pages/client/PageCart.vue'),
        meta: { title: 'Giỏ hàng' }
    }
];
export default client;
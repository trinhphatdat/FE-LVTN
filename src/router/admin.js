const admin = [
    {
        path: '/admin',
        component: () => import('@/layouts/admin/Layout-admin.vue'),
        children: [
            //Dashboard
            {
                path: 'dashboard',
                name: 'admin-dashboard',
                component: () => import('@/pages/admin/dashboard/DashboardIndex.vue'),
            },
            //Quản lí sản phẩm
            {
                path: 'products',
                name: 'admin-products',
                component: () => import('@/pages/admin/products/ProductsIndex.vue'),
            },
            {
                path: 'products/create',
                name: 'admin-products-create',
                component: () => import('@/pages/admin/products/ProductCreate.vue'),
            },
            {
                path: 'products/:id/update',
                name: 'admin-products-update',
                component: () => import('@/pages/admin/products/ProductUpdate.vue'),
            },
            //Quản lí user
            {
                path: 'users',
                name: 'admin-users',
                component: () => import('@/pages/admin/users/UsersIndex.vue'),
            },
            {
                path: 'users/create',
                name: 'admin-users-create',
                component: () => import('@/pages/admin/users/UserCreate.vue'),
            },
            {
                path: 'users/:id/update',
                name: 'admin-users-update',
                component: () => import('@/pages/admin/users/UserUpdate.vue'),
            },
            //Quản lí roles
            {
                path: 'roles',
                name: 'admin-roles',
                component: () => import('@/pages/admin/roles/RolesIndex.vue'),
            },
            {
                path: 'roles/create',
                name: 'admin-roles-create',
                component: () => import('@/pages/admin/roles/RoleCreate.vue'),
            },
            {
                path: 'roles/:id/update',
                name: 'admin-roles-update',
                component: () => import('@/pages/admin/roles/RoleUpdate.vue'),
            },
            //Quản lí sizes
            {
                path: 'sizes',
                name: 'admin-sizes',
                component: () => import('@/pages/admin/sizes/SizesIndex.vue'),
            },
            {
                path: 'sizes/create',
                name: 'admin-sizes-create',
                component: () => import('@/pages/admin/sizes/SizeCreate.vue'),
            },
            {
                path: 'sizes/:id/update',
                name: 'admin-sizes-update',
                component: () => import('@/pages/admin/sizes/SizeUpdate.vue'),
            },
            //Quản lí màu sắc
            {
                path: 'colors',
                name: 'admin-colors',
                component: () => import('@/pages/admin/colors/ColorsIndex.vue'),
            },
            {
                path: 'colors/create',
                name: 'admin-colors-create',
                component: () => import('@/pages/admin/colors/ColorCreate.vue'),
            },
            {
                path: 'colors/:id/update',
                name: 'admin-colors-update',
                component: () => import('@/pages/admin/colors/ColorUpdate.vue'),
            },
            //Quản lí đơn hàng
            {
                path: 'orders',
                name: 'admin-orders',
                component: () => import('@/pages/admin/orders/OrdersIndex.vue'),
            },
            //Quản lí khuyến mãi
            {
                path: 'promotions',
                name: 'admin-promotions',
                component: () => import('@/pages/admin/promotions/PromotionsIndex.vue'),
            },
            {
                path: 'promotions/create',
                name: 'admin-promotions-create',
                component: () => import('@/pages/admin/promotions/PromotionCreate.vue'),
            },
            {
                path: 'promotions/:id/update',
                name: 'admin-promotions-update',
                component: () => import('@/pages/admin/promotions/PromotionUpdate.vue'),
            },
        ]
    }
]
export default admin
// 对外暴露配置路由（常量路由）
// export const constantRoutes = [
//     {
//         // 登陆
//         path: '/login',
//         component: () => import('@/view/login/index.vue'),
//         name: 'login',
//         // 路由元信息
//         meta: {
//             title: '登陆', // 菜单标题
//             hidden: true,
//             // 路由的标题在菜单中是否隐藏
//             icon: 'Search'
//         }
//     },
//     {
//         // 登录成功后展示数据的路由
//         path: '/',
//         component: () => import('@/layout/index.vue'),
//         name: 'layout',
//         meta: { hidden: false, icon: 'House' },
//         redirect: '/home',
//         children: [
//             {
//                 path: '/home',
//                 component: () => import('@/view/home/index.vue'),
//                 meta: {
//                     title: '首页',
//                     hidden: false,
//                     icon: 'House'
//                 }
//             }
//         ]
//     },
//     // 数据大屏
//     {
//         path: '/screen',
//         name: 'Screen',
//         component: () => import('@/view/screen/index.vue'),
//         meta: {
//             title: '数据大屏',
//             hidden: false,
//             icon: 'Platform'
//         }
//     },
//     // 权限管理
//     {
//         name: 'Acl',
//         path: '/acl',
//         component: () => import('@/layout/index.vue'),
//         redirect: '/acl/user',
//         meta: {
//             title: '权限管理',
//             icon: 'Monitor',
//             hidden: false,
//         },
//         children: [
//             {
//                 name: 'User',
//                 path: '/acl/user',
//                 component: () => import('@/view/acl/user/index.vue'),
//                 meta: {
//                     title: '用户管理',
//                     hidden: false,
//                     icon: 'SwitchFilled'
//                 }
//             },
//             {
//                 name: 'Role',
//                 path: '/acl/role',
//                 component: () => import('@/view/acl/role/index.vue'),
//                 meta: {
//                     title: '角色管理',
//                     hidden: false,
//                     icon: 'Avatar'
//                 }
//             },
//             {
//                 name: 'Permission',
//                 path: '/acl/permission',
//                 component: () => import('@/view/acl/permission/index.vue'),
//                 meta: {
//                     title: '菜单管理',
//                     hidden: false,
//                     icon: 'CreditCard'
//                 }
//             }
//         ]
//     },
//     // 产品管理
//     {
//         path: '/product',
//         component: () => import('@/layout/index.vue'),
//         name: 'Product',
//         redirect: '/product/trademark',
//         meta: {
//             title: '商品管理',
//             icon: 'Goods',
//             hidden: false
//         },
//         children: [
//             {
//                 name: 'Trademark',
//                 path: '/product/trademark',
//                 component: () => import('@/view/product/trademark/index.vue'),
//                 meta: {
//                     title: '品牌管理',
//                     hidden: false,
//                     icon: 'Setting'
//                 }
//             },
//             {
//                 name: 'Attr',
//                 path: '/product/attr',
//                 component: () => import('@/view/product/attr/index.vue'),
//                 meta: {
//                     title: '属性管理',
//                     hidden: false,
//                     icon: 'Refrigerator'
//                 }
//             },
//             {
//                 name: 'Spu',
//                 path: '/product/spu',
//                 component: () => import('@/view/product/spu/index.vue'),
//                 meta: {
//                     title: 'spu管理',
//                     hidden: false,
//                     icon: 'Coin'
//                 }
//             },
//             {
//                 name: 'Sku',
//                 path: '/product/sku',
//                 component: () => import('@/view/product/sku/index.vue'),
//                 meta: {
//                     title: 'sku管理',
//                     hidden: false,
//                     icon: 'Guide'
//                 }
//             },
//         ]

//     },
//     // 404
//     {
//         // 404
//         path: '/404',
//         component: () => import('@/view/404/index.vue'),
//         name: '404',
//         meta: {
//             title: '404',
//             hidden: true,
//             icon: 'CloseBold'
//         }
//     },
//     // 任意路由，以上都没有匹配到执行
//     {
//         path: '/:pathMatch(.*)*',
//         redirect: '/404',
//         name: 'Any',
//         meta: {
//             title: '任意',
//             hidden: true,
//             icon: 'MoreFilled'
//         }
//     }
// ]


//对外暴露配置路由(常量路由)
export const constantRoute = [
    {
        //登录路由
        path: '/login',
        component: () => import('@/view/login/index.vue'),
        name: 'login', //命名路由
        meta: {
            title: '登录', //菜单标题
            hidden: true, //路由的标题在菜单中是否隐藏
        },
    },
    {
        //登录成功以后展示数据的路由
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        meta: {
            hidden: false,
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/view/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'HomeFilled',
                },
            },
        ],
    },
    {
        path: '/404',
        component: () => import('@/view/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: true,
        },
    },
    {
        path: '/screen',
        component: () => import('@/view/screen/index.vue'),
        name: 'Screen',
        meta: {
            hidden: false,
            title: '数据大屏',
            icon: 'Platform',
        },
    },
]

//异步路由
export const asnycRoute = [
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        meta: {
            hidden: false,
            title: '权限管理',
            icon: 'Lock',
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/view/acl/user/index.vue'),
                name: 'User',
                meta: {
                    hidden: false,
                    title: '用户管理',
                    icon: 'User',
                },
            },
            {
                path: '/acl/role',
                component: () => import('@/view/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    hidden: false,
                    title: '角色管理',
                    icon: 'UserFilled',
                },
            },
            {
                path: '/acl/permission',
                component: () => import('@/view/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    hidden: false,
                    title: '菜单管理',
                    icon: 'Monitor',
                },
            },
        ],
    },
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        meta: {
            hidden: false,
            title: '商品管理',
            icon: 'Goods',
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/view/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    hidden: false,
                    title: '品牌管理',
                    icon: 'ShoppingCartFull',
                },
            },
            {
                path: '/product/attr',
                component: () => import('@/view/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    hidden: false,
                    title: '属性管理',
                    icon: 'CollectionTag',
                },
            },
            {
                path: '/product/spu',
                component: () => import('@/view/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    hidden: false,
                    title: 'SPU管理',
                    icon: 'Calendar',
                },
            },
            {
                path: '/product/sku',
                component: () => import('@/view/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    hidden: false,
                    title: 'SKU管理',
                    icon: 'Orange',
                },
            },
        ],
    },
]

//任意路由
//任意路由
export const anyRoute = {
    //任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',
        hidden: true,
        icon: 'DataLine',
    },
}
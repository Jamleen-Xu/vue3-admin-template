// 自定义指令
import pinia from "@/store"
import { useUserStore } from "@/store/modules/user"

const userStore = useUserStore(pinia)
// 在非组件中使用小仓库，需要引入 pinia

export const isHasButton = (app: any) => {
    //获取对应的用户仓库
    //全局自定义指令:实现按钮的权限
    app.directive('has', {
        //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
        mounted(el: any, option: any) {
            //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
            //从DOM树上干掉
            //el就是dom元素
            //options:传入进来的值
            // 如果当前绑定的按钮上的  option.value  不在返回的userStore的buttons数组中，就表示没有这个权限，所以从DOM树上干掉 
            if (userStore.buttons.includes(option.value)) {
                el.parentNode.removeChild(el)
            }
        }
    })
}
// 小仓库 : layout组件相关配置仓库
import { defineStore } from 'pinia';

let useLayoutSettingStore = defineStore('SettingStore', {
    state: (): { fold: boolean, refresh: boolean } => {
        return {
            fold: false,  // 用户控制菜单是折叠还是展开
            refresh: false,  // 用于控制刷新
        }
    },
    actions: {
        changeFold() {
            this.fold = !this.fold
        }
    }
});

export default useLayoutSettingStore;

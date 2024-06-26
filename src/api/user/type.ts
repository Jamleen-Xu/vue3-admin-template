// 登陆接口需要携带参数的类型
export interface loginFormData {
    username: string,
    password: string
}

//定义全部接口返回数据都有的数据类型，接口返回数据类型的共性
export interface responseData {
    code: number
    message: string
    ok: boolean
}

// 定义登录接口返回数据类型
export interface loginResponseData extends responseData {
    data: string
}

//定义获取用户信息返回的数据类型
export interface userInfoResponseData extends responseData {
    data: {
      routes: string[]
      buttons: string[]
      roles: string[]
      name: string
      avatar: string
    }
  }
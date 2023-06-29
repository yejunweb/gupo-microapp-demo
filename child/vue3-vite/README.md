# Vue3 + vite + ant-design 模版（JS 版本）

> 该模板以集成至 gupo-cli，请使用 gupo-cli 创建并使用

### 使用该模板前请先修改以下变量

```
// .env

VITE_APP_TITLE=应用名称
VITE_APP_STORAGE_KEY=本地持久化key
VITE_PORT=11226
```

```
// .env.development & .env.staging & .env.production

VITE_APP_API_URL=后台 api 地址
```

### 模板预设了以下功能

##### svg icon 集成

-   可以在项目中使用 components/Icon 组件来引用 assets/svg 下的 svg 文件
-   其属性见：[gupo-icons](https://release.group-ds.com/gupo-icons/#/docs)

##### setup 上使用 name

-   <script setup name="MyComponent">...</script>

##### 状态持久化和加密

-   使用配置 utils/storage 导出的 `useLocalStorage`,`useSessionStorage` 的方法
-   const xxx = useLocalStorage('key', 'initValue')
-   xxx 就是一个响应式的 localStorage 数据
-   默认配置 { crypto: !isDevMode() }，在非开发环境下使用 crypto-js 加密

##### axios 拦截器

-   自动取消重复请求，可以用过在 config 里配置 multiple: true 关闭
-   delayRequest 方法，可以获得 start 和 cancel，start 即原先的 request，和普通请求的区别在于可以拿到当前请求的 cancel 在合适的情况调用
-   clearPending 方法，可以取消所有正在请求的接口

##### 提交检查以及格式化

-   提交检查流程配置文件 {cwd}/lint-stage.config.js，每次提交都会对每种类型进行相对应的操作
-   eslint(检验代码格式) [配置](https://eslint.org/docs/latest/user-guide/configuring/)文件 {cwd}/.eslintrc.js
-   prettier(修复代码格式) [配置](https://prettier.io/docs/en/configuration.html)文件 {cwd}/.prettierrc
-   stylelint(检查样式文件) [配置](https://stylelint.io/user-guide/configure/)文件 {cwd}/stylelint.config.js
-   commitlint(检查 git 提交) [配置](https://commitlint.js.org/#/reference-configuration)文件 {cwd}/commitlint.config.js
-   ls-lint(检查文件命名) [配置](https://ls-lint.org/1.x/configuration/the-rules.html)文件 {cwd}/.ls-lint.yml

##### 快速发布代码

-   用于自动触发流水线
-   使用 yarn deploy 发布测试环境，具体 tag 在配置文件 .env.staging 中的 OSS_TAG
-   使用 yarn deploy:prod 发布正式环境，具体 tag 在配置文件 .env.production 中的 OSS_TAG
-   默认在版本号末尾 +1，使用 gupo-deploy --release_as x.x.x 可以指定版本号
-   **注意：本意是方便测试环境代码发布，生产环境请合并 main 或 master 后手动打标签**

### 还有这些功能可以通过配置环境变量的方法开启

##### 是否使用 windicss

```
// .env

VITE_WINDICSS=false
```

##### 是否压缩文件

```
// .env

// 可选: gzip | brotli | none
// 同时开启请用逗号分隔，example: `gzip,brotli`
// 如果服务器支持 brotli 压缩可以开启，该方式相比 gzip 体积更小

VITE_BUILD_COMPRESS=gzip
VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE=false
```

##### 是否开启自动按需引入组件(包括 src/components 下的组件)和按需自动导入 API，默认只包涵 vue 和 vue-router

```
// .env

// 可选 VueUseComponents | ElementPlus | NaiveUi | Vant | AntDesign | Arco | DevUi | ElementUi | HeadlessUi | Idux | Inkline | LayuiVue | PrimeVue | Quasar | TDesign | Varlet | Veui | Vuetify3 | Vuetify
// 同时开启请用逗号分隔，example: `VueUseComponents,NaiveUi`

VITE_UNPLUGINS_IMPORTS=''
# 请注意配置完成以后：请手动安装 ui 库的依赖包
```

##### 是否开启自动解包 ref（鱿鱼西推荐，这样的写法更像普通 js）

```
// .env

// 开启以后可以如下使用 ref
// import { $ref } from 'vue/macros'
// let count = $ref(0)
// 然后就可以直接修改变量了
// count++ // 而非 count.value++

VITE_VUE_REACTIVITY_TRANSFORM=false
// https://github.com/vuejs/core/tree/main/packages/reactivity-transform
// 注意：该特性为实验功能
```

##### 是否要兼容旧版浏览器

```
// .env

VITE_LEGACY=false
```

##### 是否删除 console

```
// .env

VITE_DROP_CONSOLE=false
```

##### 是否删除 debug

```
// .env

VITE_DROP_DEBUG=true
```

##### 是否开启本地 https

```
// .env.development

VITE_LISTEN_HTTPS=false
```

# 云端对接说明

## 1. 项目目标

这个项目的目标不是只做一个可演示原型，而是：

- 小程序正式上线
- C 端用户可下单、查看订单、管理地址
- 后续可扩展 B 端能力
- 系统可稳定运行
- 后续可常态维护

所以当前本地开发的意义是先把这三件事做稳定：

- 前端界面和交互
- 本地业务流程
- 前后端数据契约

云端接入不是推翻重来，而是把本地已经稳定的业务逻辑接到真实数据源上。

## 2. 你说的“云端像一台电脑”对不对

这个类比可以用，但要稍微修正一下：

- 云环境像一台你租到的电脑
- `envId` 像这台电脑的地址
- 云函数像部署到这台电脑上的一组服务接口
- 数据库集合像这台电脑里的几个数据文件柜
- 权限规则像门锁
- 你的小程序 `appid` 像持钥匙的人

所以不是我直接远程登录一台服务器去手工写线上代码，而是：

1. 代码在本地写好
2. 通过微信开发者工具或云开发工具部署到云环境
3. 云环境根据权限规则决定谁能访问
4. 小程序前端通过 `wx.cloud.callFunction()` 调用这些云函数

## 3. “锁”是谁建的

如果继续用你这个比喻：

- 腾讯云 / 微信云开发平台先把“门”和“锁”的能力提供出来
- 你创建云环境时，相当于拿到属于你项目的那把锁
- 你配置数据库权限、云函数权限，相当于决定锁怎么拧
- 你的小程序 `appid`、用户登录态、`openid` 决定谁能开哪扇门

在这个项目里，很多云函数都已经按“用户只能访问自己的数据”这个思路写了，比如：

- `getOrders` 按 `_openid` 查订单
- `getAddresses` 按 `_openid` 查地址
- `deleteAddress` 会校验地址是不是当前用户的
- `updateOrderStatus` 会校验订单是不是当前用户的

这部分“锁”的核心不是我本地造一个密码，而是你在云开发环境里启用了身份体系，云函数通过 `cloud.getWXContext()` 拿到当前用户的 `OPENID` 做权限判断。

## 4. 怎么保证“本地写好”之后真能上云

不能靠想当然，要靠对齐清单。

能不能部署成功，至少要同时满足这几项：

1. `project.config.json` 指向当前小程序项目
2. `appid` 正确
3. `cloudbaserc.json` 里的 `envId` 改成真实值
4. 云函数目录结构和名称不变
5. 云数据库集合存在
6. 前端调用名和云函数名一致
7. 前端传参与云函数读取字段一致
8. 云函数返回值结构和前端消费方式一致

只要这几项都对上，云端并不是“另一套神秘系统”，而是把你本地这套函数部署过去。

## 5. 当前已基本对齐的部分

### 5.1 商品

集合：`products`

字段：

- `_id`
- `name`
- `price`
- `originalPrice`
- `image`
- `category`
- `categoryText`
- `sales`
- `stock`
- `description`

相关云函数：

- `initDatabase`
- `getProducts`

### 5.2 订单

集合：`orders`

字段：

- `_id`
- `_openid`
- `orderNo`
- `status`
- `statusText`
- `products`
- `totalCount`
- `productTotal`
- `deliveryFee`
- `totalPrice`
- `address`
- `remark`
- `createTime`
- `payTime`
- `deliverTime`
- `completeTime`

相关云函数：

- `createOrder`
- `getOrders`
- `updateOrderStatus`

前端当前本地订单结构和云端订单结构基本是一致的。

## 6. 当前已经做好的地址兼容

地址这块现在已经改成双格式兼容。

#### 前端标准地址结构

```js
{
  _id,
  name,
  phone,
  province,
  city,
  district,
  detail,
  isDefault
}
```

#### 云函数兼容地址结构

```js
{
  _id,
  name,
  phone,
  region,    // 数组，例如 ['浙江省', '杭州市', '西湖区']
  detail,
  isDefault
}
```

也就是说，现在这两套都能接受：

- `province/city/district`
- `region`

系统内部会自动补齐成同时带两套字段的标准地址对象，再用于页面显示和订单保存。

## 7. 当前云函数接口契约

### `getProducts`

入参：

```js
{
  category, // 可选
  keyword   // 可选
}
```

返回：

```js
{
  code: 0,
  data: Product[],
  message: 'success'
}
```

### `createOrder`

入参：

```js
{
  products,
  address,
  remark,
  totalPrice,
  deliveryFee,
  productTotal,
  totalCount
}
```

返回：

```js
{
  code: 0,
  data: {
    _id,
    ...order
  },
  message
}
```

### `getOrders`

入参：

```js
{
  status // 可选
}
```

返回：

```js
{
  code: 0,
  data: Order[],
  message: 'success'
}
```

### `updateOrderStatus`

入参：

```js
{
  orderId,
  status
}
```

返回：

```js
{
  code: 0,
  message
}
```

### `getAddresses`

入参：

```js
{}
```

返回：

```js
{
  code: 0,
  data: Address[],
  message: 'success'
}
```

### `saveAddress`

入参：

```js
{
  _id,       // 可选，更新时传
  name,
  phone,
  region,
  detail,
  isDefault
}
```

返回：

```js
{
  code: 0,
  data: {
    _id,
    ...address
  },
  message
}
```

### `deleteAddress`

入参：

```js
{
  addressId
}
```

返回：

```js
{
  code: 0,
  message
}
```

## 8. 云端部署前检查清单

你部署前，最少确认这些：

- 已创建真实云环境
- `cloudbaserc.json` 的 `envId` 已替换
- `app.js` 中的云环境占位已替换或由前端统一配置读取
- `products`、`orders`、`addresses` 集合存在
- 已部署全部云函数
- 云函数部署名与本地目录名一致
- 数据库权限规则可满足当前小程序访问
- 小程序端已能拿到用户身份

## 9. 我对你当前问题的直接结论

### 9.1 本地和云端冲不冲突

不冲突。

当前本地工作是在把：

- 页面
- 交互
- 订单流程
- 数据结构

先稳定下来。

这一步本来就是上云前必须做的。

### 9.2 现在是不是主要在做前端

是，但不只是纯样式前端。

更准确地说，现在做的是：

- 小程序前端
- 本地业务逻辑
- 未来前后端接口契约

### 9.3 能不能保证部署一定成功

我不能空口保证 100%，但可以把失败点提前暴露出来。

就目前仓库状态看：

- 商品、订单这两块契约比较稳定
- 地址这块还有一个需要统一的字段差异
- 云环境占位符还需要你在部署时替换

## 10. 我建议你下一步怎么做

你继续部署云环境时，最该盯这三件事：

1. 先把真实 `envId` 配好
2. 先把 `products/orders/addresses` 三个集合建好
3. 先统一地址结构，再接地址相关云函数

如果你愿意，我下一步最值得做的一件事，就是我直接把“地址结构”这一处本地和云端契约统一掉。这个改动不大，但能明显降低你后面联调时出问题的概率。

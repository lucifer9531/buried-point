# Buried-point 是什么？

Buried-point 是一个专为 **前端埋点** 开发的 **全量数据采集工具**。它采用自动化采集前端应用的所有数据，并以相应的规则保证 **埋点** 以一种统一的方式进行调用。

### 什么是“全量数据采集工具”？

让我们从一个简单的 前端埋点 开始：

```js
// 工程入口文件
// url改变时将触发工具自动埋点
import Pio from "@monitor/buried-point";
new Pio.Track("projectName", { router });

// 业务逻辑
// 使用函数调用
import { trackEvent } from "@monitor/buried-point";
trackEvent("buy", { price: "123" });

// 业务逻辑
// 使用装饰器调用
import { trackEvent } from "@monitor/buried-point";
@Component
export default class HelloWorld extends Vue {
  price = "123";
  @trackEvent("btnClick", vm => {
    price: vm.price;
  })
  onClick() {
    // 业务逻辑
  }
}
```

埋点**模式**包含以下两个部分：

- **SPA 模式**，默认监听 hash；
- **非 SPA 模式**，默认监听 history。

埋点**类型**包含以下两个部分：

- **SYSTEM_EVENTS**，工具自动埋点；
- **BUSSINESS_EVENTS**，业务手动埋点。

在实例化 **Pio.Track** 后，Pio 将自动**采集分析**以下数据：

- 当前页面信息
- 页面来源
- 浏览器信息
- 客户端信息
- userAgent


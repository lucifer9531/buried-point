# 安装

### NPM

```bash
npm install @monitor/buried-point --save
```

### Yarn

```bash
yarn add @monitor/buried-point
```

在一个模块化的打包系统中，您必须显式地通过 `new Pio.Track()` 来安装 Pio：

```js
import Monitor from "@monitor/buried-point";

// xxx为应用标识符，用于归类数据
new Monitor.Track("xxx");
```

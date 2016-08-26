# Amaze UI Chosen
---

[Chosen](https://github.com/harvesthq/chosen) 是一个优化 `<select>` 显示、交互效果的 jQuery 插件。

此项目中只是将 Chosen 的样式调整为 Amaze UI 风格，没有修改 JS 源码。

- [使用示例](http://amazeui.github.io/chosen/docs/demo.html)
- [参数说明](http://amazeui.github.io/chosen/docs/options.html)

**使用说明：**

1. 获取 Amaze UI Chosen：

  - [直接下载](https://github.com/amazeui/chosen/archive/master.zip)
  - 使用 NPM: `npm install amazeui-chosen`

2. 在 Amaze UI 样式之后引入 Chosen 样式：

  Amaze UI Chosen 依赖 Amaze UI 样式。

  ```html
  <link rel="stylesheet" href="path/to/amazeui.min.css"/>
  <link rel="stylesheet" href="path/to/amazeui.chosen.css"/>
  ```

3. 在 jQuery 之后引入 Chosen 插件：

  ```html
  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/amazeui.chosen.min.js"></script>
  ```

4. 调用 Chosen：

```js
$(function() {
  $('.my-select').chosen();
});
```

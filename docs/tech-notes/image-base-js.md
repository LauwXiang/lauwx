* 如何区分图片的类型（非文件后缀名）；
* 如何获取图片的尺寸（非右键查看图片信息）；
* 如何预览本地图片（非图片阅读器）；
* 如何实现图片压缩（非图片压缩工具）；
* 如何操作位图像素数据（非 PS 等图片处理软件）；
* 如何实现图片隐写（非肉眼可见）；

---

---

### 1 图片相关基础知识

**1.1 位图**

* `位图图像（bitmap），亦称为点阵图像或栅格图像，是由称作像素（图片元素）的单个点组成的。`用数码相机拍摄的照片、扫描仪扫描的图片以及计算机截屏图等都属于位图。
* 分辨率是位图不可逾越的壁垒，在对位图进行缩放、旋转等操作时，无法生产新的像素，因此会放大原有的像素填补空白，这样会让图片显得不清晰。
* 图中的小方块被称为像素，这些小方块都有一个明确的位置和被分配的色彩数值，小方格颜色和位置就决定该图像所呈现出来的样子。


---

**1.2 矢量图**

* 所谓矢量图，就是使用直线和曲线来描述的图形，构成这些图形的元素是一些点、线、矩形、多边形、圆和弧线等，它们都是通过数学公式计算获得的，具有编辑后不失真的特点。
* 矢量图以几何图形居多，图形可以无限放大，不变色、不模糊。
* 可缩放矢量图形（英语：Scalable Vector Graphics，SVG）是一种基于可扩展标记语言（XML），用于描述二维矢量图形的图形格式。SVG由W3C制定，是一个开放标准。

---

---

### 2 图片进阶

**2.1 如何区分图片的类型**

`计算机并不是通过图片的后缀名来区分不同的图片类型，而是通过 “魔数”（Magic Number）来区分。 `对于某一些类型的文件，起始的几个字节内容都是固定的，跟据这几个字节的内容就可以判断文件的类型。

文件类型文件后缀魔数JPEGjpg/jpeg0xFFD8FFPNGpng0x89504E47GIFgif0x47494638（GIF8）BMPbmp0x424D

在日常开发过程中，如果遇到检测图片类型的场景，我们可以直接利用一些现成的第三方库。比如，你想要判断一张图片是否为 PNG 类型，这时你可以使用 is-png 这个库。

---

**2.2 如何获取图片的尺寸**

图片的尺寸、位深度、色彩类型和压缩算法都会存储在文件的二进制数据中，因此如果想要获取图片的尺寸，我们就需要依据不同的图片格式对图片二进制数据进行解析，image-size 这个 Node.js 库已经帮我们实现了获取主流图片类型文件尺寸的功能。

image-size 这个库功能还是蛮强大的，除了支持 PNG 格式之外，还支持 BMP、GIF、ICO、JPEG、SVG 和 WebP 等格式。

---

**2.3 如何预览本地图片**

```js
<input type="file" accept="image/*" onchange="loadFile(event)">
<img id="output"/>
<script>
  const loadFile = function(event) {
    const reader = new FileReader();
    reader.onload = function(){
      const output = document.querySelector('output');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };
</script>
```

---

**2.4 如何实现图片压缩**

在前端要实现图片压缩，我们可以利用 Canvas 对象提供的 toDataURL() 方法，该方法接收 type 和 encoderOptions 两个可选参数。

其中 type 表示图片格式，默认为 image/png。而 encoderOptions 用于表示图片的质量，在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92，其他参数会被忽略。

```js
function compress(base64, quality, mimeType) {
  let canvas = document.createElement("canvas");
  let img = document.createElement("img");
  img.crossOrigin = "anonymous";
  return new Promise((resolve, reject) => {
    img.src = base64;
    img.onload = () => {
      let targetWidth, targetHeight;
      if (img.width > MAX_WIDTH) {
        targetWidth = MAX_WIDTH;
        targetHeight = (img.height * MAX_WIDTH) / img.width;
      } else {
        targetWidth = img.width;
        targetHeight = img.height;
      }
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, targetWidth, targetHeight); // 清除画布
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let imageData = canvas.toDataURL(mimeType, quality / 100);
      resolve(imageData);
    };
  });
}

```

对于返回的 Data URL 格式的图片数据，为了进一步减少传输的数据量，我们可以把它转换为 Blob 对象：

```js
function dataUrlToBlob(base64, mimeType) {
  let bytes = window.atob(base64.split(",")[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}
```

在转换完成后，我们就可以压缩后的图片对应的 Blob 对象封装在 FormData 对象中，然后再通过 AJAX 提交到服务器上：

```js
function uploadFile(url, blob) {
  let formData = new FormData();
  let request = new XMLHttpRequest();
  formData.append("image", blob);
  request.open("POST", url, true);
  request.send(formData);
}
```

---

**2.5 如何操作位图像素数据**

如果想要操作图片像素数据，我们可以利用 CanvasRenderingContext2D 提供的 getImageData 来获取图片像素数据，其中 getImageData() 返回一个 ImageData 对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为（sx, sy）、宽为 sw、高为 sh。其中 getImageData 方法的语法如下：

```js
ctx.getImageData(sx, sy, sw, sh);
```

相应的参数说明如下：

* sx：将要被提取的图像数据矩形区域的左上角 x 坐标。
* sy：将要被提取的图像数据矩形区域的左上角 y 坐标。
* sw：将要被提取的图像数据矩形区域的宽度。
* sh：将要被提取的图像数据矩形区域的高度。

在获取到图片的像素数据之后，我们就可以对获取的像素数据进行处理，比如进行灰度化或反色处理。当完成处理后，若要在页面上显示处理效果，则我们需要利用 CanvasRenderingContext2D 提供的另一个 API —— putImageData。

该 API 是 Canvas 2D API 将数据从已有的 ImageData 对象绘制到位图的方法。如果提供了一个绘制过的矩形，则只绘制该矩形的像素。此方法不受画布转换矩阵的影响。putImageData 方法的语法如下：

```js
void ctx.putImageData(imagedata, dx, dy);
void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
```

相应的参数说明如下：

* imageData： ImageData ，包含像素值的数组对象。
* dx：源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）。
* dy：源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）。
* dirtyX（可选）：在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（x 坐标）。
* dirtyY（可选）：在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（y 坐标）。
* dirtyWidth（可选）：在源图像数据中，矩形区域的宽度。默认是图像数据的宽度。
* dirtyHeight（可选）：在源图像数据中，矩形区域的高度。默认是图像数据的高度。

```js
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>图片反色和灰度化处理</title>
  </head>
  <body onload="loadImage()">
    <div>
      <button id="invertbtn">反色</button>
      <button id="grayscalebtn">灰度化</button>
    </div>
    <canvas id="canvas" width="800" height="600"></canvas>
    <script>
      function loadImage() {
        var img = new Image();
        img.crossOrigin = "";
        img.onload = function () {
          draw(this);
        };
        // 这是阿宝哥的头像哟
        img.src = "https://avatars3.githubusercontent.com/u/4220799";
      }

      function draw(img) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        img.style.display = "none";
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        var invert = function () {
          for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
          }
          ctx.putImageData(imageData, 0, 0);
        };

        var grayscale = function () {
          for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
          }
          ctx.putImageData(imageData, 0, 0);
        };

        var invertbtn = document.getElementById("invertbtn");
        invertbtn.addEventListener("click", invert);
        var grayscalebtn = document.getElementById("grayscalebtn");
        grayscalebtn.addEventListener("click", grayscale);
      }
    </script>
  </body>
</html>

```

需要注意的在调用 getImageData 方法获取图片像素数据时，你可能会遇到跨域问题，比如：

```js
Uncaught DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.
```

对于这个问题，你可以阅读 [解决canvas图片getImageData,toDataURL跨域问题](https://www.zhangxinxu.com/wordpress/2018/02/crossorigin-canvas-getimagedata-cors/)

---

**2.6 如何实现图片隐写**

`**隐写术是一门关于信息隐藏的技巧与科学，所谓信息隐藏指的是不让除预期的接收者之外的任何人知晓信息的传递事件或者信息的内容。**`

\<---未完待续---\>

---

---

### **3 常用图片处理库**

**2.1 AlloyImage**

****

`基于 HTML 5 的专业级图像处理开源引擎。`

****

[地址](https://github.com/AlloyTeam/AlloyImage)

[在线示例](http://alloyteam.github.io/AlloyImage/)

AlloyImage 基于 HTML5 技术的专业图像处理库，来自腾讯 AlloyTeam 团队。它拥有以下功能特性：

* 基于多图层操作 —— 一个图层的处理不影响其他图层；
* 与 PS 对应的 17 种图层混合模式 —— 便于 PS 处理教程的无缝迁移；
* 多种基本滤镜处理效果 —— 基本滤镜不断丰富、可扩展；
* 基本的图像调节功能 —— 色相、饱和度、对比度、亮度、曲线等；
* 简单快捷的 API —— 链式处理、API 简洁易用、传参灵活；
* 多种组合效果封装 —— 一句代码轻松实现一种风格；
* 接口一致的单、多线程支持 —— 单、多线程切换无需更改一行代码，多线程保持快捷 API 特性。

对于该库 AlloyTeam 团队建议的使用场景如下：

* 桌面软件客户端内嵌网页运行方式 \>\>\> 打包 Webkit 内核：用户较大头像上传风格处理、用户相册风格处理（处理时间平均 \< 1s）；
* Win8 Metro 应用 \>\>\> 用户上传头像，比较小的图片风格处理后上传（Win8 下 IE 10 支持多线程）；
* Mobile APP \>\>\> Andriod 平台、iOS 平台小图风格 Web 处理的需求，如 PhoneGap 应用，在线头像上传时的风格处理、Mobile Web 端分享图片时风格处理等。

---

**2.2 blurify**

`blurify.js is a tiny(~2kb) library to blurred pictures, support graceful downgrade from css mode to canvas mode.`

[地址](https://github.com/JustClear/blurify)

[在线示例](http://alloyteam.github.io/AlloyImage/)

blurify.js 是一个用于图片模糊，很小的 JavaScript 库（约 2 kb），并支持从 CSS 模式到 Canvas 模式的优雅降级。该插件支持三种模式：

* css 模式：使用 filter 属性，默认模式；
* canvas 模式：使用 canvas 导出 base64；
* auto 模式：优先使用 css 模式，否则自动切换到 canvas 模式。

midori，该库用于为背景图创建动画，使用 three.js 编写并使用 WebGL

[示例地址](https://aeroheim.github.io/midori/)

---

**2.3 cropperjs**

`JavaScript image cropper.`

[地址](https://github.com/fengyuanchen/cropperjs)

[在线示例](https://fengyuanchen.github.io/cropperjs/)

Cropper.js 是一款非常强大却又简单的图片裁剪工具，它可以进行非常灵活的配置，支持手机端使用，支持包括 IE9 以上的现代浏览器。它可以用于满足诸如裁剪头像上传、商品图片编辑之类的需求。Cropper.js 支持以下特性：

* 支持 39 个配置选项；
* 支持 27 个方法；
* 支持 6 种事件；
* 支持 touch（移动端）；
* 支持缩放、旋转和翻转；
* 支持在画布上裁剪；
* 支持在浏览器端通过画布裁剪图像；
* **`支持处理 Exif 方向信息`；**
* 跨浏览器支持

可交换图像文件格式（英语：Exchangeable image file format，官方简称 Exif），是专门为数码相机的照片设定的文件格式，可以记录数码照片的属性信息和拍摄数据。Exif 可以附加于 JPEG、TIFF、RIFF 等文件之中，为其增加有关数码相机拍摄信息的内容和索引图或图像处理软件的版本信息。

Exif 信息以 0xFFE1 作为开头标记，后两个字节表示 Exif 信息的长度。所以 Exif 信息最大为 64 kB，而内部采用 TIFF 格式。

---

**2.4 compressorjs**

`JavaScript image compressor.`

[地址](https://github.com/fengyuanchen/compressorjs)

[在线示例](https://fengyuanchen.github.io/compressorjs/)

compressorjs 是 JavaScript 图像压缩器。使用浏览器原生的 canvas.toBlob API 进行压缩工作，这意味着它是有损压缩。通常的使用场景是，在浏览器端图片上传之前对其进行预压缩。

在浏览器端要实现图片压缩，除了使用 canvas.toBlob API 之外，还可以使用 Canvas 提供的另一个 API，即 toDataURL API，它接收 type 和 encoderOptions 两个可选参数。

其中 type 表示图片格式，默认为 image/png。而 encoderOptions 用于表示图片的质量，在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92，其他参数会被忽略。

相比 canvas.toDataURL API 来说，canvas.toBlob API 是异步的，因此多了个 callback 参数，这个 callback 回调方法默认的第一个参数就是转换好的 blob 文件信息。

---

**2.5 fabric.js**

`Javascript Canvas Library, SVG-to-Canvas (& canvas-to-SVG) Parser.`

[地址](https://github.com/fabricjs/fabric.js)

[在线示例](http://fabricjs.com/kitchensink)

Fabric.js 是一个框架，可让你轻松使用 HTML5 Canvas 元素。它是一个位于 Canvas 元素之上的交互式对象模型，同时也是一个 「SVG-to-canvas」 的解析器。

使用 Fabric.js，你可以在画布上创建和填充对象。所谓的对象，可以是简单的几何形状，比如矩形，圆形，椭圆形，多边形，或更复杂的形状，包含数百或数千个简单路径。然后，你可以使用鼠标缩放，移动和旋转这些对象。并修改它们的属性 —— 颜色，透明度，z-index 等。此外你还可以一起操纵这些对象，即通过简单的鼠标选择将它们分组。

Fabric.js 支持所有主流的浏览器，具体的兼容情况如下：

* Firefox 2+
* Safari 3+
* Opera 9.64+
* Chrome（所有版本）
* IE10，IE11，Edge

---

**2.6 Resemble.js**

**`Image analysis and comparison`**

[地址](https://github.com/rsmbl/Resemble.js)

[在线示例](http://rsmbl.github.io/Resemble.js/)

Resemble.js 使用 HTML Canvas 和 JavaScript 来实现图片的分析和比较。兼容大于 8.0 的 Node.js 版本。

---

**2.7 Pica**

`Resize image in browser with high quality and high speed`

[地址](https://github.com/nodeca/pica)

[在线示例](http://nodeca.github.io/pica/demo/)

Pica 可用于在浏览器中调整图像大小，没有像素化并且相当快。它会自动选择最佳的可用技术：webworkers，webassembly，createImageBitmap，纯 JS。

借助 Pica，你可以实现以下功能：

* 减小大图像的上传大小，节省上传时间；
* 在图像处理上节省服务器资源；
* 在浏览器中生成缩略图。

---

**2.8 tui.image-editor**

`🍞🎨 Full-featured photo image editor using canvas. It is really easy, and it comes with great filters.`

[地址](https://github.com/nhn/tui.image-editor)

[在线示例](https://ui.toast.com/tui-image-editor/)

tui.image-editor 是使用 HTML5 Canvas 的全功能图像编辑器。它易于使用，并提供强大的过滤器。同时它支持对图像进行裁剪、翻转、旋转、绘图、形状、文本、遮罩和图片过滤等操作。

tui.image-editor 的浏览器兼容情况如下：

* Chrome
* Edge
* Safari
* Firefox
* IE 10+

---

**2.9 gif.js**

`JavaScript GIF encoding library`

[地址](https://github.com/jnordberg/gif.js)

[在线示例](http://jnordberg.github.io/gif.js/)

gif.js 是运行在浏览器端的 JavaScript GIF 编码器。它使用类型化数组和 Web Worker 在后台渲染每一帧，速度真的很快。该库可工作在支持：Web Workers，File API 和 Typed Arrays 的浏览器中。

gif.js 的浏览器兼容情况如下：

* Google Chrome
* Firefox 17
* Safari 6
* Internet Explorer 10
* Mobile Safari iOS 6

---

**2.10 Sharp**

`High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP and TIFF images. Uses the libvips library.`

[地址](https://github.com/lovell/sharp)

[在线示例](https://segmentfault.com/a/1190000012903787)

Sharp 的典型应用场景是将常见格式的大图像转换为尺寸较小，对网络友好的 JPEG，PNG 和 WebP 格式的图像。由于其内部使用 libvips ，使得调整图像大小通常比使用 ImageMagick 和 GraphicsMagick 设置快 4-5 倍 。除了支持调整图像大小之外，Sharp 还支持旋转、提取、合成和伽马校正等功能。

Sharp 支持读取 JPEG，PNG，WebP，TIFF，GIF 和 SVG 图像。输出图像可以是 JPEG，PNG，WebP 和 TIFF 格式，也可以是未压缩的原始像素数据。




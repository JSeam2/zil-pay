# ZilPay浏览器扩展

[![Chrome](https://img.shields.io/chrome-web-store/v/klnaejjgbibmhlephnhpmaofohgkpgkd)](https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd?utm_source=chrome-ntp-icon)
[![FireFox](https://img.shields.io/amo/v/zilpay)](https://addons.mozilla.org/en-GB/firefox/addon/zilpay/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Zilliqa/scilla/blob/master/LICENSE)
[![Gitter chat](http://img.shields.io/badge/chat-on%20gitter-077a8f.svg)](https://gitter.im/Zilliqa/General)

*用其他语言阅读: [English](README.md), [Español](README_ES.md), [Nederlands](intro_NL.md), [Русский](README_RU.md), [日本語](README_JP.md), [Deutsch](README_DE.md), [Korean](README_KR.md).*

ZilPay是Zilliqa区块链的浏览器钱包。 开发人员可以将ZilPay集成到他们的网站中以创建去中心化应用程序。

<p align="center">
  <a href="https://zilpay.xyz"><img src="https://github.com/lich666dead/zil-pay/blob/master/imgs/preview.png"></a>
</p>

## 链接
+ [Discord](https://discordapp.com/channels/370992535725932544/636917110089580544)
+ [Chrome store](https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd?utm_source=chrome-ntp-icon)
+ [FireFox store](https://addons.mozilla.org/en-GB/firefox/addon/zilpay/)
+ [Opera](https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd?utm_source=chrome-ntp-icon)

## 入门
您可以从源代码部署本地版本。

对于dApp开发人员：
+ [ZilPay完整文件](https://zilpay.xyz/Documentation/)
+ [ZilPay尝试构建您的dApp](https://medium.com/coinmonks/test-and-develop-dapps-on-zilliqa-with-zilpay-52b165f118bf?source=friends_link&sk=2a60070ddac60677ec36b1234c60222a)
+ [Zilliqa dApps示例](https://github.com/lich666dead/zilliqa-dApps)

### 正在安装

```bash
$ npm install         # 安装依赖
```

### Building

* For develop
```bash
$ npm run content     # 建立content.js
$ npm run inpage      # 建立inpage.js
$ npm run background  # 建立background.js
$ npm run scripts     # 构建content.js＆inpage.js＆background.js
$ npm run all:firefox # 所有脚本均针对firefox平台构建。
$ npm run all:chrome  # 所有脚本均针对chrome平台构建。
```

* 用于生产:
```bash
$ npm run build:prod:firefox
$ npm run build:prod:chrome
```

### 运行测试
```bash
$ npm run test # run testing
```

## 建于

* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [vuejs](https://github.com/vuejs)

## s

* **Rinat Khasanshin** - *初期工作* - [lich666black](https://github.com/lich666dead)

## 执照

此项目已获得MIT许可-参见 [LICENSE.md](https://github.com/zilpay/zil-pay/blob/master/LICENSE) 文件以获取详细信息。

感谢您的捐赠。
------

- ZIL: zil1wl38cwww2u3g8wzgutxlxtxwwc0rf7jf27zace
- ETH: 0x246C5881E3F109B2aF170F5C773EF969d3da581B
- BTC: 12MRR8LyLVLHVqXcjz46c9o3KBS76fAY9r
- ZEC: t1dZMw8FVWnGKC9cyXKaiKWmmAFmQoeNc5Y
- LTC: LM3JwjTbboMkHdFEYnn4ycJB61r3fqvXPr
- DASH: Xv2tpCMHPAztd4B5UMnaqwkqnSfiUs1P8B

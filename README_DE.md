# ZilPay Browser Erweiterung

[![Chrome](https://img.shields.io/chrome-web-store/v/klnaejjgbibmhlephnhpmaofohgkpgkd)](https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd?utm_source=chrome-ntp-icon)
[![FireFox](https://img.shields.io/amo/v/zilpay)](https://addons.mozilla.org/en-GB/firefox/addon/zilpay/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Zilliqa/scilla/blob/master/LICENSE)
[![Gitter chat](http://img.shields.io/badge/chat-on%20gitter-077a8f.svg)](https://gitter.im/Zilliqa/General)

*Lesen Sie dies in anderen Sprachen: [English](README.md), [简体中文](README_ZH-CN.md), [Español](README_ES.md), [Nederlands](intro_NL.md), [Русский](README_RU.md), [日本語](README_JP.md), [Korean](README_KR.md).*

ZilPay ist eine Browserbrieftasche für die Zilliqa-Blockchain. Entwickler können ZilPay in ihre Website integrieren, um dezentrale Apps zu erstellen.

<p align="center">
  <a href="https://zilpay.xyz"><img src="https://github.com/lich666dead/zil-pay/blob/master/imgs/preview.png"></a>
</p>

## Links
+ [Discord](https://discordapp.com/channels/370992535725932544/636917110089580544)
+ [Chrome store](https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd?utm_source=chrome-ntp-icon)
+ [FireFox store](https://addons.mozilla.org/en-GB/firefox/addon/zilpay/)
+ [Opera](https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd?utm_source=chrome-ntp-icon)

## Beginnen
Sie können die lokale Version über den Quellcode bereitstellen.

Für dApp-Entwickler:
+ [ZilPay vollständige Dokumentation](https://zilpay.xyz/Documentation/)
+ [ZilPay versuchen Sie, Ihre dApp zu erstellen](https://medium.com/coinmonks/test-and-develop-dapps-on-zilliqa-with-zilpay-52b165f118bf?source=friends_link&sk=2a60070ddac60677ec36b1234c60222a)
+ [Zilliqa dApps Beispiel](https://github.com/lich666dead/zilliqa-dApps)

### Installieren

```bash
$ npm install         # Abhängigkeiten installieren
```

### Building

* For develop
```bash
# Install dependencies
$ npm install

# Serve all files extension.
$ npm run dev

# Serve vue app files to dist.
$ npm run serve:ui

# Serve extension (background.js) and any extensiong files to dist.
$ npm run serve:extension

# Serve web on 8080 port.
$ npm run serve:web
```

* Für die Produktion:
```bash
# Build all app and extension files and optimizing it.
$ npm run build

# Build only UI files and optimizing it.
$ npm run build:ui

# Build only extension files and optimizing it.
$ npm run build:extension
```

### Ausführen der Tests
```bash
# run unit tests
$ npm test:unit

# Watch testing for dev.
$ npm run test:watch

# Check lint ts,vue files.
$ npm run lint
```

## Gebaut mit

* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [vuejs](https://github.com/vuejs)

## Autoren

* **Rinat Khasanshin** - *Erste Arbeit* - [lich666black](https://github.com/lich666dead)

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE.md](https://github.com/zilpay/zil-pay/blob/master/LICENSE) Datei für Details.

Danke für deine Spende.
------

- ZIL: zil1wl38cwww2u3g8wzgutxlxtxwwc0rf7jf27zace
- ETH: 0x246C5881E3F109B2aF170F5C773EF969d3da581B
- BTC: 12MRR8LyLVLHVqXcjz46c9o3KBS76fAY9r
- ZEC: t1dZMw8FVWnGKC9cyXKaiKWmmAFmQoeNc5Y
- LTC: LM3JwjTbboMkHdFEYnn4ycJB61r3fqvXPr
- DASH: Xv2tpCMHPAztd4B5UMnaqwkqnSfiUs1P8B

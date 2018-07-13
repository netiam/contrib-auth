# netiam-contrib-auth

[![Build Status](https://travis-ci.org/netiam/contrib-auth.svg)](https://travis-ci.org/netiam/contrib-auth)
[![Dependencies](https://david-dm.org/netiam/contrib-auth.svg)](https://david-dm.org/netiam/contrib-auth)
[![npm version](https://badge.fury.io/js/netiam-contrib-auth.svg)](http://badge.fury.io/js/netiam-contrib-auth)

> An authentication plugin for netiam

## Example

```js
netiam()
  .auth({userModel: User})
  .plugin(…)
```

## Attention

Never use `2.0` release. Wrong passwords result in false positives on sign in.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

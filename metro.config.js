// const { getDefaultConfig } = require("expo/metro-config");

// module.exports = getDefaultConfig(__dirname);


// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 1) .json fayllarini assetExts ro‘yxatiga qo‘shamiz
config.resolver.assetExts.push("json");


// 2) baʼzi hollarda JSON sourceExts ichida bo‘lib qoladi, uni olib tashlang:
// config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== "json");

module.exports = config;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const formatMoney = value => `¥ ${value.toFixed(2)} 亿`;
const statusLabel = status => status === "good" ? "正常" : status === "watch" ? "关注" : "异常";

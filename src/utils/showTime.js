export default function timeFormate(time) {
  let nowTime = (new Date().getTime() - time) / 1000;
  if (nowTime / 60 < 60) {
    return Math.floor(nowTime / 60) < 0 ? '0分钟前' : `${Math.floor(nowTime / 60)}分钟前`;
  } else if (nowTime / 60 / 60 < 24) {
    return Math.floor(nowTime / 60 / 60) + '小时前';
  } else {
    return Math.floor(nowTime / 60 / 60 / 24) + '天前';
  }
}
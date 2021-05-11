const setCookie = (cname, cvalue, exdays, path) => {
    let host = window.location.host;
    if (exdays) {
      let d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = 
        `${cname}=${cvalue};${expires};Domain=${host};Path=${path ? path : '/'}`;
      return;
    }
    document.cookie = cname + "=" + cvalue; // 不设生命时间则在浏览器窗口关闭后消除
  }
  //获取cookie
const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
  }
  //清除cookie  
const clearCookie = (name, path) => {
  setCookie(name, "", -1, path);
}

// 清除站点所有cookie
const delCookie  = () => {
  let keys = document.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
    }
  }
}

const checkCookie = () => {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}

export {
  setCookie,

  getCookie,

  clearCookie,

  checkCookie,

  delCookie
}
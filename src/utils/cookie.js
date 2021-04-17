const setCookie = (cname, cvalue, exdays, domain, path) => {
    if (exdays) {
      let d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = 
        `${cname}=${cvalue};${expires};Domain=${domain ? domain : 'localhost'};Path=${path ? path : '/'}`;
      // document.cookie = cname + "=" + cvalue + "; " + expires;
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
const clearCookie = (name, domain, path) => {
  setCookie(name, "", -1, domain, path);
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

  checkCookie
}
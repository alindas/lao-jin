// 获取输入框的光标下标
export function getCursorPosition(eleDom) {
  let cursorPosition = 0;
  if (eleDom.selectionStart) { // 非IE
    cursorPosition = eleDom.selectionStart;
  } else { // IE
    try {
      let range = document.selection.createRange();
      range.moveStart('charater', eleDom.value.length);
      cursorPosition = range.text.length;
    } catch (e) {
      cursorPosition = 0;
    }
  }
  return cursorPosition;
}

// 设置光标位置
export function setCursorPosition(eleDom, pos) {
  //非IE
  if (eleDom.setSelectionRange) {
    eleDom.focus(); // 获取焦点
    eleDom.setSelectionRange(pos, pos); // 设置选定区的开始和结束点
  } else if (eleDom.createTextRange) {
    var range = eleDom.createTextRange(); // 创建选定区
    range.collapse(true); // 设置为折叠,即光标起点和结束点重叠在一起
    range.moveEnd("character", pos); // 移动结束点
    range.moveStart("character", pos); // 移动开始点
    range.select(); // 选定当前区域
  }
}
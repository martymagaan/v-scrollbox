var initScrollBox();

(function () {
  var maxPixelsPerScroll = 80;
  var useIEEdgeFallBack = true;

  initScrollBox = function() {
    setScrollBars();
    addScrollFunctionality();
    setFocusedScrollBox();
  };

  initScrollBox();
  window.onload = initScrollBox;
  window.addEventListener('resize', initScrollBox);

  var scrollBoxes;
  function setScrollBars() {
    scrollBoxes = document.getElementsByClassName('v-scrollbox');
    for(var i = 0; i < scrollBoxes.length; i++)
      createScrollBarIfOverflow(scrollBoxes[i]);
  }
  function createScrollBarIfOverflow(scrollBox) {
    var boxHeight = scrollBox.clientHeight;
    var contentHeight = scrollBox.scrollHeight;
    if(contentHeight > boxHeight && !isIEorEdge() && !isSafari()) {
      addScrollBarIfNonexistent(scrollBox);
      setScrollBarDimensions(scrollBox, boxHeight, contentHeight);
    }
    else if(checkIfScrollBarExists(scrollBox)) removeScrollBar(scrollBox);
  }
  function isIEorEdge() {
    if(!useIEEdgeFallBack) return false; 
    else return ((false || !!document.documentMode) || !!window.StyleMedia);
  }
  function isSafari() {
    return navigator.userAgent.indexOf('Safari') != -1 &&
           navigator.userAgent.indexOf('Chrome') == -1;
  }
  function addScrollBarIfNonexistent(scrollBox) {
    if(!checkIfScrollBarExists(scrollBox)) {
      var div = '<div class="v-scrollbar"></div>\n';
      scrollBox.innerHTML = div + scrollBox.innerHTML;
    }
  }
  function setScrollBarDimensions(scrollBox, boxHeight, contentHeight) {
    var scrollBar = scrollBox.children[0];
    var scrollBarSize = calculateScrollBarSize(boxHeight, contentHeight);
    scrollBar.style.height = scrollBarSize + 'px';
    if(scrollBox.children[1].yPos == null) scrollBox.children[1].yPos = 0;
    setScrollLimits(scrollBox);
    enforceLimitsOnResize(scrollBox);
  }
  function calculateScrollBarSize(boxHeight, contentHeight) {
    var scrollBarSize = (boxHeight * boxHeight)/contentHeight;
    if(scrollBarSize < 100) scrollBarSize = 100;
    return scrollBarSize;
  }
  function setScrollLimits(scrollBox) {
    var scrollBar = scrollBox.children[0];
    var content = scrollBox.children[1];
    var marginBottom = getStyleInt(scrollBar, 'margin-bottom');
    var boxHeight = scrollBox.clientHeight;
    scrollBar.maxScrollBarY = boxHeight - scrollBar.clientHeight - (marginBottom * 2);
    content.minContentY = -(scrollBox.scrollHeight - boxHeight);
  }
  function getStyleInt(element, style) {
    return pixelToInt(getStyle(element, style));
  }
  function pixelToInt(style) {
    return parseInt(style.substring(0, style.length - 2));
  }
  function getStyle(element, style) {
    return window.getComputedStyle(element).getPropertyValue(style);
  }
  function enforceLimitsOnResize(scrollBox) {
    var scrollBar = scrollBox.children[0];
    var content = scrollBox.children[1];
    var contentY = getStyleInt(content, 'top');
    if(contentY < content.minContentY) {
      content.style.top = content.minContentY + 'px';
      content.yPos = content.minContentY;
      scrollBar.style.top = scrollBar.maxScrollBarY + 'px';
    }
  }
  function checkIfScrollBarExists(scrollBox) {
    return scrollBox.children[0].className == 'v-scrollbar';
  }
  function removeScrollBar(scrollBox) {
    scrollBox.removeChild(scrollBox.children[0]);
    scrollBox.children[0].style.top = 0;
  }

  function addScrollFunctionality() {
    for(var i = 0; i < scrollBoxes.length; i++)
      addListenersIfScrollable(scrollBoxes[i]);
  }
  function addListenersIfScrollable(scrollBox) {
    if(checkIfScrollBarExists(scrollBox)) {
      addFocusListener(scrollBox);
      addPageScrollDisabler(scrollBox);
      addScrollListener(scrollBox);
      addDragListener(scrollBox);
    }
    else if(isIEorEdge() || isSafari()) useOverflowScroll(scrollBox);
  }
  var focusedScrollBox;
  function addFocusListener(scrollBox) {
    scrollBox.addEventListener('mouseenter', setFocusedScrollBox);
    scrollBox.addEventListener('mouseleave', setFocusedScrollBox);
  }
  function setFocusedScrollBox() {
    setTimeout(function() {
      var hovered = document.querySelectorAll('.v-scrollbox:hover');
      focusedScrollBox = hovered[hovered.length - 1];
    }, 1);
  }
  function addPageScrollDisabler(scrollBox) {
    scrollBox.addEventListener('mouseenter', disablePageScroll);
    scrollBox.addEventListener('mouseleave', enablePageScroll);
  }
  function disablePageScroll() {
    if(window.addEventListener)
      window.addEventListener('DOMMouseScroll', preventPageScroll, false);
    window.onwheel = preventPageScroll;
    window.onmousewheel = document.onmousewheel = preventPageScroll;
    window.ontouchmove = preventPageScroll;
  }
  function preventPageScroll(e) {
    e = e || window.event;
    if(e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }
  function enablePageScroll() {
    this.style.overflowY = 'hidden';
    if(window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', preventPageScroll, false);
    window.onwheel = null;
    window.onmousewheel = document.onmousewheel = null;
    window.ontouchmove = null;
  }

  function addScrollListener(scrollBox) {
    var event = findSupportedWheelEvent(scrollBox);
    if(scrollBox.addEventListener)
      scrollBox.addEventListener(event, mouseWheelHandler, false);
    else scrollBox.attachEvent('onmousewheel', mouseWheelHandler);
  }
  function findSupportedWheelEvent(scrollBox) {
    return 'onwheel' in scrollBox ? 'wheel' :
           document.onmousewheel !== undefined ? 'wheel' : 'DOMMouseScroll';
  }
  function mouseWheelHandler(e) {
    if(checkIfScrollBarExists(this)) {
      var delta = normalizeDelta(-e.deltaY);
      var scrollBox = focusedScrollBox == undefined ? this : focusedScrollBox;
      scrollViaMouseWheel(scrollBox, delta);
    }
  }
  function normalizeDelta(delta) {
    if(typeof InstallTrigger !== 'undefined') delta *= 13;
    else delta *= 0.6;
    delta = limitScrollSpeed(delta, 40);
    return delta;
  }
  function limitScrollSpeed(delta, limit) {
    if(delta > 0 && delta > limit) delta = maxPixelsPerScroll;
    else if(delta < 0 && delta < -limit) delta = -maxPixelsPerScroll;
    return delta;
  }
  function scrollViaMouseWheel(scrollBox, delta) {
    var content = scrollBox.children[1];
    content.yPos += delta;
    keepScrollInBounds(delta, content);
    smoothScrollIfHighDelta(delta, content);
  }
  function keepScrollInBounds(delta, content) {
    if(delta < 0 && content.yPos < content.minContentY) content.yPos = content.minContentY;
    else if(delta > 0 && content.yPos > 0) content.yPos = 0;
  }
  function smoothScrollIfHighDelta(delta, content) {
    if(delta >= 2 || delta <= -2) smoothScroll(content);
    else {
      content.style.top = content.yPos + 'px';
      var newScrollBarY = calculateNewScrollBarY(content, content.yPos);
      moveScrollBar(content.parentElement, newScrollBarY);
    }
  }
  var intervalRunning = false;
  function smoothScroll(content) {
    var diff = content.yPos - getStyleInt(content, 'top');
    var direction = (diff == 0) ? 0 : diff/Math.abs(diff);
    if(!intervalRunning) startSmoothScrollInterval(content, direction);
  }
  function startSmoothScrollInterval(content, direction) {
    intervalRunning = true;
    content.smoothInterval = setInterval(function() {
      var transitionY = calculateTransitionY(content, direction);
      content.style.top = transitionY + 'px';
      var newScrollBarY = calculateNewScrollBarY(content, transitionY);
      moveScrollBar(content.parentElement, newScrollBarY);
    }, 16);
  }
  function calculateTransitionY(content, direction) {
    var currentY = getStyleInt(content, 'top');
    smoothScrollSpeed = Math.max(2, Math.abs(content.yPos - currentY) * 0.23);
    var transitionY = currentY + (direction * smoothScrollSpeed);
    if((direction >= 0 && transitionY >= content.yPos) ||
    (direction <= 0 && transitionY <= content.yPos) ||
    content.style.top == undefined) {
      clearInterval(content.smoothInterval);
      intervalRunning = false;
      return content.yPos;
    } else return transitionY;
  }
  function calculateNewScrollBarY(content, contentY) {
    var scrollBox = content.parentElement;
    return (contentY * scrollBox.children[0].maxScrollBarY) / content.minContentY;
  }
  function moveScrollBar(scrollBox, newY) {
    var scrollBar = scrollBox.children[0];
    if(newY < 0) newY = 0;
    else if(newY > scrollBar.maxScrollBarY) newY = scrollBar.maxScrollBarY;
    scrollBar.style.top = newY + 'px';
  }

  function addDragListener(scrollBox) {
    scrollBox.children[0].onmousedown = dragScrollBarInit;
  }
  var scrollBarIsGrabbed = false;
  var grabbedScrollBar;
  var scrollBarOffset;
  var scrollBoxContentOffset;
  function dragScrollBarInit(e) {
    scrollBarIsGrabbed = true;
    grabbedScrollBar = this;
    calculateScrollBarOffset(e);
    disableContentSelect();
  }
  function calculateScrollBarOffset(e) {
    var initialMouseY = document.all ? window.event.clientY : e.pageY;
    var scrollBarY = grabbedScrollBar.offsetTop;
    scrollBarOffset = initialMouseY - scrollBarY;
  }
  function disableContentSelect() {
    addClass(grabbedScrollBar.parentElement, 'disable-select');
  }
  function addClass(element, className) {
    var classes = element.className.split(' ');
    if(classes.indexOf(className) == -1)
      element.className += ' ' + className;
  }

  document.onmousemove = dragScrollBar;

  function dragScrollBar(e) {
    if(scrollBarIsGrabbed) {
      var newScrollBarY = calculateScrollBarDragY(e);
      var newScrollBoxContentY = calculateNewContentY(grabbedScrollBar, newScrollBarY);
      moveScrollBarViaDrag(newScrollBarY);
      moveScrollBoxContent(grabbedScrollBar.parentElement, newScrollBoxContentY);
    }
  }
  function calculateScrollBarDragY(e) {
    var mouseY = document.all ? window.event.clientY : e.pageY;
    return mouseY - scrollBarOffset;
  }
  function calculateNewContentY(scrollBar, scrollBarY) {
    var scrollBox = scrollBar.parentElement;
    return (scrollBarY * scrollBox.children[1].minContentY) / scrollBar.maxScrollBarY;
  }
  function moveScrollBarViaDrag(newY) {
    if(newY < 0) newY = 0;
    else if(newY > grabbedScrollBar.maxScrollBarY)
      newY = grabbedScrollBar.maxScrollBarY;
    grabbedScrollBar.style.top = newY + 'px';
  }
  function moveScrollBoxContent(scrollBox, newY) {
    var content = scrollBox.children[1];
    if(newY > 0) newY = 0;
    else if(newY < content.minContentY) newY = content.minContentY;
    content.style.top = newY + 'px';
    content.yPos = newY;
  }

  document.onmouseup = dragScrollBarEnd;

  function dragScrollBarEnd() {
    enableContentSelect();
    scrollBarIsGrabbed = false;
  }
  function enableContentSelect() {
    if(scrollBarIsGrabbed) {
      var scrollBox = grabbedScrollBar.parentElement;
      scrollBox.className = scrollBox.className.replace(/\bdisable-select\b/g, '');
    }
  }
  function useOverflowScroll(scrollBox) {
    scrollBox.addEventListener('mouseenter', addOverflowScroll);
    scrollBox.addEventListener('mouseleave', removeOverflowScroll);
  }
  function addOverflowScroll() {
    if(this.scrollHeight > this.clientHeight)
      addClass(this, 'fall-back-scrollbox');
  }
  function removeOverflowScroll() {
    this.className = this.className.replace(/\bfall-back-scrollbox\b/g, '');
  }

  document.onkeydown = keyScroll;

  function keyScroll(e) {
    if(focusedScrollBox != undefined) {
      var delta;
      if(e.keyCode == 40) delta = -maxPixelsPerScroll;
      else if(e.keyCode == 38) delta = maxPixelsPerScroll;
      if(delta != null) scrollViaKey(delta);
    }
  }
  function scrollViaKey(delta) {
    var content = focusedScrollBox.children[1];
    content.yPos += delta;
    keepScrollInBounds(delta, content);
    smoothScrollIfHighDelta(delta, content);
  }
})();

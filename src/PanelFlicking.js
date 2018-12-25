function getPosition(event) {
  const positionKey = 'page';
  const positionX = `${positionKey}X`;
  const positionY = `${positionKey}Y`;
  const { touches, changedTouches } = event;
  if (touches) {
    if (touches.length || changedTouches.length) {
      return { x: changedTouches[0][positionX], y: changedTouches[0][positionY] };
    }
    return { x: touches[0][positionX], y: touches[0][positionY] };
  }
  return { x: event[positionX], y: event[positionY] };
}

class FlickingPanel {
  queue = [];

  index = 0;

  startingPoints = null;

  constructor(element, queue) {
    this.element = element;
    this.queue = queue;
    console.log(element);
    // window.addEventListener('mouseup');
    this.initialize();
  }

  initialize() {
    this.bindEvents();

    const container = global.document.createElement('div');
    container.className = 'container';
    container.style.position = 'relative';
    container.style.top = '0';
    container.style.left = '-100%';
    container.style.transform = 'translate3d(0, 0)';
    container.style.width = '100%';
    container.style.height = '100%';
    // this.element.style.cursor = '-webkit-grab';
    this.element.style.cursor = '-webkit-grab';
    // container.style.float = 'left';
    this.element.appendChild(container);
    this.container = container;
    this.setPanel(0);
  }

  bindEvents() {
    this.element.addEventListener('mouseup', this, false);
    this.element.addEventListener('mousedown', this, false);
    // this.element.addEventListener('mouseenter', this, false);
    this.element.addEventListener('mousemove', this, false);
    // this.element.addEventListener('mouseleave', this, false);
    this.element.addEventListener('touchstart', this, false);
    this.element.addEventListener('touchmove', this, false);
    this.element.addEventListener('touchend', this, false);
    this.element.addEventListener('touchcancel', this, false);
    // this.element.addEventListener('scroll', this, false);
    this.element.addEventListener('transitionend', this, false);
  }

  unbindEvents() {
    this.element.removeEventListener('mouseup', this, false);
    this.element.removeEventListener('mousedown', this, false);
    // this.element.removeEventListener('mouseenter', this, false);
    this.element.removeEventListener('mousemove', this, false);
    // this.element.removeEventListener('mouseleave', this, false);
    this.element.removeEventListener('touchstart', this, false);
    this.element.removeEventListener('touchmove', this, false);
    this.element.removeEventListener('touchend', this, false);
    this.element.removeEventListener('touchcancel', this, false);
    // this.element.removeEventListener('scroll', this, false);
    this.element.removeEventListener('transitionend', this, false);
  }

  handleEvent(event) {
    // if (this.disabled) {
    //   return;
    // }
    // console.log(event.type, event);
    // console.log(event.offsetX, event.offsetY);
    // console.log(event.type, event.target);
    // console.log(this.element, event.target, this.element.contains(event.target));
    // console.log(event.type);
    const isContains = this.element.contains(event.target);
    switch (event.type) {
      case 'touchstart':
      case 'mousedown': {
        if (isContains) {
          this.handleStart(event);
        }
        break;
      }
      case 'touchmove':
      case 'mousemove': {
        this.handleMove(event);
        break;
      }
      case 'touchend':
      case 'mouseup': {
        this.handleEnd(event);
        break;
      }
      case 'touchcancel': {
        console.log('===> touchcancel', event);
        break;
      }
      case 'transitionend': {
        this.handleTransitionEnd(event);
        break;
      }
      // case 'scroll': {
      //   this.handleScroll(event);
      //   break;
      // }
      default: {
        break;
      }
    }
  }

  handleStart(event) {
    // event.preventDefault();
    // event.view.scrollTo(0, 0);
    console.log('start:disabled', this.isMoving);
    if (this.isMoving) {
      return;
    }
    const isContains = this.element.contains(event.target);
    if (!isContains) {
      return;
    }

    // console.log(event.touches.length);
    if (event.touches && event.touches.length === 2) {
      this.startingPoints = null;
      this.currentMove = null;
      console.log('multi touches', event, event.touches);
      return;
    }

    const { x, y } = getPosition(event);
    this.startingPoints = { x, y };
    this.currentMove = null;
    this.element.style.cursor = '-webkit-grabbing';
    console.log('start', x, y);
  }

  handleMove(event) {
    // event.preventDefault();
    // console.log(event);
    // event.view.scrollTo(0, 0);
    console.log('move:isMoving', this.isMoving, this.startingPoints, this.isScrolling);
    // event.stopPropagation();
    // if (this.disabled) {
    //   return;
    // }
    if (!this.startingPoints) {
      return;
    }
    const { x, angle } = this.getMoveOffset(event);
    // console.log(angle);
    // console.log(this.startingPoints, moveX, moveY);
    // console.log(x, event.pageX, event.pageX - x);
    console.log('move', x, angle);
    // event.preventDefault();
    if (this.isMoving) {
      event.preventDefault();
    }

    if (this.isScrolling) {
      return;
    }

    if (angle > 50 && angle < 130) {
      event.preventDefault();
      this.container.style.transform = `translate3d(${x}px, 0px, 0px)`;
      this.container.style.transition = 'transform 0s linear';
      this.container.style.pointerEvents = 'none';
      this.isMoving = true;
      this.isScrolling = false;
      this.element.style.cursor = '-webkit-grabbing';
    } else if (event.type === 'touchmove') {
      this.isScrolling = true;
      // this.startingPoints = null;
    }
  }

  handleEnd(event) {
    // if (this.isScrolling) {
    //   this.isScrolling = false;
    //   return;
    // }
    if (!this.startingPoints) {
      return;
    }
    const { x, y } = this.getMoveOffset(event);
    // console.log('end', this.element, x, y);
    // this.element.style.top = `${y}px`;
    // this.element.style.left = `${x}px`;
    this.startingPoints = null;
    console.log('end', x, y);

    // 거리 계산
    const moveX = Math.abs(x);
    const width = this.element.clientWidth;
    console.log('거리', moveX, width);
    const movePercent = (moveX / width) * 100;
    if (movePercent > 20 && !this.isScrolling) {
      if (x > 0) {
        this.container.style.transform = `translate3d(${width}px, 0px, 0px)`;
        this.currentMove = 'right';
      } else {
        this.container.style.transform = `translate3d(-${width}px, 0px, 0px)`;
        this.currentMove = 'left';
      }
    } else {
      this.container.style.transform = 'translate3d(0px, 0px, 0px)';
    }
    this.container.style.transition = 'transform .15s ease-out';
    this.container.style.pointerEvents = 'auto';
    this.element.style.cursor = '-webkit-grab';
    this.isScrolling = false;
    console.log('end:disabled', this.disabled);
  }

  handleTransitionEnd() {
    this.setChangePanel();
    this.isMoving = false;
    console.log('transitionend');
    console.log('transitionend:disabled', this.disabled);
  }

  handleScroll(event) {
    if (this.startingPoints) {
      console.log('scroll', event);
      event.preventDefault();
    }
  }

  getMoveOffset(event) {
    if (!this.startingPoints) {
      return {};
    }
    const { x, y } = this.startingPoints;
    const { x: pageX, y: pageY } = getPosition(event);
    const moveX = pageX - x;
    const moveY = pageY - y;

    const r = Math.atan2(moveX, moveY);
    const angle = Math.abs(Math.round(r * 180 / Math.PI));

    return { x: moveX, y: moveY, angle };
  }

  setPanel(index) {
    const mainPanel = this.queue[index];
    this.container.appendChild(mainPanel);
    this.mainPanel = mainPanel;

    const lastIndex = this.queue.length - 1;
    const prevPanel = this.queue[index !== 0 ? index - 1 : lastIndex];
    this.container.appendChild(prevPanel);
    this.prevPanel = prevPanel;

    const nextPanel = this.queue[index !== lastIndex ? index + 1 : 0];
    this.container.appendChild(nextPanel);
    this.nextPanel = nextPanel;

    this.index = index;

    this.setChangedPanelStyle();
  }

  setChangePanel() {
    const lastIndex = this.queue.length - 1;
    if (this.currentMove === 'left') {
      // const index = this.index + 1;
      const currentIndex = this.index < lastIndex ? this.index + 1 : 0;
      const nextIndex = currentIndex < lastIndex ? currentIndex + 1 : 0;
      // console.log('currentIndex', currentIndex, nextIndex, lastIndex, index);
      console.group('changed pane:', this.currentMove);
      console.log('index', this.index);
      console.log('currentIndex', currentIndex);
      console.log('nextIndex', nextIndex);
      console.groupEnd();

      this.container.removeChild(this.prevPanel);
      const prevPanel = this.mainPanel;
      this.prevPanel = prevPanel;

      const mainPanel = this.nextPanel;
      this.mainPanel = mainPanel;

      const nextPanel = this.queue[nextIndex];
      this.container.appendChild(nextPanel);
      this.nextPanel = nextPanel;

      this.index = currentIndex;

      this.setChangedPanelStyle();
    } else if (this.currentMove === 'right') {
      // const index = this.index - 1;
      const currentIndex = this.index > 0 ? this.index - 1 : lastIndex;
      const prevIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
      // console.log('currentIndex', currentIndex, prevIndex);

      console.group('changed pane:', this.currentMove);
      console.log('currentIndex', currentIndex);
      console.log('prevIndex', prevIndex);
      console.groupEnd();

      this.container.removeChild(this.nextPanel);
      const nextPanel = this.mainPanel;
      this.nextPanel = nextPanel;

      const mainPanel = this.prevPanel;
      this.mainPanel = mainPanel;

      const prevPanel = this.queue[prevIndex];
      this.container.appendChild(prevPanel);
      this.prevPanel = prevPanel;

      this.index = currentIndex;

      this.setChangedPanelStyle();
    }
  }

  setChangedPanelStyle() {
    this.container.style.transition = '';
    this.container.style.transform = 'translate3d(0px, 0px, 0px)';
    this.container.style.clear = 'both';

    // prev panel
    this.prevPanel.style.position = 'absolute';
    this.prevPanel.style.top = '0';
    this.prevPanel.style.left = '0';
    this.prevPanel.style.width = '100%';
    this.prevPanel.style.transform = 'translate3d(0px, 0px, 0px)';

    // main panel
    this.mainPanel.style.position = 'absolute';
    this.mainPanel.style.top = '0';
    this.mainPanel.style.left = '0';
    this.mainPanel.style.width = '100%';
    this.mainPanel.style.transform = 'translate3d(100%, 0px, 0px)';

    // next panel
    this.nextPanel.style.position = 'absolute';
    this.nextPanel.style.top = '0';
    this.nextPanel.style.left = '0';
    this.nextPanel.style.width = '100%';
    this.nextPanel.style.transform = 'translate3d(200%, 0px, 0px)';

    this.currentMove = null;

    this.transitionEnd = true;
  }
}

export default FlickingPanel;

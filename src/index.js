import FlickingPanel from './PanelFlicking';

// const root = document.getElementById('handle');
// // root.addEventListener('mouse');
// console.log(root);
// new PaneFlicking(root);

function createPanel(text, src) {
  const fragment = global.document.createDocumentFragment();
  const element = global.document.createElement('div');
  const panelText = global.document.createTextNode(text);
  // image.src = src;
  element.appendChild(panelText);
  element.className = 'panel';
  element.style.background = 'no-repeat 50% 0 / cover';
  element.style.backgroundImage = `url(${src})`;
  element.style.height = '100vh';
  element.style.fontSize = '5em';
  element.style.textAlign = 'center';
  element.style.textShadow = '0 0 3px #fff';
  fragment.appendChild(element);
  return element;
}

const flicking = global.document.getElementById('flicking');
// const queue = [
//   createPanel('panel 1', 'http://placekitten.com/414/736'),
//   createPanel('panel 2', 'http://placekitten.com/414/737'),
//   createPanel('panel 3', 'http://placekitten.com/414/738'),
//   createPanel('panel 4', 'http://placekitten.com/414/739'),
//   createPanel('panel 5', 'http://placekitten.com/414/740'),
//   createPanel('panel 6', 'http://placekitten.com/414/741'),
//   createPanel('panel 7', 'http://placekitten.com/414/742'),
//   createPanel('panel 8', 'http://placekitten.com/414/743'),
//   createPanel('panel 9', 'http://placekitten.com/414/744'),
//   createPanel('panel 10', 'http://placekitten.com/414/746'),
// ];
const queue = Array(50).fill().map((value, index) => (
  createPanel(`panel ${index}`, `http://placekitten.com/450/${736 + index}`)));

const panels = new FlickingPanel(flicking, queue);
console.log(panels);

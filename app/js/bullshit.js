import {each} from 'lodash/fp';


// bullshit to Remove surrounding p tags from images in article.
const nodes = document.body.querySelectorAll('article p img');

each(node => {
  const pn = node.parentNode;
  if (pn.childNodes.length === 1) {
    pn.replaceWith(...pn.childNodes);
  }
})(nodes);

//
// // bullshit to set the card font size based on container width
// const setScaledFont = (f, el) => {
//   const s = el.parentNode.offsetWidth;
//   const fs = s * f;
//   if (fs > 14) {
//     el.style.fontSize = fs + 'px'; //eslint-disable-line
//   } else {
//     el.style.fontSize = '14px'; //eslint-disable-line
//   }
// };
//
// each(el => setScaledFont(0.06, el), document.body.querySelectorAll('.tcontent'));
// each(el => setScaledFont(0.03, el), document.body.querySelectorAll('.card-body'));
//
// window.onresize = () => {
//   each(el => setScaledFont(0.06, el), document.body.querySelectorAll('.tcontent'));
//   each(el => setScaledFont(0.03, el), document.body.querySelectorAll('.card-body'));
// };

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function l2distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function l1distance(x1, y1, x2, y2) {

}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

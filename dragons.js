(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
}());

(function () {

  var dragon,
    dragonImage,
    canvas, context;


  function gameLoop() {

    window.requestAnimationFrame(gameLoop);

    dragon.update();
    dragon.render();
  }

  function sprite(options) {

    var that = {},
      frameIndex = 0,
      tickCount = 0,
      ticksPerFrame = options.ticksPerFrame || 0,
      rowsInSheet = options.rowsInSheet || 1;
      columnsInSheet = options.columnsInSheet || 1;
      xIndex = 0;
      yIndex = 0;
      direction = 1;

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    that.update = function () {
      tickCount += 1;
      if (tickCount > ticksPerFrame) {
        frameIndex += direction;
        tickCount = 0;
        if (frameIndex < rowsInSheet * columnsInSheet && frameIndex >= 0) {
          that.xIndex = frameIndex % rowsInSheet;
          that.yIndex = Math.floor(frameIndex / columnsInSheet);
//          console.log('frameIndex [' + frameIndex + ']');
//          console.log('x = [' + that.xIndex + ']');
//          console.log('y = [' + that.yIndex + ']');
        } else {
          direction = direction * -1;
        }
      }
    };

    that.render = function () {
      that.context.clearRect(0, 0, that.width, that.height);
      that.context.drawImage(
        that.image,
          that.xIndex * that.width,
          that.yIndex * that.height,
        that.width,
        that.height,
        0,
        0,
        that.width,
        that.height);
    };

    return that;
  }

  // Get canvas
  canvas = document.getElementById("dragonAnimation");
  canvas.width = 600;
  canvas.height = 600;
  context = canvas.getContext("2d")
  // Create sprite sheet
  dragonImage = new Image();
  context.translate(100, 100);
  // context.rotate(Math.PI / 4);

  // Create sprite
  dragon = sprite({
    context: context,
    width: 200,
    height: 200,
    image: dragonImage,
    rowsInSheet: 3,
    columnsInSheet: 3,
    ticksPerFrame: 3
  });

  // Load sprite sheet
  dragonImage.addEventListener("load", gameLoop);
  dragonImage.src = "images/dragons.png";

}());



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
    wingDirection = 1;

    xPosition = 100;
    yPosition = 100;
    xDirection = -1;
    yDirection = -1;

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    that.update = function () {
      tickCount += 1;
      xPosition += xDirection;
      yPosition += yDirection;
      if (tickCount > ticksPerFrame) {
        frameIndex += wingDirection;
        tickCount = 0;
        if (frameIndex < rowsInSheet * columnsInSheet && frameIndex >= 0) {
          that.xIndex = frameIndex % rowsInSheet;
          that.yIndex = Math.floor(frameIndex / columnsInSheet);
        } else {
          wingDirection = wingDirection * -1;
        }
      }
    };

    that.follow = function(mouseX, mouseY) {
      if (mouseX > xPosition) {
         xDirection = 1;
      } else {
         xDirection = -1;
      }
      if (mouseY > yPosition) {
         yDirection = 1;
      } else {
         yDirection = -1;
      }
      console.log('Current Position [' + xPosition + "," + yPosition + "]");
      console.log('Mouse Position [' + mouseX + "," + mouseY + "]");
      console.log('Following [' + xDirection + "," + yDirection + "]");
    };

    that.render = function () {
      that.context.clearRect(0, 0, 1200, 1200);
      that.context.drawImage(
        that.image,
        that.xIndex * that.width,
        that.yIndex * that.height,
        that.width,
        that.height,
        xPosition,
        yPosition,
        that.width,
        that.height);
    };
    return that;
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // Get canvas
  canvas = document.getElementById("dragonAnimation");
  canvas.width = 1200;
  canvas.height = 1200;
  context = canvas.getContext("2d")

  // Create sprite sheet
  dragonImage = new Image();
  // context.translate(100, 100);
  // context.rotate(Math.PI / 4);

  // Create sprite
  dragon = sprite({
    context: context,
    width: 200,
    height: 200,
    image: dragonImage,
    rowsInSheet: 3,
    columnsInSheet: 3,
    ticksPerFrame: 1
  });

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    dragon.follow(mousePos.x, mousePos.y);
  }, false);

  // Load sprite sheet
  dragonImage.addEventListener("load", gameLoop);
  dragonImage.src = "images/fire" +
    "_dragon.png";

}());



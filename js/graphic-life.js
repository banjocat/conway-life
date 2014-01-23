

var stage = new PIXI.Stage(0x66FF99);
var graphics = new PIXI.Graphics();
var box_size = 10;
var XMAX = 40;
var YMAX = 25;
var BOX_COLOR = 0x222222;
var BACKGROUND_COLOR = 0x66FF99;
var WIDTH = box_size * XMAX;
var HEIGHT = box_size * YMAX;

stage.addChild(graphics);

var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

$('body').append(renderer.view);



var life = new Life({
    xmax: XMAX,
    ymax: YMAX,
    initial: "random",
    on_life: function(x, y) {
        var newx = box_size * x;
        var newy = box_size * y;
        graphics.beginFill(BOX_COLOR);
        graphics.drawRect(newx, newy, box_size, box_size);
        graphics.endFill();
    },
    on_death: function(x, y) {
        var newx = box_size * x;
        var newy = box_size * y;
        graphics.beginFill(BACKGROUND_COLOR);
        graphics.drawRect(newx, newy, box_size, box_size);
        graphics.endFill();
    },
    random_chance_of_life: 30,
});


var counter = 0;
function animate()
{
    counter += 1;
    if (counter % 20 !== 0) {
        requestAnimFrame(animate);
        return;
    }
   
    graphics.clear(); 
    life.run();
    renderer.render(stage);
        requestAnimFrame(animate);
}

requestAnimFrame(animate);

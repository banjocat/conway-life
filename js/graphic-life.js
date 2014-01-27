(function() {

    function GraphicLife(selector, _options) {

        var options = {};

        options.xmax = 50;
        options.ymax = 50;
        options.box_color = 0x222222;
        options.background_color = 0x66FF99;
        options.box_size = 10;
        options.initial = "random";
        _.extend(options, _options);

        // Private variables
        var stage = new PIXI.Stage(options.background_color);
        var graphics = new PIXI.Graphics();
        var algorithm_running = false;
        var fps_counter = 0;
        var stop = true;
        var WIDTH = options.box_size * options.xmax;
        var HEIGHT = options.box_size * options.ymax;
        var renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT);
        stage.addChild(graphics);

        $(selector).append(renderer.view);

        var determine_color = function() {
            if (options.box_color instanceof Array) {
                var rand = Math.floor(Math.random()*options.box_color.length);
                return options.box_color[rand];
            }
            else
                return options.box_color;
        }
        var life = {};

        var initialize = function() {
            life = new Life({
            xmax: options.xmax,
            ymax: options.ymax,
            initial: options.initial,
            on_life: function(x, y) {
                var newx = options.box_size * x;
                var newy = options.box_size * y;
                graphics.beginFill(determine_color());
                graphics.drawRect(
                    newx, newy, 
                    options.box_size, options.box_size);
                graphics.endFill();
            },
            on_death: function(x, y) {
                var newx = options.box_size * x;
                var newy = options.box_size * y;
                graphics.beginFill(options.background_color);
                graphics.drawRect(
                    newx, newy, 
                    options.box_size, options.box_size);
                graphics.endFill();
            },
            random_chance_of_life: 30,
        });
        renderer.render(stage);
        graphics.clear();
        };
        

        // Events are used to make run not affect the fps
        // It still will if it takes too long to run on
        // very large boards
        $(renderer.view).on("run_life", function() {
            life.run();
            algorithm_running = false;
        });

        var animate = function()
        {
            fps_counter += 1;
            if (fps_counter === 2) {
                algorithm_running = true;
                $(renderer.view).trigger("run_life");
            }
            else if (fps_counter === 4) {
                // Just incase its not done yet
                // Wait till it is finished
                while (algorithm_running) ;
                renderer.render(stage);
                graphics.clear();
                fps_counter = 0;
            } 
            requestAnimFrame(animate);
        }

        this.restart = function() {
            graphics.clear();
            initialize();
        }

        initialize();
        requestAnimFrame(animate);
        return this;
    }

    $.fn.Life = function(options) {
        var life = new GraphicLife(this, options);
        return life;
    }
})();

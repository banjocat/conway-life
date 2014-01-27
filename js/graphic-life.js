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
        var fps_counter = 0;
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
        

        // Events that are called during the animation sequence
        $(renderer.view).on("run_life", function() {
            // Runs the life algorithm one time
            life.run();
        });
    
        $(renderer.view).on("restart", function() {
            graphics.clear();
            initialize();
        });
        
        $(renderer.view).on("draw_life", function() {
            renderer.render(stage);
            graphics.clear();
            fps_counter = 0;
        });

        // requestAnimFrame tries to get 60 fps 
        // But this will depend on other factors if it achieves this
        // This makes the goal based on what I have 15 lifes per second
        // Events are used to attempt to make browsers treat the main loop
        // and drawing/caculation as two seperate threads... though this depends
        // on which browser is used. It may do nothing if just one thread is used.
        // Events at least will prevent any race conditions from happening
        var animate = function()
        {
            fps_counter += 1;
            // running life is done before drawining
            // This is to try to give the life algorithim
            // a little more time before it has to be drawn.
            // If it takes too long drawing will still have to wait
            // for the life algorithm to finish
            if (fps_counter === 1) {
                $(renderer.view).trigger("run_life");
            }
            else if (fps_counter === 4) {
                $(renderer.view).trigger("draw_life");
            } 
            requestAnimFrame(animate);
        }

        this.restart = function() {
            $(renderer.view).trigger("restart");
        }

        initialize();
        requestAnimFrame(animate);
        return this;
    }

    // Jquery plugin creation
    $.fn.Life = function(options) {
        var life = new GraphicLife(this, options);
        return life;
    }
})();

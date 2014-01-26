

/*
 * Simple Algorithm
 * Start at 0,0
 * Read all neighboring
 * If all it is less than 0 make it 0
 * If it is 2 keep it the same
 * If it is more than 2 make it 1
 * do for next one
 */


/* THIS IS WHAT WAS USED
 * Fancy algorithm
 * Start at 0,0
 * If it is 0 skip
 * if it is 1 add 1 to count array to all neighboring values
 * if any of those values are 2 make it the same value
 * if any of those values are now 3 make it a 1
 * If anyy are greater than 3 put it back to 0
 * Make an array of all 1s, use this list to determine what points to check
 */


function Life(_options) 
{
    // Constructor
    var options = {
        xmax:undefined, // x length required
        ymax:undefined, // y length required
        initial: 'random', // initial values "zeros" "ones" "random"
        random_chance_of_life: 25, // When initial random is chosen this is the chance of it being a 1
        // Callback for when the new board has life given takes (x ,y)
        on_life: undefined,
        // Callback for when a new board gets overpopulated and is not switched back to off
        // Values that never get switched on are never checked and should be assuemd dead
        on_death: undefined, 
    };
    _.extend(options, _options);
    if (options.xmax === undefined) {
        console.error("xmax required in Life");
        return false;
    }
    if (options.ymax === undefined) {
        console.error("ymax required in Life");
        return false;
    }

    // variables
    var 
        // the current board
        current_board = [],         
        // the amount of adjacent live cells a cell has
        counter = [],   
        // the new board to replace the old      
        new_board = [], 
        // values in the current board 
        current_values_with_ones = [],
        // values of hte new board that have ones
        new_values_with_ones = []; 

    // Takes an index 
    // returns an array of its x and y values
    var convert_to_2d = function(index) {
        var val = [];
        val.push(index % options.xmax);
        val.push(Math.floor(index / options.ymax));
        return val;
    }

    current_board.length = options.xmax * options.ymax;
    new_board.length = options.ymax * options.xmax;
    // Set unset, and get allow setting/accessing of the current index
    this.set = function(index)
    {
        current_board[index] = 1;
        current_values_with_ones.push(index);
        if (options.on_life) {
            var arg = convert_to_2d(index);
            options.on_life(arg[0], arg[1]);
        }
    }
    this.unset = function(index)
    {
        current_board[index] = 0;
        current_values_with_ones = _.without(
                current_values_with_ones, index);
        if (options.on_death) {
            var arg = convert_to_2d(index);
            options.on_death(arg[0], arg[1]);
        }
    }
    this.get = function(index)
    {
        return current_board[index];
    }

    // Runs initialization
    if (options.initial === "random") {
        for (var j = 0; j < current_board.length; j++) {
            var chance = Math.floor(Math.random()*100);
            if (chance <= options.random_chance_of_life)
                this.set(j);
        }
    }

    // Functions for getting the index of neighboring cells
    this.left_cell = function(cell)
    {
        if (cell < 0 || cell % options.xmax == 0)
            return -1;
        return cell - 1;
    }
    this.right_cell = function(cell)
    {
        var ret = cell + 1;
        if (ret >= current_board.length
                || ret % options.xmax == 0)
            return -1;
        return ret;
    }
    this.top_cell = function(cell)
    {
        var ret = cell - options.xmax;
        if (ret < 0)
            return -1;
        return ret;
    }
    this.bottom_cell = function(cell)
    {
        var ret = cell + options.xmax;
        if (ret >= current_board.length)
            return -1;
        return ret;
    }
    this.top_left_cell = function(cell)
    {
        var ret = cell - 1;
        if (cell < 0 || cell % options.xmax == 0)
            return -1;
        ret -= options.xmax;
        if (ret < 0)
            return -1;
        return ret;
    }
    this.bottom_left_cell = function(cell)
    {
        var ret = cell - 1;
        if (cell < 0 || cell % options.xmax == 0)
            return -1;
        ret += options.xmax;
        if (ret >= current_board.length)
            return -1;
        return ret;
    }
    this.top_right_cell = function(cell)
    {
        var ret = cell + 1;
        if (ret >= current_board.length
                || ret % options.xmax == 0)
            return -1;
        ret -= options.xmax;
        if (ret < 0)
            return -1;
        return ret;
    }
    this.bottom_right_cell = function(cell)
    {
        var ret = cell + 1
        if (ret >= current_board.length
                || ret % options.xmax == 0)
            return -1;
        ret += options.xmax;
        if (ret >= current_board.length)
            return -1;
        return ret;
    }

    // Used for debugging
    // Gets the array of the current board
    this.get_board = function() {
        return current_board;
    }

    // Runs the counter
    // It returns the counter which is used for debugging
    this.run_counter = function()
    {
        counter = [];
        for (var i = 0; 
                i < current_values_with_ones.length;
                i += 1) {
                    this.add_valid_cells(
                            current_values_with_ones[i]);
        }
        return counter;
    }

    // Gets an array of all the valid indexes adjacent
    // to the specific cell
    this.add_valid_cells = function(cell)
    {
        // Adds to the counter if valid
        // Then changes the value on the new board
        // to follow the rules of life
        // This is called for each adjancent cell
        var add_counter_if_valid = function(i) {
            if (i === -1)
                return;

            if (!counter[i] 
                    || counter[i] === 0)
                counter[i] = 1;
            else
                counter[i] += 1;

            if (counter[i] === 2 
                    && current_board[i] === 1) {
                        new_board[i] = 1;
                        if (options.on_life) {
                            var arg = convert_to_2d(i);
                            options.on_life(arg[0], arg[1]);
                        }
                        new_values_with_ones.push(i);
                    }
            else if (counter[i] === 3 && new_board[i] !== 1) {
                new_board[i] = 1;
                if (options.on_life) {
                    var arg = convert_to_2d(i);
                    options.on_life(arg[0], arg[1]);
                }
                new_values_with_ones.push(i);
            }
            else if (counter[i] > 3 && new_board[i]) {
                new_board[i] = undefined;
                new_values_with_ones =
                    _.without(new_values_with_ones, i);
                if (options.on_death) {
                    var arg = convert_to_2d(i);
                    options.on_death(arg[0], arg[1]);
                }
            }
        }
        add_counter_if_valid(this.left_cell(cell));
        add_counter_if_valid(this.right_cell(cell));
        add_counter_if_valid(this.bottom_cell(cell));
        add_counter_if_valid(this.top_cell(cell));
        add_counter_if_valid(this.top_left_cell(cell));
        add_counter_if_valid(this.bottom_left_cell(cell));
        add_counter_if_valid(this.top_right_cell(cell));
        add_counter_if_valid(this.bottom_right_cell(cell));
    }


    // Runs life for one iteration
    this.run = function(_settings)
    {
        var start_time = new Date();
        this.run_counter();
        current_board = new_board;
        current_values_with_ones = new_values_with_ones;
        new_values_with_ones = [];
        new_board = [];
        new_board.length = options.xmax * options.ymax;
        console.log(
                'Life ran in', 
                new Date() - start_time,
                'ms');
    }

    return this;
}                



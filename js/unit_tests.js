

test ( "accessing cells on a 10x10 board", function() {
    var life = Life({
        xmax:10, // Sets the max x length
        ymax:10, // Sets the max y length
        initial: "zeros", // Starting values, "zeros", "ones", "random"
    });

    // Tests boundries
    ok ( 0 == life.left_cell(1));
    ok ( -1 == life.left_cell(10));
    ok ( 10 == life.left_cell(11));
    ok ( 9 == life.right_cell(8));
    ok ( -1 == life.right_cell(9));
    ok ( -1 == life.right_cell(19));
    ok ( -1 == life.top_cell(0));
    ok ( 0 == life.top_cell(10));
    ok ( 9 == life.top_cell(19));
    ok ( 10 == life.bottom_cell(0));
    ok ( -1 == life.bottom_cell(95));
    ok ( 0 == life.top_left_cell(11));
    ok ( -1 == life.top_left_cell(0));
    ok ( -1 == life.top_left_cell(10));
    ok ( -1 == life.top_left_cell(1));
    ok ( -1 == life.bottom_left_cell(0));
    ok ( 10 == life.bottom_left_cell(1));
    ok ( -1 == life.bottom_left_cell(98));
    ok ( -1 == life.top_right_cell(8));
    ok ( -1 == life.top_right_cell(19));
    ok ( 9 == life.top_right_cell(18));
    ok ( -1 == life.bottom_right_cell(9));
    ok ( -1 == life.bottom_right_cell(95));
    ok ( 11 == life.bottom_right_cell(0));

});

test ( "Accessing cells on a 6x5 board", function() {
    var life = new Life({
        xmax:6,
        ymax:5,
        initia: "zeros"
    });

    ok (3 == life.top_cell(9));
    ok (4 == life.top_right_cell(9));
    ok (8 == life.left_cell(9));
    ok (10 == life.right_cell(9));
    ok (14 == life.bottom_left_cell(9));
    ok (15 == life.bottom_cell(9));
    ok (16 == life.bottom_right_cell(9));
});

test ( "Counting of neighboring cells", function() {
    var life = new Life({
        xmax:10, // Sets the max x length
        ymax:10, // Sets the max y length
        initial: "zeros", // Starting values, "zeros", "ones", "random"
    });

    var counter = [];
    life.set(1);
    counter = life.run_counter();
    ok (counter[0] == 1);
    ok (counter[1] == undefined);
    ok (counter[2] == 1);
    ok (counter[10] == 1);
    ok (counter[11] == 1);
    ok (counter[12] == 1);
    ok (counter[13] == undefined);
    ok (counter[14] == undefined);
    ok (counter[3] == undefined);
  
    
    life.unset(1);
    life.set(12);
    counter = life.run_counter();
    ok (counter[12] == undefined);
    ok (counter[13] == 1);
    ok (counter[11] == 1);
    ok (counter[2] == 1);
    ok (counter[1] == 1);
    ok (counter[3] == 1);
    ok (counter[22] == 1);
    ok (counter[23] == 1);
    ok (counter[21] == 1);
});

test ( "test a full run with 3 top neighboring cells on", function() { var life = new Life({
        xmax:10, // Sets the max x length
        ymax:10, // Sets the max y length
        initial: "zeros", // Starting values, "zeros", "ones", "random"
    });

    life.set(1);
    life.set(2);
    life.set(3);
    life.run();
    ok (undefined == life.get(0));
    ok (undefined == life.get(1));
    ok (1 == life.get(2));
    ok (undefined == life.get(3));
    ok (undefined == life.get(11));
    ok (1 == life.get(12));
    ok (undefined == life.get(13));
    ok (undefined == life.get(10));
    ok (undefined == life.get(14));
});

test ( "Static beehive pattern", function() {
    var life = new Life({
        xmax: 6,
        ymax:5,
        initial: "zeros"
    });

    console.log("Running behive");
    life.set(8);
    life.set(9);
    life.set(13);
    life.set(16);
    life.set(20);
    life.set(21);
    console.log(life.get_board());
    life.run();
    ok (1 == life.get(8));
    ok (1 == life.get(9));
    ok (1 == life.get(13));
    ok (1 == life.get(16));
    ok (1 == life.get(20));
    ok (1 == life.get(21));
    console.log(life.get_board());
    life.run();
    ok (1 == life.get(8));
    ok (1 == life.get(9));
    ok (1 == life.get(13));
    ok (1 == life.get(16));
    ok (1 == life.get(20));
    ok (1 == life.get(21));
    console.log(life.get_board());
    console.log("Behive done");
});

test ( "The blinker pattern", function() {
    var life = new Life({
        xmax:5,
        ymax:5,
        initial: "zeros"
    });

    life.set(7);
    life.set(12);
    life.set(17);
    life.run();
    ok (1 == life.get(11));
    ok (1 == life.get(12));
    ok (1 == life.get(13));
    ok (undefined == life.get(7)); 
    ok (undefined == life.get(17));
    life.run();
    ok (undefined == life.get(11));
    ok (1 == life.get(12));
    ok (undefined == life.get(13));
    ok (1 == life.get(7)); 
    ok (1 == life.get(17));
    life.run();
    ok (1 == life.get(11));
    ok (1 == life.get(12));
    ok (1 == life.get(13));
    ok (undefined == life.get(7)); 
    ok (undefined == life.get(17));
});

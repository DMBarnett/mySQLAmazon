var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    purchase()
});

function purchase(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        res.forEach(each =>{
            console.log(`
                Item ID: ${each.item_id} || Item Name: ${each.product_name}
            `)
        })
        inquirer.prompt([
            {
                type:"list",
                name:"choice",
                message:"Which would you like to purchase?",
                choices: function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
            },{
                type:"input",
                name:"quantity",
                message:"How many would you like to purchase?"
            }
        ]).then(function(results){
            var chosen = {};
            console.log(res);
            console.log("dog");
            res.forEach(element =>{
                if(element.product_name === results.choice){
                    chosen = element;
                    console.log(chosen);
                }
            })
            if(results.quantity > chosen.stock_quantity){
                console.log(`\nThat's too many! We only have ${chosen.stock_quantity} available.`);
                purchase();
            }else{
                console.log(results);
                console.log(chosen.stock_quantity);
                var foo = results.quantity*chosen.price;
                console.log(`
                Your purchase will cost ${foo} dollars.
                Your order of ${results.choice} will be delivered this week!
                `)
                var bar = chosen.stock_quantity-results.quantity
                console.log(bar)
                console.log(chosen.item_id);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{stock_quantity: bar}, {item_id: chosen.item_id}], 
                    function(err, res){
                        if(err) throw err;
                        console.log(res.affectedRows + " record(s) updated")
                    }
                )
                purchase();
            }
        })
    })
}
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
    database: "amazonstore"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    login()
});

//Global to save the username once passed in from the login function
var loggedIn = "";
var users = [];
var adminUsers = [];

//Pulls all users from database when called
function userFuncArr(input){
    connection.query("SELECT * FROM users", function(err, results){
        if(err) throw err;
        console.log("\n\n");
        for (var i = 0; i < results.length; i++) {
            users.push(results[i].name);
        }
        users.forEach(each =>{
            if(each === input.name){
                loggedIn = input.name;
                userFunctions()
            }
        })
        console.log("Incorrect Username");
        connection.end()
    })
}


//pulls admin usernames from database and checks against inputs 
function adminFuncArr(input){
    connection.query("SELECT * FROM admin_users", function(err, results){
        if(err) throw err;
        console.log("\n\n");
        for (var i = 0; i < results.length; i++) {
            adminUsers.push(results[i].adminName);
        }
        adminUsers.forEach(each =>{
            if(each === input.name){
                loggedIn = input.name;
                adminFunctions()
            }
        })
    })
}

//Simple login, no passwords but it checks for usernames
function login(){
    inquirer.prompt([
        {
            name:"name",
            type:"input",
            message:"What is your username?\n"
        },
        {
            name:"choice",
            type:"list",
            message: "\nAre you an Admin or a User?\n",
            choices:["Admin","User"]
        }
    ]).then(function(res){
        if(res.choice === "Admin"){
            adminFuncArr(res);
        }else{
            userFuncArr(res);
        }
    })
}


//Abilities of an Admin
//Also functions as the home screen, after executing a module of Admin returns here
function adminFunctions(){
    inquirer.prompt([
        {
            name: "options",
            type:"list",
            choices:[
                "View Products for Sale", 
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Logout"
            ],
            message:"What would you like to do?"
        }
    ]).then(function(res){
        console.log("peach");
        if(res.options === "View Products for Sale"){
            logProductsToScreen("all")
        }else if(res.options === "View Low Inventory"){
            logProductsToScreen("low")
        }else if(res.options === "Add to Inventory"){
            increaseInventory();
        }else if(res.options === "Add New Product"){
            newProduct();
        }else if(res.options === "Logout"){
            return connection.end()
        }
    })
}

function userFunctions(){
    inquirer.prompt([
        {
            name:"choice",
            type:"list",
            message:"\nWhat would you like to do?\n",
            choices: ["Buy from inventory","Look at purchase history","Logout"]
        }
    ]).then(function(res){
        if(res.choice === "Buy from inventory"){
            purchase();
        }else if(res.choice === "Look at purchase history"){
            reviewPurchases();
        }else {
            return connection.end()
        }
    })
}

function purchase(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        inquirer.prompt([
            {
                type:"list",
                name:"choice",
                message:"Which would you like to purchase?",
                choices: function(){
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        // console.log(results[i]);
                        
                        choiceArray.push(results[i].item_id.toString());
                    }
                    // console.log(choiceArray);
                    return choiceArray;
                },
            },{
                type:"input",
                name:"quantity",
                message:"How many would you like to purchase?"
            }
        ]).then(function(results){
            var chosen = {};
            res.forEach(element =>{
                if(element.name === results.choice){
                    chosen = element;
                    console.log(chosen);
                }
            })
            if(results.quantity > chosen.stock_quantity){
                console.log(`\nThat's too many! We only have ${chosen.stock_quantity} available.`);
                purchase();
            }else{

            }
        })
    })
}


function logProductsToScreen(input){
    if(input === "all"){
        connection.query("SELECT * FROM products", function(err, res){
            if(err) throw err;
            res.forEach(element =>{
                console.log(`
                Item ID: ${element.item_id} || Item Name: ${element.product_name}\n
                `)
            })
        })
        adminFunctions();
    }else if(input === "low"){
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
            if(err) throw err;
            res.forEach(element =>{
                console.log(`
                Item ID: ${element.item_id} || Item Name: ${element.product_name} || Quantity: ${element.stock_quantity}\n
                `)
            })
        })
        adminFunctions()
    }
}

function increaseInventory(){
    var foo = [];
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        foo = res;
    })
    inquirer.prompt([
        {
            name: "items",
            type: "list",
            message:"What item would you like to reorder?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < foo.length; i++) {
                    choiceArray.push(foo[i].product_name);
                }
                return choiceArray;
            },
        },
        {
            name:"quantity",
            type:"input",
            message: "How many would you like to order?"
        }
    ]).then(function(res){
        var bar = parseInt(res.quantity);
        var working ={};
        foo.forEach(element =>{
            if(element.name === res.items){
                working = element;
            }
        })
        bar = bar+working.stock_quantity;
        connection.query(
            "UPDATE products SET stock_quantity = ? WHERE item_id = ?", 
            [bar, itemID], 
            function(err, res){
                if(err) throw err;
                console.log(`${bar} of ${working.name} now in stock`);
            })
    })
}

function newProduct(){
    inquirer.prompt([
        {
            name:"name",
            type:"input",
            message:"\nWhat is the name of the new product?"
        },
        {
            name:"price",
            type:"input",
            message:"What is the price of the new product?"
        },
        {
            name:"quantity",
            type:"input",
            message:"How many do we have?"
        },
        {
            name:"dept",
            type:"input",
            message:"What department is this going to be sold in?"
        },
    ]).then(function(res){
        res.price = parseInt(res.price);
        res.quantity = parseInt(res.quantity);
        connection.query(
            "INSERT INTO products(product_name, department_name, price, stock_quantity) "+ 
            "VALUES(?, ?, ?, ?)",
            [res.name, res.dept, res.price, res.quantity], 
            function(err, res){
                if(err) throw err;
        })
        adminFunctions();
    })
}
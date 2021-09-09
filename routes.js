// require all dependencies , set up server
const express= require("express");
const app= express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = 3000;

// Start server to listen for request
app.listen(PORT, function(){
    console.log("App is running on Port " + PORT);
});


//Database setup

const Sequelize = require("sequelize");
const { HostNotFoundError } = require("sequelize");
const sequelize = new Sequelize({
    //host: 'local host', -- only need to use this if you are using mySql
    dialect: 'sqlite', //if you were using mySQL, the dialect would be mySQL
    storage: './database.sqlite' //identifies where the data will be added -- database.sqlite is a local file in our sequelize folder
});

//authenticate database 
//.then and .catch are callbacks that listen for errors 
//if or else
//.authenticate is making sure that the database is connected
sequelize.authenticate()
.then(()=>{
    console.log('Connection has been estabalished successfully')
})
.catch(err=> {
    console.error('Unable to connect to the database:', err);
})

//setup model for mapping
//we need to create a table - 
const Meal= sequelize.define('meal',{
    name: Sequelize.STRING,
    ingredients: Sequelize.STRING,
    calories: Sequelize.INTEGER,
    date: Sequelize.STRING,
    healthy: Sequelize.BOOLEAN
});

//Create Notes and Add Data
//.sync is adding all the defined models to the database
//'force flag' if a table exists already, it will drop it and create a new one
sequelize.sync({ force:true })
.then(() => {
    //if the table is syncing correctly, it will show this message:
    console.log('Database and tables have been created')

    //bulkCreate allows us to create numerous categories(notes) in the same function
    //allows you to insert your data
    Meal.bulkCreate([
        {name: 'salad', ingredients: 'spinach, chickpeas, strawberries', calories: '350', date: 'Tuesday 9/7', healthy: true},
        {name: 'pizza', ingredients: 'cheese, crust, tomato sauce', calories: '500', date: 'Monday 9/6', healthy: false},
        {name: 'smoothie', ingredients: 'spinach, peanut butter, almond milk, blueberries', calories: '450', date: 'Monday 9/6', healthy: true},
        {name: 'stir fry', ingredients: 'broccoli, tofu, rice, soy sauce, sriracha', calories: '550', date: 'Sunday 9/5', healthy: true}
    ]).then(function(){
        //find all notes or data in your database
        return Meal.findAll();
    }).then(function(notes){
        console.log(notes);
    });
});

//routes
app.get('/', (req,res) => res.send('This is the home page for my app'));

//Reading ALL Entities
//findAll is a built in method for sequelize
//it will find all records in your database
//it finds all of the Notes I wrote above
app.get('/meals', function(req,res){
    Meal.findAll().then(notes => res.json(notes));
});

//Reading entities WHERE
//WHERE serves a single object from the database
//you can target one specific ID

app.get('/meals/:id', function(req,res) {
    Meal.findAll({ where: { id:req.params.id} }).then(meal => res.json(meal));
});


//how you would set up a post route:
app.post('/meals', function(req,res) {
    Note.create({
        name: req.body.name, ingredients: req.body.ingredients, calories: req.body.calories, date: req.body.date, healthy: req.body.healthy
    }).then(function(meal){
    res.json(meal)
    console.log('you added a meal');
    });
});

//so if  you put in localhost:3000/notes/2 - it will show you the data for the second note

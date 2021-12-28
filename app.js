//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose= require("mongoose")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemSchema = {
  name : "String"
}

const Item= mongoose.model("Item", itemSchema)

const item1 = new Item({
  name : "Buy Pen"
})

const item2 = new Item({
  name : "Wash Clothes"
})

const item3 = new Item({
  name : "Complete Assignment"
})

const defaultItems =[item1, item2, item3]



app.get("/", function(req, res) {

const day = date.getDate();

Item.find(function(err, storedItems){

  if(storedItems.length ===0){
    Item.insertMany(defaultItems, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Successfully rendered");
  }
}) 
res.redirect("/");
  }else{
  res.render("list", {listTitle: day, newListItems: storedItems});
  }
})
});

app.post("/", function(req, res){

  const item = req.body.newItem;

  const newData=new Item({
    name: item
  })

  newData.save();
  res.redirect("/")

});


app.post("/remove", function(req, res){
  Item.deleteOne({name:req.body.checkbox}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Deleted successfully");
    }
    res.redirect("/")
  })
})
app.get("/posts/:newPage", function(req,res){
  console.log(req.params.newPage);
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

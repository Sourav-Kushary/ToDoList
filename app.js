//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose= require("mongoose")
const app = express();
const _ = require("lodash")

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

const listSchema = {
  name : "String",
  items : [itemSchema]
}

const List = mongoose.model("list", listSchema)

app.get("/", function(req, res) {

//const day = date.getDate();

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
  res.render("list", {listTitle: "Today", newListItems: storedItems});
  }
})
});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName= req.body.list;
  const newData=new Item({
    name: item
  })

  //const day = date.getDate();
 
  if(listName=='Today'){
    
  newData.save();
  res.redirect("/")

   }else{
      List.findOne({name: listName}, function(err, foundItem){
      foundItem.items.push(newData)
      foundItem.save()
      res.redirect("/" + listName)
    })
  }

  
});


app.post("/remove", function(req, res){

  listName=req.body.listName;

  if(listName=='Today'){
    
    Item.deleteOne({name:req.body.checkbox}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Deleted successfully");
      }
      res.redirect("/")
    })
  
    }else{
      List.findOneAndUpdate({name:listName}, {$pull: {items : {name:req.body.checkbox}}}, function(err, result){
        if(!err){
         
        res.redirect("/"+ listName)
      }
    })
  } 
})
app.get("/:customPage", function(req,res){
  const customListName = _.capitalize(req.params.customPage);

  List.findOne({name : customListName}, function(err, foundItem){
    if(!err){
      if(!foundItem){
        const list = new List({
          name : customListName,
          items: defaultItems
        })
      
       
        list.save()

        res.redirect("/" + customListName)
      }else{
         res.render("list", {listTitle: foundItem.name, newListItems: foundItem.items})
      }
    }
  })

  
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

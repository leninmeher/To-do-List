//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true})

const itemSchema=new mongoose.Schema({
  name:String
})

const Item=mongoose.model("Item",itemSchema)

const item1=new Item({
  name:"Eat Breakfast"
})

const item2=new Item({
  name:"Drink Water"
})

const item3=new Item({
  name:"Read Books"
})

const defaultItems=[item1,item2,item3]

// Item.insertMany(defaultItems,function(err){
//   if(err){
//     console.log(err)
//   }else{
//     console.log("Success saved default items!")
//   }
// })

const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
});

const List=mongoose.model("List",listSchema)



app.get("/", function(req, res) {

  

  Item.find({},function(err,foundItems){

    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err)
        }else{
          console.log("Success saved default items!")
        }
        res.redirect("/")
      })
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems})
    }
    
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item=new Item({
    name:itemName
  });

  item.save()
  res.redirect("/")

  
});

app.post("/delete",function(req,res){
  const delitem=req.body.checkbox

  Item.deleteOne({_id:delitem},function(err){
    if(err){
      console.log(err)
    }else{
      console.log("succesfully deleted")
    }
  })
  res.redirect("/")
})

app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName

  List.findOne({name:customListName},function(err, foundList){
    if(!err){
      if (!foundList){
        const list=new List({
          name:customListName,
          items:defaultItems
        });
      
        list.save()
        res.redirect("/name")

      }else{
        res.render("list", {listTitle: customListName, newListItems: foundList.items})
      }
    }
  })

  const list=new List({
    name:customListName,
    items:defaultItems
  });

  list.save()

})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

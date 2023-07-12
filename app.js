//jshint esversion:6

const express=require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const app= express();
const date=require(__dirname+"/js/date.js");
const _ = require("lodash");
const lists = require('./js/list.model');
const listModel = lists.listModel;
const list=lists.list;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoDB = "mongodb://localhost:27017/todolistDB";
async function main() {
    await mongoose.connect(mongoDB);
}

main().catch((error)=>{
    if(error) {
        console.log(error);
    } else {
        console.log("connected to db successfully");
    }
})


async function find() {
    return listModel.find({});
}

async function deletebyId(id) {
    await listModel.deleteOne({_id: id});
}

app.get("/", function(req, res) {
    find().then((value)=>{
        res.render('list', {title: "Today", list: value});
    })
})

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    list.findOne({name: customListName}).then((foundList)=>{
        if(!foundList) {
            console.log("doesnot exist");
            const l1= new list({
                name: customListName,
                items: []
            })
            l1.save();
            res.redirect("/"+customListName);
        }
        else {
            console.log("exists");
            res.render("list",{title: foundList.name, list: foundList.items});
        }
    }).catch((error) => {
        if(error) {
            console.log(error);
        }
    })
})


app.post("/", function(req,res) {
    const item= req.body.newItem;
    const listName=req.body.list;
    const data=new listModel({
        name:item
    });

    if(listName === "Today") {
        data.save();
        res.redirect("/");
    }
    else {
        list.findOne({name: listName}).then((foundList) => {
            foundList.items.push(data);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
})

app.post("/delete", function(req,res){
    console.log(req.body.checkbox);
    const id=req.body.checkbox;
    const listName=req.body.listName;
    if(listName==="Today") {
        listModel.findByIdAndRemove(id).catch((error) => {
            if(error) {
                console.log(error);
            }
        });
        res.redirect("/");
    }
    else {
        list.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}).catch((error)=>{
            if(error) {
                console.log(error);
            }
            else {
                console.log("Jkfndc");
            }
        });
        res.redirect("/"+listName)         
    }
    
})




app.listen(3000, function(){
    console.log("the server started on port 3000");
})
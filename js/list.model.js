const mongoose= require("mongoose");

const listSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

const itemsSchema = new mongoose.Schema({
    name: String,
    items: [listSchema]
})

const listModel= mongoose.model("listModel", listSchema);
const list= mongoose.model("list", itemsSchema);

module.exports = {listModel, list};

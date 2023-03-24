import mongoose from 'mongoose'

function initDB(){
    if(mongoose.connections[0].readyState){
        console.log("alredy connected")
        return
    }
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    mongoose.connection.on('connected',()=>{
        console.log("connected to mongo")
    })
    mongoose.connection.on('error',(err)=>{
        console.log("error connecting",err)
    })
}

//MONGO_URI="mongodb+srv://rk:FvLqrx0OcgrX3XDe@cluster0.e45wln1.mongodb.net/mystoredb?retryWrites=true&w=majority"
export default initDB
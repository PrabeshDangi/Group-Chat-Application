const express=require("express")
const path=require("path")
const app=express()
const port=process.env.port||5001;

const server=app.listen(port,()=>{
    console.log(`Server started on port ${port}!!`)
})
app.use(express.static(path.join(__dirname,'public')))
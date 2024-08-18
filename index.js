const express = require("express")
const path = require("path")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3").verbose()
const bodyParser = require('body-parser')
const app = express();
const dbPath = path.join(__dirname,"users.db")
const cors = require("cors")
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
let db = null;

//initialze the dataBase
const initializeDbAndServer = async()=>{
    try{
        db= await open({
            filename:dbPath,
            driver:sqlite3.Database
        });
        app.listen(4000,()=>{
            console.log(`Server is listening http://localhost:4000`);
        })
    }
    catch(error){
        console.log(`DB error : ${e.message}`)
        process.exit(1)
    }
}
const userDetails = (eachUser)=>{
    return{
        id:eachUser.id,
        name:eachUser.name,
        age:eachUser.age,
        location:eachUser.location,
        profession:eachUser.profession
    }

}

app.get('/',async(request,response)=>{
    const {location=''}=request.query
    const getQuery = `
    SELECT * FROM users WHERE location="${location}";`
    const usersArray = await db.all(getQuery)
    response.send(usersArray.map(eachUser=>userDetails(eachUser)))
})

app.put('/updateUser/:id',async(request,response)=>{
    const {id} = request.params
    const {name,age,location,profession} = request.body
    const updateQuery = `
    UPDATE users SET name="${name}",age=${age},location="${location}",
    profession="${profession}" WHERE id=${id};
    `
    await db.run(updateQuery)
    const getQuery = `
    SELECT * FROM users;
    `
    const usersArray = await db.all(getQuery)
    response.send(usersArray.map(eachUser=>userDetails(eachUser)))
})

app.post('/newUser',async(request,response)=>{
    const {name,age,location,profession} = request.body
    const newuserQuery = `
    INSERT INTO users(name,age,location,profession) VALUES 
    ("${name}",${age},"${location}","${profession}");
    `
    await db.run(newuserQuery)
    const getQuery = `
    SELECT * FROM users;
    `
    const usersArray = await db.all(getQuery)
    response.send(usersArray.map(eachUser=>userDetails(eachUser)))
})

app.delete('/deleteUser/:id',async(request,response)=>{
    const {id} = request.params
    const deleteQuery = `
    DELETE FROM users WHERE id = ${id};
    `
    await db.run(deleteQuery)
    const getQuery = `
    SELECT * FROM users;
    `
    const usersArray = await db.all(getQuery)
    response.send(usersArray.map(eachUser=>userDetails(eachUser)))
})

initializeDbAndServer()
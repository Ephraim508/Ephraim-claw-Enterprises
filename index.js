var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Registration')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/register",async (req,res) => {
    var name= req.body.name
    var age=req.body.age
    var email=req.body.email
    var phno=req.body.phno
    var gender=req.body.gender
    var password=req.body.password

    var data={
        "name":name,
        "age":age,
        "email":email,
        "phno":phno,
        "gender":gender,
        "password":password
    }

   

  
    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('/login.html')
})

// app.get("/",(req,res) => {
//     res.set({
//         "Allow-acces-Allow-Origin":'*'
//     })
//     return res.redirect('index.html')
// }).listen(3000);

// Route to save todos to the database
app.post("/saveTodos", async (req, res) => {
    let todos = req.body;
    if (!Array.isArray(todos)) {
        return res.status(400).send("Invalid data format");
    }

    try {
        // Clear existing todos in the collection (optional)
        await db.collection('todos').deleteMany({});

        // Insert new todos
        await db.collection('todos').insertMany(todos);

        res.json({ message: 'Todos saved successfully' });
    } catch (error) {
        console.error("Error saving todos:", error);
        res.status(500).send("Error saving todos");
    }
});



// Route to delete a todo from the database
app.post("/deleteTodo", async (req, res) => {
    const { todoId } = req.body;

    if (!todoId) {
        return res.status(400).send("Todo ID is required");
    }

    try {
        // Delete the todo from the collection
        const result = await db.collection('todos').deleteOne({ uniqueNo: todoId });

        if (result.deletedCount === 0) {
            return res.status(404).send("Todo not found");
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).send("Error deleting todo");
    }
});




app.post("/login", async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    const user = await db.collection('users').findOne({ email: email });

    if (!user) {
        return res.status(404).send("User does not exist");
    }
    if (user.password === password) {
        return res.redirect('/todo.html'); // Redirect to a success page
    } else {
        return res.status(401).send("Password is incorrect");
    }
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.get("/",(req,res)=>{
    res.set({"Allow-access-Allow-Origin":'*'})
   return res.redirect('login.html')
})

app.listen(3000);

// app.post("/login", (req, res) => {
//     var { email, password } = req.body;

//     db.collection('users').findOne({ email: email }, (err, user) => {
//         if (err) {
//             return res.status(500).json("Error occurred");
//         }
//         if (!user) {
//             return res.status(404).json("User does not exist");
//         }
//         if (user.password === password) {
//             return res.redirect("signup_successful.html");
//         } else {
//             return res.status(401).json("Password is incorrect");
//         }
//     });
// });

console.log("Server running")



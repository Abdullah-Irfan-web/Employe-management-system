const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const flash=require('connect-flash');
const session=require('express-session');


const DBa='mongodb+srv://abdullah:abd123@cluster0.34stq.mongodb.net/empdata?retryWrites=true&w=majority'

mongoose.connect(DBa,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

 const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("Connected");
});


let employeeschema=new mongoose.Schema({
    name : String,
    designation : String,
    salary : String
});
let Employee=mongoose.model('Employee',employeeschema); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

app.use(session({
    secret:"nodejs",
    resave:true,
    saveUninitialized:true
}));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash(('success_msg'));
    res.locals.error_msg=req.flash(('error_msg'));
    res.locals.error=req.flash(('error'));
    next();
});



app.get("/",(req,res)=>{
    Employee.find({})
    .then(employee=>{
        res.render('home',{employee:employee});
    }).catch(err=>{
        console.log(err);

    })
   
})


app.get("/employee/new",(req,res)=>{

    res.render('new');
})

app.get("/employee/search",(req,res)=>{
    res.render('search',{employee:""});
});


app.post("/employee/new",(req,res)=>{
    let emp={
        name : req.body.empname,
        salary : req.body.salary,
        designation : req.body.designation
    };
    Employee.create(emp)
    .then(employee=>{
        req.flash('success_msg','Employee Added Successfully');
        res.redirect('/');
        console.log(success_msg);
       
        }).catch(err=>{
           req.flash('error_msg','Employee Cannot be added');
        });
  
});
app.get('/employee',(req,res)=>{
    let querysearch={name:req.query.empname};
    Employee.findOne(querysearch)
    .then(employee=>{
        res.render('search',{employee:employee})
    }).catch(err=>{
        console.log(err);
    })
})
app.get('/edit/:id',(req,res)=>{
    let qry={_id:req.params.id};
    Employee.findOne(qry)
    .then(employee=>{
        res.render('update',{employee:employee});
    }).catch(err=>{
        console.log(err);
    
    });
})
app.get('/delete/:id',(req,res)=>{
    let serachquery={_id : req.params.id};
    Employee.deleteOne(serachquery)
    .then(employee=>{
        req.flash('success_msg','Employee deleted Successfully');
       
        res.redirect("/");
    }).catch(err=>{
        req.flash('error_msg','Employee Cannot be deleted');
    })
})
app.post('/edit/:id',(req,res)=>{
    let searchquery={_id:req.params.id};
    Employee.updateOne(searchquery,{$set:{
        name:req.body.empname,
        salary:req.body.salary,
        designation:req.body.designation
    }})
    .then(employee=>{
        req.flash('success_msg','Employee Updated Successfully');
        res.redirect('/');
    }).catch(err=>{
       req.flash('error_msg','Error cannot updated Employee');
    })
 

})

app.listen(3000, () => {
    console.log("Started");
})



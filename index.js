const Joi = require('joi'); //easy validation
const express = require('express'); //importing express
const app = express();

app.use(express.json());

const courses = [
    {id:1 , name:'Course1'},
    {id:2 , name:'Course2'},
    {id:3 , name:'Course3'},
];

//get root
app.get('/', (req,res) =>{
    res.send('Hello World !!...lets go..');
});

//get whole course
app.get('/api/courses', (req,res) =>{
    res.send(courses);
});

// get particular course
app.get('/api/courses/:id', (req,res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Sorry!! This course is not available');
    res.send(course);
});

// push a new course
app.post('/api/courses', (req,res) =>{
    const { error } = validateCourse(req.body);
    if(error)return res.status(400).send(error.details[0].message);

    const course ={
        id : courses.length + 1,
        name : req.body.name
    };
    courses.push(course);
    res.send(course);
});

//update an existing course
app.put('/api/courses/:id', (req,res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Sorry!! This course is not available');

    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name ;
    res.send(course);
});

//delete an existing course
app.delete('/api/courses/:id', (req,res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Sorry!! This course is not available');

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);
});

// validator function
function validateCourse(course){
    const schema ={
        name : Joi.string().min(3).required()
    };
    return Joi.validate(course,schema);
};

//port on which our server runs
const port = process.env.PORT || 3000 ;
app.listen(port, () => console.log(`listening at port ${port}...`));
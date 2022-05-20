const express                   = require('express');
const cookieParser              = require('cookie-parser');
const userRoutes                = require('./routes/user_routes');
const postRoutes                = require('./routes/post_routes');
const commentRoutes             = require('./routes/comment_routes');
const db                        = require('../config/db');
const {checkUser, requireAuth}  = require('./middlewares/auth_middleware');
const cors                      = require('cors');

const UserModel                 = require('./models/user_model');
const PostModel                 = require('./models/post_model');
const CommentModel              = require('./models/comment_model');

// ===================================================
//                 Express App Creation
// ===================================================
const app = express();

// Ici, Express prend toutes les requêtes qui ont comme Content-Type  application/json  
// et met à disposition leur  body  directement sur l'objet req
app.use(express.json());
app.use(cookieParser());

// ===================================================
//                  cors - Options
// ===================================================
const corsOptions = 
{
    origin              : "http://localhost:3000",
    credentials         : true,
    'allowedHeaders'    : ['sessionId', 'Content-Type'],
    'exposedHeaders'    : ['sessionId'],
    'methods'           : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue' : false
}

app.use(cors(corsOptions));

// ===================================================
//                 Auth Definitions
// ===================================================
// Apply to all get routes
// ===================================================
app.get('*', checkUser);

app.get('/jwtid', requireAuth, (req, res) =>
{
    res.status(200).send(res.locals.user.id);
});


// ===================================================
//                 Routes Definitions
// ===================================================
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// ===================================================
//                 DB Connection
// ===================================================
UserModel.hasMany(PostModel, { as: "posts" });
PostModel.hasMany(CommentModel, { as: "comments", onDelete: 'cascade'});

PostModel.belongsTo(UserModel);


CommentModel.belongsTo(PostModel, { onDelete: 'cascade' });
CommentModel.belongsTo(UserModel);

db.sync()
    .then(() =>
    {
        console.log("Connection to Groupomania DB OK.");
    })
    .catch(error => console.log("Connection to Groupomania FAILED : " + JSON.stringify(error)));

// ===================================================
//                     Export
// ===================================================
module.exports = app;
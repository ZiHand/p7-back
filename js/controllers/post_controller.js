const PostModel         = require('../models/post_model');
const UserModel         = require('../models/user_model');
const CommentModel      = require('../models/comment_model');
const PostValidation    = require('../validations/post_validation');

const fs                = require("fs");
const { promisify }     = require("util");
const pipeline          = promisify(require("stream").pipeline);
const path              = require('path');

// ===================================================
// createPost
// ===================================================
module.exports.createPost = (req, res) => 
{
    const {message, picture, video} = req.body;
    const {id}                      = req.params;
    let User;

    if (!message)
    {
        console.log("NO MESSAGE");
        return res.status(500).send({ message: "Empty post" });
    }
        
    // Find corresponding user:
    UserModel.findByPk(id, {attributes : {exclude : ["createdAt", "updatedAt", "password"]}})
    .then(user =>
    {
        if (!user)
        {
            console.log("!user");
            return res.status(400).json({message : `User not found : ${id}`})
        }

        User = user;
    })
    .catch(error => res.status(500).json(error))

    if (User === null)
    {
        console.log("!User");
        return res.status(400).json({message : `User not found : ${id}`})
    }
        

    // Manage file
    let fileName;

    try 
    {
        if (req.file !== null)
        {
            console.log("Check file format");
            // Check file format & size
            if (req.file.detectedMimeType  != "image/jpg" &&
                req.file.detectedMimeType  != "image/png" &&
                req.file.detectedMimeType  != "image/jpeg" &&
                req.file.detectedMimeType  != "image/gif")
            {
                throw Error("invalid file");
            }
        
            if (req.file.size > 5e+6) throw Error("max size");
        }
    }
    catch (err)
    {
        console.log(err);
        return res.status(500).json({ err });
    }

    PostModel.create(
        { 
            message: message,
            picture: picture,
            video: video
        })
        .then((post) => 
        {
            if (picture && req.file)
            {
                fileName = post.id + ".jpg";
                const filedir = path.normalize(`${__dirname}/../../../frontend/public/uploads/post/${fileName}`);

                post.picture = fileName;
                post.save();

                try 
                {
                    const file = fs.createWriteStream(filedir, {flags: 'w'});

                    file.on('error',  (error) => 
                    {
                        console.log(`An error occured while writing to the file. Error: ${error.message}`);
                        file.end();
                        throw Error(error);
                    });

                    pipeline(req.file.stream, file);
                }
                catch (error)
                {
                    console.log('pipeline failed with error:', error);
                    return res.status(500).send({ message: "Creating file error" });
                }
            }
            
            post.setUser(User);

            res.status(201).json({ message: `Post added : ${post.id}`});
        })
        .catch(error =>
        {
            //const errors = signUpErrors(error);
            res.status(200).json({ error });
        });
}

// ===================================================
// getPosts
// ===================================================
module.exports.getPosts = (req, res) => 
{
    PostModel.findAll(
    {
        order: [['createdAt', 'DESC'], [{ model: CommentModel, as: 'comments' }, 'createdAt']],
        
        include: 
        [
            {
                model: UserModel,
                as: "user",
                attributes: ["id", "pseudo", "avatar_url"],
            },
            {
                model: CommentModel,
                as: "comments",
                attributes: ["id", "message", "createdAt", "userId"],
              },
        ],
    })
    .then( posts =>
    {
        res.status(200).json(posts);
    })
    .catch(error => res.status(500).json(error))
}

// ===================================================
// getPost
// ===================================================
module.exports.getPost = (req, res) => 
{
    const {id} = req.params;

    PostModel.findByPk(id, 
    {
        //order: [['createdAt', 'DESC']],
        
        include: 
        [
            {
                model: UserModel,
                as: "user",
                attributes: ["id", "pseudo"],
            },
            {
                model: CommentModel,
                as: "comments",
                attributes: ["id", "message", "createdAt", "userId"],
              },
        ],
    })
    .then(post =>
    {
        if (!post)
        {
            return res.status(400).json({message : `Post not found : ${id}`})
        }

        return res.status(200).json(post);
    })
    .catch(error => res.status(500).json(error))
}

// ===================================================
// updatePost
// ===================================================
module.exports.updatePost = (req, res) => 
{
    PostModel.findByPk(req.params.id)
    .then(post =>
    {
        if (!post)
        {
            return res.status(404).json({message : "Post not found !"})
        }

        if (req.params.id !== post.id)
        {
            badStatus = 403;
            let errorMsg = " unauthorized request";
            throw(errorMsg);
        }

        post.message    = req.body.message;
        post.picture    = req.body.picture;
        post.video      = req.body.video;

        return post;
    })
    .then(updatedPost =>
    {
        // Update
        updatedPost.save()
        .then(() =>
        {
            res.status(201).json({ message: 'Post updated.'})
        })
        .catch(error => res.status(500).json(error))
    })
    .catch(error => res.status(500).json(error))
}

// ===================================================
// deletePost
// ===================================================
module.exports.deletePost = (req, res) => 
{
    // Delete comments
    CommentModel.destroy({where : {postId : req.params.id}})
    .then(comments => 
    {
        console.log("deleted " + comments + " comments");
    })
    .catch(error => res.status(500).json(error))
    

    // Delete post image if any
    const fileName = req.params.id + ".jpg";
    const filedir  = path.normalize(`${__dirname}/../../../frontend/public/uploads/post/${fileName}`);
    
    deletePostImage(filedir);


    PostModel.destroy({where : {id : req.params.id}})
    .then(post =>
    {
        if (!post)
        {
            res.status(404).json({ message: 'Post not found !'})
        }

        res.status(200).json({ message: 'Post deleted.'})
    })
    .catch(error => res.status(500).json(error))
}

// ===================================================
// deletePost
// ===================================================
module.exports.addComment = (req, res) => 
{
    const {postId, commentId} = req.params;

    PostModel.findByPk(postId)
    .then((post) =>
    {
        if (!post) 
        {
            res.status(404).json({ message: 'Post not found !'});
        }

        Comment.findByPk(commentId).then((comment) => 
        {
            if (!comment) 
            {
                res.status(404).json({ message: 'Comment not found !'});
            }

            post.addComment(comment);
            res.status(200).json({ message: 'Post added.'})
    
        })
        .catch((err) => 
        {
            console.log(">> Error while adding Comment to Post: ", err);
        });
    })
    .catch(error => res.status(500).json(error))
}

// ===================================================
// getPostCommentCount
// ===================================================
/*module.exports.getPostCommentCount = (req, res) => 
{
    PostModel.findAndCountAll(
        {
            include: 
            [
               
                {
                    model: UserModel,
                    as: "user",
                    attributes: ["id", "pseudo", "avatar_url"],
                },
            ],
        })
        .then( posts =>
        {
            res.status(200).json(posts);
        })
        .catch(error => res.status(500).json(error))
}*/

// ===================================================
// ===================================================
// deletePostImage // put async
// ===================================================
async function deletePostImage(url)
{
    console.log("Deleting post picture : " + url);
    //let file    = __dirname + "/../../images/" + url;
    
    try 
    {
        fs.unlinkSync(url);
    } 
    catch (error) 
    {
        console.log("Unable to delete : " + url);
    }
    
}
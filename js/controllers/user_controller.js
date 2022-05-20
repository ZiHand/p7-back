const UserModel         = require('../models/user_model');
const PostModel         = require('../models/post_model');
const CommentModel      = require('../models/comment_model');
const bcrypt            = require("bcrypt");
const { updateErrors }  = require('../utils/errors_utils');

const db                = require("../../config/db");
const fs                = require("fs");
const path              = require('path');


// ===================================================
// getUsers
// ===================================================
module.exports.getUsers = (req, res) => 
{
    UserModel.findAll({attributes : {exclude : ["createdAt", "updatedAt", "password"]}})
        .then( users =>
        {
            res.status(200).json(users);
        })
        .catch(error => res.status(500).json(error))
}

// ===================================================
// getUser
// ===================================================
module.exports.getUser = (req, res) => 
{
    const {id} = req.params;

    UserModel.findByPk(id, {attributes : {exclude : ["createdAt", "updatedAt", "password"]}})
    .then(user =>
    {
        if (!user)
        {
            return res.status(400).json({message : `User not found : ${id}`})
        }

        return res.status(200).json(user);
    })
    .catch(error => res.status(500).json(error))
}

// ===================================================
// updateUser
// ===================================================
module.exports.updateUser = (req, res) => 
{
    console.log("updateUser");
    const {body}    = req;

    if (!req.params.id)
        return res.status(400).send("ID unknown : " + req.params.id);


    UserModel.findByPk(req.params.id, {attributes : {exclude : ["createdAt", "updatedAt", "password", "moderator"]}})
    .then(user =>
    {
        if (!user)
        {
            return res.status(404).json({message : "User not found !"})
        }

        if (req.params.id !== user.id)
        {
            badStatus = 403;
            errorMsg = " unauthorized request";
            throw(errorMsg);
        }

        if (body.pseudo)
        {
            user.pseudo = body.pseudo;
        }

        if (body.password)
        {
            const salt = bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(body.password, salt);
        }

        

        if (body.moderator)
        {
            if (body.moderator === process.env.REACT_ADMIN_SECRET)
            {
                user.moderator = 1;
            }
            else
            {
                user.moderator = 0;
                throw Error("moderator");
            }
        }

        console.log(user);
        return user;
    })
    .then(updateUser =>
    {
        // Update
        updateUser.save()
        .then(() =>
        {
            res.status(201).json({ message: 'User updated.'})
        })
        .catch(error =>
        {
            const errors = updateErrors(error);
            res.status(200).json({ errors });
        });
    })
    .catch(error => 
    {
        const errors = updateErrors(error);
        res.status(201).json(errors);
    })
}

// ===================================================
// deleteUser
// ===================================================
module.exports.deleteUser = (req, res) => 
{
    const {id} = req.params;

    console.log("**********************");
    console.log("deleteUser " + id);
    console.log("**********************");

    // Delete user posts
    PostModel.findAll(
    {
        where: { userId: id }  
    })
    .then(async(posts) => 
    {
        for(var post of posts)
        {
            console.log("Deleting Post : " + post.id);

            // Delete comments
            await CommentModel.destroy({where : {postId : post.id}})
            .then(comments => 
            {
                console.log("deleted " + comments + " comments");
            })
            .catch((error) => 
            {
                console.log(error);
                res.status(500).json(error)
            })

            // Delete post image if any
            const fileName = post.id + ".jpg";
            const filedir  = path.normalize(`${__dirname}/../../../frontend/public/uploads/post/${fileName}`);

            console.log("Deleting file from post: " + fileName);
            try 
            {
                fs.unlinkSync(filedir);
            } 
            catch (error) 
            {
                console.log("Unable to delete : " + filedir);
            }

            // Delete it
            await PostModel.destroy({where : {Id : post.id}})
            .then(posts => 
            {
                console.log("deleted " + posts + " posts");
            })
            .catch(error => res.status(500).json(error))
        }
    })
    .catch(error => res.status(500).json(error))

    //return;
    

    UserModel.destroy({where : {id : id}})
    .then(user =>
    {
        if (!user)
        {
            res.status(404).json({ message: 'User not found !'})
        }

        res.status(200).json({ message: 'User deleted.'})
    })
    .catch(error => res.status(500).json(error))
}
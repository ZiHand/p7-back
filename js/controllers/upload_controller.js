const UserModel         = require("../models/user_model");
const fs                = require("fs");
const { promisify }     = require("util");
const pipeline          = promisify(require("stream").pipeline);
const { uploadErrors }  = require('../utils/errors_utils');
const path              = require('path');

module.exports.uploadProfil = async (req, res) => 
{
   try 
    {
        if (!req.file)
        {
            console.log("Upload error : req.file == null");
            throw Error("no file");
        }
        
        // Check file format & size
        if (req.file.detectedMimeType  != "image/jpg" &&
            req.file.detectedMimeType  != "image/png" &&
            req.file.detectedMimeType  != "image/jpeg")
        {
            throw Error("invalid file");
        }
        
        if (req.file.size > 500000) throw Error("max size");
    }
    catch (err)
    {
        const errors = uploadErrors(err);
        return res.status(201).json({ errors });
    }

    // picture name goes unique
    console.log("picture name goes unique ******************");
    console.log(req.body);
    const fileName = req.body.userId + ".jpg";

    // Create the file
    const filedir = path.normalize(`${__dirname}/../../../frontend/public/uploads/profil/${fileName}`);

    console.log(filedir);

    try 
    {
        const file = fs.createWriteStream(filedir, {flags: 'w'});

        file.on('error',  (error) => {
            console.log(`An error occured while writing to the file. Error: ${error.message}`);
            file.end();
            throw Error(error);
        });

        await pipeline(req.file.stream, file);
    }
    catch (error)
    {
        console.log('pipeline failed with error:', error);
        return res.status(500).send({ message: "Creating file error" });
    }
    
    

    try 
    {
        await UserModel.update({ avatar_url: fileName}, { where: { id: req.body.userId } })
        .then((data) => 
        {
            res.send(data);
        })
        .catch( (err) =>
        {
            console.log(err.message);
            res.status(500).send({ message: err });
        });
    }
    catch (error)
    {
        console.log(error.message);
        return res.status(500).send({ message: error });
    }
}
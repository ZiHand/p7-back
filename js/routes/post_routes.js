const router            = require('express').Router();
const postController    = require('../controllers/post_controller');
const multer            = require("multer");
const upload            = multer();

// ===================================================
//                 Routes Definitions
// ===================================================
router.post('/:id', upload.single("file"), postController.createPost); 
router.get('/getall', postController.getPosts); 
router.get('/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:postid/:commentid', postController.addComment);


// ===================================================
//                   Routes Export
// ===================================================
module.exports = router;
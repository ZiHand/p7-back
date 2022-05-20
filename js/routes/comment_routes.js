const router            = require('express').Router();
const commentController = require('../controllers/comment_controller');

// ===================================================
//                 Routes Definitions
// ===================================================
router.post('/:userId/:postId', commentController.createComment); 
router.get('/getAll', commentController.getAllComments); 
router.get('/getFrom/:id', commentController.getCommentsFrom); 
router.get('/:id', commentController.getComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

// ===================================================
//                   Routes Export
// ===================================================
module.exports = router;
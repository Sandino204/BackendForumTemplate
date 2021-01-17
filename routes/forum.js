const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')

const auth = require('../util/auth')

router.use(bodyParser.urlencoded({limit: '10mb' , extended: true}))
router.use(bodyParser.json())

router.get('/posts', postController.getAllPosts)
router.get('/postsByTopic', postController.getAllPostsByTopic)
router.get('/postsByUser', postController.getAllPostsByUser)
router.post('/posts', auth, postController.postAnPost)
router.get('/post/:postId', postController.getPostById)
router.put('/post/:postId', auth, postController.editPost)
router.delete('/post/:postId', auth, postController.deletePost)
router.post('/post/:postId/like', auth, postController.likeAPost)
router.post('/post/:postId/unlike', auth, postController.unlikeAPost)
router.post('/post/:postId/comments', auth, commentController.postComment)
router.delete('/post/:postId/comments/:commentId', auth, commentController.deleteComment)

module.exports = router
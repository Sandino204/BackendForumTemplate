const {admin, db} = require('../util/admin')


const commentController = {}

commentController.postComment = (req, res) => {
    if(req.body.text.trim() === ""){
        return res.status(400).json({
            success: true, 
            message: 'Text must not be empty'
        })
    }

    const newComment = {
        text: req.body.text, 
        createdAt: new Date().toISOString(), 
        postId: req.params.postId, 
        username: req.user.username, 
        // userImage: req.user.imageUrl
    }

    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post not found'
                })
            }

            return doc.ref.update({ commentCount: doc.data().commentCount + 1})
        })
        .then(() => {
            return db.collection("comments").add(newComment)
        })
        .then(() => {
            return res.status(201).json({
                success: true, 
                data: newComment
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })
}

commentController.deleteComment = (req, res) => {
    if(req.body.text.trim() === ""){
        return res.status(400).json({
            success: true, 
            message: 'Text must not be empty'
        })
    }

    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post not found'
                })
            }

            return doc.ref.update({ commentCount: doc.data().commentCount - 1})
        })
        .then(() => {
            return db.doc(`/comments/${req.params.commentId}`)
                        .delete()
        })
        .then(() => {
            res.status(201).json({
                success: true, 
                message: 'You delete this Comment'
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })

    
}

module.exports = commentController
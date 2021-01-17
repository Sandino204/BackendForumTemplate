const {admin, db} = require('../util/admin')

const postController = {}

postController.getAllPosts = (req, res) => {
    db.collection("posts")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            let posts = []
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    title: doc.data().title, 
                    text: doc.data().text, 
                    username: doc.data().username, 
                    createdAt: doc.data().createdAt, 
                    commentCount: doc.data().commentCount, 
                    likeCount: doc.data().likeCount, 
                    // userImage: doc.data().userImage, 
                    topic: doc.data().topic
                })
            })
            return res.status(200).json({
                success: true, 
                data: posts
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: "Something went wrong"
            })
        })
}

postController.getAllPostsByTopic = (req, res) => {
    db.collection("posts")
        .where("topic", "==", req.body.topic)
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            let posts = []
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    title: doc.data().title, 
                    text: doc.data().text, 
                    username: doc.data().username, 
                    createdAt: doc.data().createdAt, 
                    commentCount: doc.data().commentCount, 
                    likeCount: doc.data().likeCount, 
                    // userImage: doc.data().userImage, 
                    topic: doc.data().topic
                })
            })
            return res.status(200).json({
                success: true, 
                data: posts
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: "Something went wrong"
            })
        })
}

postController.getAllPostsByUser = (req, res) => {
    db.collection("posts")
        .where("username", "==", req.body.username)
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            let posts = []
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    title: doc.data().title, 
                    text: doc.data().text, 
                    username: doc.data().username, 
                    createdAt: doc.data().createdAt, 
                    commentCount: doc.data().commentCount, 
                    likeCount: doc.data().likeCount, 
                    // userImage: doc.data().userImage, 
                    topic: doc.data().topic
                })
            })
            return res.status(200).json({
                success: true, 
                data: posts
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: "Something went wrong"
            })
        })
}

postController.postAnPost = (req, res) => {
    if(!req.body.title || !req.body.text || !req.body.topic){
        return res.status(500).json({
            success: false, 
            message: 'Some data is missing'
        })
    }

    const newPost = {
        topic: req.body.topic,
        title: req.body.title, 
        text: req.body.text, 
        username: req.user.username,
        // userImage: req.user.imageUrl, 
        createdAt: new Date().toISOString(), 
        likeCount: 0, 
        commentCount: 0
    }

    db.collection('posts')
        .add(newPost)
        .then((doc) => {
            const post = newPost
            post.postId = doc.id
            res.status(201).json({
                success: true, 
                data: post
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })
}

postController.getPostById = (req, res) => {
    let postData = {}
    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post Dont Found'
                })
            }

            postData = doc.data()
            postData = doc.id

            return db.collection('comments')
                .orderBy("createdAt", "desc")
                .where("postId", "==", req.params.postId)
                .get()
        })
        .then((data) => {
            postData.comments = []
            data.forEach((doc) => {
                postData.comments.push(doc.data())
            })

            return res.status(200).json({
                success: true, 
                data: postData
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: err
            })
        })
}


postController.likeAPost = (req, res) => {
    const likeDocument = db.collection("likes")
        .where("username", "==", req.user.username)
        .where("postId", "==", req.params.postId)
        .limit(1)
    
    
    const postDocument = db.doc(`/posts/${req.params.postId}`)

    let postData 

    postDocument.get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post Not Found'
                })
            }

            postData = doc.data()
            postData.postId = doc.id
            return likeDocument.get()
        })
        .then((data) => {
            if(data.empty){
                return db.collection("likes")
                    .add({
                        postId: req.params.postId, 
                        username: req.user.username
                    })
                    .then(() => {
                        postData.likeCount++
                        return postDocument.update({likeCount: postData.likeCount})
                    })
                    .then(() => {
                        return res.status(200).json({
                            success: true, 
                            data: postData
                        })
                    })
            }else{
                return res.status(400).json({
                    success: false, 
                    message: 'Post Already Liked'
                })
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })
}

postController.unlikeAPost = (req, res) => {
    const likeDocument = db.collection("likes")
        .where("username", "==", req.user.username)
        .where("postId", "==", req.params.postId)
    
    const postDocument = db.doc(`/posts/${req.params.postId}`)

    let postData 

    postDocument.get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post not found'
                })
            }

            postData = doc.data()
            postData.postId = doc.id

            return likeDocument.get()
        })
        .then((data) => {
            if(data.empty){
                return res.status(400).json({
                    success: false, 
                    message: 'Post not liked'
                })
            }
            return db.doc(`/likes/${data.doc[0].id}`)
                .delete()
                .then(() => {
                    postData.likeCount--
                    return postDocument.update({ likeCount: postData.likeCount})
                })
                .then(() => {
                    res.status(201).json({
                        postData
                    })
                })
        
        })
        .catch((err) => {
            res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })
}

postController.editPost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`)

    document.get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post not found'
                })
            }
            if(doc.data().username !== req.user.username){
                return res.status(403).json({
                    success: false, 
                    message: "You Are not authorized to edit this Post"
                })
            }

            return document.update(req.body)
        })
        .then(() => {
            res.status(201).json({
                success: true, 
                message: 'You edit this post'
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })
}

postController.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`)

    document.get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({
                    success: false, 
                    message: 'Post not found'
                })
            }
            if(doc.data().username !== req.user.username){
                return res.status(403).json({
                    success: false, 
                    message: "You Are not authorized to edit this Post"
                })
            }

            return document.delete()
        })
        .then(() => {
            res.status(201).json({
                success: true, 
                message: 'You delete this post'
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false, 
                message: 'Something went wrong'
            })
        })
}

module.exports = postController
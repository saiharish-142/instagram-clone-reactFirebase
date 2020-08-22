import React, { useState, useEffect } from 'react'
import Avatar from  '@material-ui/core/Avatar'
import firebase from 'firebase'
import { db } from './firebase'

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    useEffect(() => {
        let unsubcribe;
        if(postId){
            unsubcribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubcribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                    className='post__avatar'
                    alt={username}
                    src='/posts/head'
                />
                <h3>{username}</h3>
            </div>
            <img className='post__image' src={imageUrl} alt='' />
            <h4 className='post__text'><strong>{username}</strong> :{caption}</h4>
            {user && (
                <>
                <div className='post__comments'>
                    {comments.map((comment) => {
                        return <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    })}
                </div>
                <form className='post__commentbox'>
                    <input
                        className='post__input'
                        type='text'
                        placeholder='Add a comment...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} 
                    />
                    <button
                        className='post__button'
                        type='submit'
                        disabled={!comment}
                        onClick={postComment}
                    >
                        post
                    </button>
                </form>
                </>
            )}
        </div>
    )
}

export default Post

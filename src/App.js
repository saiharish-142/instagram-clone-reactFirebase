import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './post';
import { db, auth } from './firebase'
import { Modal, makeStyles, Button, Input, Avatar } from '@material-ui/core';
import ImageUpload from './imageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;
  
  return{
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  Paper:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App () {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setopen] = useState(false)
  const [openSignin, setopenSignin] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser)
        console.log(authUser)
      } else{
        ///asdasd
        setUser(null)
      }
    })  
    return () => {
      unsubscribe();
    }  
  }, [user, username])

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post :doc.data()
      })));
    })
  }, [])

  const signUp =(event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email,password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error)=>alert(error.message));

    setopen(false);
  }

  const signIn =(event) =>{
    event.preventDefault();
    setopenSignin(false)

    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message))

  }

  return (
    <div className="App">
      <Modal
        open ={open}
        onClose={() => setopen(false)}
      >
        <div style={modalStyle} className={classes.Paper}>
          <form className='app__signup'>
            <center>
              <div className='app__headerImage'>
                <h2>Instagram</h2>
              </div>
            </center>
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open ={openSignin}
        onClose={() => setopenSignin(false)}
      >
        <div style={modalStyle} className={classes.Paper}>
          <form className='app__signup'>
            <center>
              <div className='app__headerImage'>
                <h2>Instagram</h2>
              </div>
            </center>
            <Input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <div className='app__headerImage'>
          <h2>Instagram</h2>
        </div>
        <div>
          {user ?(
          <Button onClick={() => auth.signOut()}>Logout<Avatar src='/dsa/' alt={user.displayName} /></Button>
          ) :(
          <>
            <Button onClick={() => setopenSignin(true)}>Sign in</Button>
            <Button onClick={() => setopen(true)}>Sign Up</Button>
          </>
          )}
        </div>
      </div>
      <div className='app__posts'>
        <div>
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):(
        <h3>Sorry Please Login</h3>
      )}
      {/* <div>adasda</div> */}
    </div>
  );
}

export default App;

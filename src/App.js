import React,{useState, useEffect} from "react";
import Post from "./Post"
import { db, auth } from "./firebase";
import './App.css';
import { Modal } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Button, Input} from "@material-ui/core";
import ImageUplode from "./ImageUplode";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
   }
  )
);

function App() {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [user, setUser] = useState("");

    const [openSignIn, setOpenSignIn] = useState(false);

    // useeffect Runs a piece of code based on a specific condition
    //----------------------------------------------------------------------------------------

    // useEffect for handle use login logout
    useEffect(() => {
        const unsubscrie = auth.onAuthStateChanged((authUser) =>{
            if(authUser){
                // user has LogIn
                setUser(authUser);
            }else{
                // user has LogOut
                setUser(null);
            }
        })
        return () => {
            // perfrom some cleneUp action
            unsubscrie();
        }
    }, [user, username])

    // useEffect for pull data from Firebase database
    useEffect(() => {
        db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, []);

    const signup = (event) => {
        event.preventDefault();
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) =>{
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error) => alert(error.message));

        setOpen(false);
    }

    const signIn = (event) => {
        event.preventDefault();
        auth
            .signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message))

        setOpenSignIn(false);
    }

    return (
        <div className="app">
            <Modal
                open = {open}
                onClose= {()=> setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className = "app_signup">
                        <center>
                            <img
                                className = "app__"
                                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt = ""
                            />
                        </center>
                        <Input
                            placeholder = "username"
                            type = "username"
                            value  = {username}
                            onChange = {(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder = "email"
                            type = "email"
                            value  = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder = "password"
                            type = "password"
                            value  = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                        <Button
                            onClick = {signup}
                        >
                            Sign up
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open = {openSignIn}
                onClose= {()=> setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className = "app_signup">
                        <center>
                            <img
                                className = "app__"
                                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt = ""
                            />
                        </center>
                        <Input
                            placeholder = "email"
                            type = "email"
                            value  = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder = "password"
                            type = "password"
                            value  = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                        <Button
                            onClick = {signIn}
                        >
                            Sign up
                        </Button>
                    </form>
                </div>
            </Modal>


            <div className = "app__header">
                <img
                    className = "app__headerImage"
                    src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt = ""
                />
                {user ? (
                <Button onClick = {() => auth.signOut()}>Log out</Button>
                ):(
                    <div className = "app__loginContainer">
                        <Button onClick = {() => setOpenSignIn(true)}>LOGIN</Button>
                        <Button onClick = {() => setOpen(true)}>SIGNUP</Button>
                    </div>
                )}
            </div>

            <div className = "app__posts">
                <div className = "app__postLeft">
                    {
                        posts.map(({id , post}) => (
                            <Post 
                                user = {user}
                                key = {id} 
                                postId = {id}
                                username = {post.username} 
                                caption = {post.caption} 
                                imageUrl = {post.imageUrl}
                            />
                        ))
                    }
                </div>
                <div className = "app__postRight">
                    <InstagramEmbed
                        url="https://instagr.am/p/Zw9o4/"
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>
            </div>

            <div>
                {user?.displayName ? (
                    <ImageUplode username = {user.displayName}/>
                ):(
                    <h3>Sorry, you need to login to upload</h3>
                )}
            </div>
        </div>
    );
}

export default App;

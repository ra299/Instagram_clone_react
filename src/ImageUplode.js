import React, {useState} from 'react'
import { Button } from "@material-ui/core";
import {db, storage} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUplode({username}) {

    const [caption, setCaption] = useState(null);
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState("");

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    };

    const handleUplode = (e) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error Function....
                alert(error.message);
            },
            () => {
                // cpmplete function....
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // Post those images inside the firebase db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    }
                );
            }
        );
    };

    return (
        <div className = "image__upload">
            <progress
                className = "imageUpload__progress"
                value = {progress} 
                max = "100"
            />
            <input
                type = "text"
                placeholder = "Enter A Caption..."
                value = {caption}
                onChange =  {event => setCaption(event.target.value)}
            />
            <input 
                type = "file" 
                onChange = {handleChange}
                value = ""
            />
            <Button onClick = {handleUplode}>Upload Things</Button>
        </div>
    )
}

export default ImageUplode

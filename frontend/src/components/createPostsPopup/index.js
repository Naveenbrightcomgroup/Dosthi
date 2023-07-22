import { useEffect, useRef, useState } from "react";
import "./style.css";
import Picker from "emoji-picker-react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddYourPost";
import ImagePreview from "./ImagePreview";
import { createPost } from "../../functions/post";
import useClickOutside from "../../helpers/clickOutside";
import PulseLoader from "react-spinners/PulseLoader";
import dataURItoBlob from "../../helpers/dataURLtoBlob";
import { uplaodImages } from "../../functions/uploadImages";
import PostError from "./PostError";
export default function CreatePostPopup({ user, setVisible }) {
  const popUp = useRef(null)
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState("")
  const [images, setImages] = useState([]);
  const [background, setbackground] = useState("");
  useClickOutside(popUp, () => {
    setVisible(false)
  })
  const submitPost = async () => {
    if (background) {
      setloading(true);
      const response = await createPost(
        null,
        background,
        text,
        null,
        user.id,
        user.token
      );
      setloading(false);
      if (response === "ok") {
        setbackground("");
        setText("")
        setVisible()
      } else {
        seterror(response)
      }
    } else if (images && images.length) {
      setloading(true);
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });
      const path = `${user.username}/post Images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
      });
      const response = await uplaodImages(formData, path, user.token);
      await createPost(null, null, text, response, user.id, user.token);
      setloading(false);
      setText("");
      setImages("");
      setVisible(false);

    } else if (text) {
      const response = await createPost(
        null,
        null,
        text,
        null,
        user.id,
        user.token
      );
      setloading(false);
      if (response === "ok") {
        setbackground("");
        setText("")
        setVisible()
      } else {
        seterror(response)
      }

    } else {
      console.log("nothing")
    }
  }
  return (
    <div className="blur">
      <div className="postBox" ref={popUp}>
        {error && <PostError error={error} setError={seterror} />}
        <div className="box_header">
          <div className="small_circle"
            onClick={() => {
              setVisible(false)
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            {/* <div className="box_privacy">
              {/* <img src="../../../icons/public.png" alt="" /> */}
              {/* <span>Public</span> */}
              {/* <i className="arrowDown_icon"></i> */}
            {/* </div> */} 
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPrev={showPrev}
              background={background}
              setbackground={setbackground}
            />
          </>
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            seterror={seterror}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />
        <button className="post_submit" onClick={() => {
          submitPost()
        }}
          disabled={loading}
        >
          {loading ? <PulseLoader color='black' size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}

import { Feeling, LiveVideo, Photo } from "../../svg";
import UserMenu from "../header/UserMenu";
import "./style.css";
export default function CreatePost({ user ,setVisible}) {
  return (
    <div className="createPost">
      <div className="createPost_header">
        <img src={user?.picture} alt="" />
        <div className="open_post hover2" onClick={()=>{
          setVisible(true)
        }}>
          What's on your mind, {user?.first_name}
        </div>
      </div>
      <div className="create_splitter"></div>
      <div className="createPost_body">
        <div className="createPost_icon hover1">
          <LiveVideo color="black" />
          Live Video
        </div>
        <div className="createPost_icon hover1">
          <Photo color="black" />
          Photo/Video
        </div>
        <div className="createPost_icon hover1">
          <Feeling color="black" />
          Feeling/Activity
        </div>
      </div>
    </div>
  );
}

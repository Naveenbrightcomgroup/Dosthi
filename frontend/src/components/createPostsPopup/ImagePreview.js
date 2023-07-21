import { useRef } from "react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";

export default function ImagePreview({
    text,
    user,
    setText,
    images,
    setImages,
    seterror
}) {
    const imageInputRef = useRef(null);
    const handleImages = (e) => {
        let files = Array.from(e.target.files);
        files.forEach((img) => {
          console.log(img);
          if (
            img.type !== "image/jpeg" &&
            img.type !== "image/png" &&
            img.type !== "image/webp" &&
            img.type !== "image/gif"
          ) {
            seterror(
              `${img.name} format is unsupported ! only Jpeg, Png, Webp, Gif are allowed.`
            );
            files = files.filter((item) => item.name !== img.name);
            return;
          } else if (img.size > 1024 * 1024) {
            seterror(`${img.name} size is too large max 5mb allowed.`);
            files = files.filter((item) => item.name !== img.name);
            return;
          } else {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = (readerEvent) => {
              setImages((images) => [...images, readerEvent.target.result]);
            };
          }
        });
      };
    return (
        <div className="overflow_a scrollbar">
            <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />
            <div className="add_pics_wrap">
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    hidden
                    ref={imageInputRef}
                    onChange={handleImages}
                />
                {images && images.length ? (
                    <div className="add_pics_inside1 p0">
                        <div className="preview_actions">
                            <button className="hover1">
                                <i className="edit_icon"></i>
                                Edit
                            </button>
                            <button className="hover1">
                                <i className="addPhoto_icon"></i>
                                Add Photos/Videos
                            </button>
                        </div>
                        <div className="small_white_circle" onClick={()=>{
                            setImages([])
                        }}>
                            <i className="exit_icon"></i>
                        </div>
                        <div className={images.length === 1 ? "preview1" :
                            images.length === 2 ? 'preview2' :'preview3'
                        }>
                            {images.map((img, i) => (
                                <img src={img} key={i} alt="" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="add_pics_inside1">
                        <div className="small_white_circle">
                            <i className="exit_icon"></i>
                        </div>
                        <div
                            className="add_col"
                            onClick={() => {
                                imageInputRef.current.click();
                            }}
                        >
                            <div className="add_circle">
                                <i className="addPhoto_icon"></i>
                            </div>
                            <span>Add Photos/Videos</span>
                            <span>or drag and drop</span>
                        </div>
                    </div>
                )}
                {/* <div className="add_pics_inside2">
                    <div className="add_circle">
                        <i className="phone_icon"></i>
                    </div>
                    <div className="mobile_text">Add phots from your mobile device.</div>
                    <span className="addphone_btn">Add</span>
                </div> */}
            </div>
        </div>
    );
}

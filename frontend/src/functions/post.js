import axios from "axios";
export const createPost = async (
    type,
    text,
    background,
    images,
    user,
    token
) => {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/createPost`,
            {
                type,
                text,
                background,
                images,
                user,
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        );
        return "ok"
    } catch (error) {
        return error.response.data.message;
    }
}
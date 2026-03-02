import { Post } from "../models/post.model.js";

/* ================= CREATE POST ================= */
const createPost = async (req, res) => {
  try {
    const { name, description, age } = req.body;

    // basic validation
    if (!name || !description || !age) {
      return res.status(400).json({
        message: "All fields are required!"
      });
    }

    const post = await Post.create({
      name,
      description,
      age
    });

    return res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// Read all Posts
const getPosts = async (req, res) => {
    try {
const posts = await Post.find();
res.status(200).json(posts);
    } catch (error){
 return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
    }
}

//Update post
const updatePost = async (req, res) => {
    try {
        //basic validation of check if the body is empty or not

        //{name: x, description: y, age: z}->[]
        //{} = truthy
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body cannot be empty"
            });
        }

        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!post) {
            return res.status(404).json({
                message: "Post not found with id " + req.params.id
            })
        }
        return res.status(200).json({
            message: "Post updated successfully",
            post
        });
    }
    catch (error) {
        return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
}
}

//Delete the post
const deletePost = async (req,res) => {
    try{
const deleted = await Post.findByIdAndDelete(req.params.id);
if(!deleted) return res.status(404).json ({
    message: "Post not found"
});

res.status(200).json({
    message: "Post deleted successfully"
})
    }
    catch(error){
return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
    }
}
export { 
    createPost,
    getPosts,
    updatePost,
     deletePost
};
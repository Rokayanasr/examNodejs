const Blog = require('../models/blog');

const addBlog = async (_title, _body, _photo, _author, _tags) => {
    try {
        let data = await Blog.create({
            title: _title,
            body: _body,
            photo: _photo,
            author: _author,
            tags: _tags
        });

        if (data) {
            return data;
        } else {
            throw new Error("ERROR IN CONTROLLER");
        }
    } catch (error) {
        throw new Error("Internal server error in controller");
    }
}
const deleteBlog = async (id) => {
    try {
        let data = await Blog.findByIdAndDelete({_id: id });
        if (data) {
            console.log('deleted successfully');
        } else {
            console.log("cannot delete");
        }
    } catch (e) {
        console.log('Error in deleting user:', e);
    }
}

const editBlog = async (id, _newTitle, _newBody) => {
    try {
        let data = await Blog.findByIdAndUpdate(
            { _id: id },
            { title: _newTitle, body: _newBody },
        );
        if (data) {
            return data;
        } else {
            throw new Error("Blog not found");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Internal server error in controller");
    }
};


module.exports = {addBlog,deleteBlog , editBlog}
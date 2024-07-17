const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((previous, current) => 
        (previous && previous.likes > current.likes) ? previous : current
    )
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

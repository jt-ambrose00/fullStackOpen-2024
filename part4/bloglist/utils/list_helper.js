const _ = require('lodash')

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

const mostBlogs = (blogs) => {
    const totalBlogs = _.values(_.groupBy(blogs, 'author'))
        .map(b => ({
            author: b[0].author,
            blogs: b.length 
        }))
    return _.maxBy(totalBlogs, 'blogs')
}

const mostLikes = (blogs) => {
    const likedBlogs = _.groupBy(blogs, 'author')
    const totalLikes = _.map(likedBlogs, (blog, author) => ({
            author,
            likes: _.sumBy(blog, 'likes')
        }))
    return _.maxBy(totalLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

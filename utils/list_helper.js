const dummy = (blogs) => {
    console.log(blogs)
    return 1
}

const totalLikes = (list) => {
    let total = 0
    list.forEach(el => total += el.likes)
    return total
}

const favoriteBlog = (list) => {
    console.log(list.length)
    if (list.length === 0) { return [] }
   
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
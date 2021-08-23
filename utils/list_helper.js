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
    if (list.length === 0) { return [] }
    //criar um elemento dummy para comparar
    let dummy = {
        title: "",
        author: "",
        url: "",
        likes: 0
    }
    // console.log(dummy.likes)
    for (let i = 0; i < list.length; i++){
        if(list[i].likes > dummy.likes){
            dummy = list[i]
        }
    }
    return [dummy]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
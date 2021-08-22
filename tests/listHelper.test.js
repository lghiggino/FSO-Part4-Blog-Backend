const listHelper = require("../utils/list_helper")

describe("DUMMY", () => {
    test("dummy returns one", () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe("Total likes", () => {
    it("should return zero on an empty list", () => {
        const list = []
        const result = listHelper.totalLikes(list)
        expect(result).toBe(0)
    })

    it("should equal the likes of a single post when the list only have one item", () => {
        const list = [
            {
                title: "blog title",
                author: "Leonardo Ghiggino",
                url: "www.reddit.com",
                likes: 12
            }
        ]
        const result = listHelper.totalLikes(list)
        expect(result).toBe(12)
    })

    it("should calculate the correct ammount of likes for a larger list", () => {
        const list = [
            {
                title: "blog title",
                author: "Leonardo Ghiggino",
                url: "www.reddit.com",
                likes: 12
            },
            {
                title: "blog title",
                author: "Leonardo Ghiggino",
                url: "www.reddit.com",
                likes: 12
            },
            {
                title: "blog title",
                author: "Leonardo Ghiggino",
                url: "www.reddit.com",
                likes: 12
            }
        ]
        const result = listHelper.totalLikes(list)
        expect(result).toBe(36)
    })
})

describe("favorite blog", () => {
    it("should return an empty array if the list is empty", () => {
        const list = []
        const result = listHelper.favoriteBlog(list)
        expect(result).toEqual([])
    })

    it("should return the blog post with the most likes", () => {
        const list = [
            {
                title: "blog title",
                author: "Leonardo Ghiggino",
                url: "www.reddit.com",
                likes: 12
            },
            {
                title: "half blog title",
                author: "Leon Ghigg",
                url: "www.red.com",
                likes: 6
            }
        ]
        const result = listHelper.favoriteBlog(list)
        expect(result).toEqual([
            {
                title: "blog title",
                author: "Leonardo Ghiggino",
                url: "www.reddit.com",
                likes: 12
            }
        ])
    })

})
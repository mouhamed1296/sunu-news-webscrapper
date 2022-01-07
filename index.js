const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const url = "https://www.igfm.sn/"
const url2 = "https://2stv.net"
const url3 = "http://www.walf-groupe.com"
const url4 = "https://www.senenews.com/"
const articles = []
const tfm = []
const _2s = []
const walf = []
const senenews = []
const all = {
    "tfm": [],
    "2s": [],
    "walf": [],
    "senenews": []
}

app.get("/senenews", (req, res) => {
    axios(url4)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a.secondUneFloat', html).each(
            function () {
                const post_url = $(this).attr('href')
                const title = $(this)
                    .find('div.secondUneHome')
                    .find('img.imgSecondUneHome').attr('alt')
                articles.push({
                    title,
                    post_url
                })
            }
        )
    }).catch((error) => console.log(error))
    res.json(articles)
})

app.get("/walf", (req, res) => {
    axios(url3)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('figure.mh-custom-posts-thumb', html).each(
            function () {
                const post_url = $(this).find('a').attr('href')
                const title = $(this).find('a').attr('title')
                const image = $(this)
                    .find('a')
                    .find('img')
                    .attr('src')
                articles.push({
                    title,
                    image,
                    post_url
                })
            }
        )
    }).catch((error) => console.log(error))
    res.json(articles)
})
app.get("/2s", (req, res) => {
    axios(url2)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('figure.mh-posts-grid-thumb', html).each(
            function () {
                const post_url = $(this).find('a').attr('href')
                const title = $(this).find('a').attr('title')
                const image = $(this)
                    .find('a')
                    .find('img')
                    .attr('src')
                articles.push({
                    title,
                    image,
                    post_url
                })
            }
        )
    }).catch((error) => console.log(error))
    res.json(articles)
})

app.get("/tfm", (req, res) => {
    axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:has(p.small_title)', html).each(
            function() {
                const post_url = `${url + $(this).attr('href')}`
                const title = $(this).find('p.small_title').text()
                const image = `${url + $(this)
                    .find('p.small_title')
                    .parent()
                    .closest('div')
                    .parent()
                    .find('> div')
                    .attr('style')
                    .match(/\((.*)\)/gi)[0]
                    .replaceAll('(', '')
                    .replaceAll("'", '')
                    .replaceAll(')', '')}`
                if (image.startsWith(`${url}..`)){
                    articles.push({
                        title,
                        image,
                        post_url
                    })
                }
            }
        )
    }).catch((error) => console.log(error))
    res.json(articles)
})

app.get("/all", (req, res) => {
    axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:has(p.small_title)', html).each(
            function() {
                const post_url = `${url + $(this).attr('href')}`
                const title = $(this).find('p.small_title').text()
                const image = `${url + $(this)
                    .find('p.small_title')
                    .parent()
                    .closest('div')
                    .parent()
                    .find('> div')
                    .attr('style')
                    .match(/\((.*)\)/gi)[0]
                    .replaceAll('(', '')
                    .replaceAll("'", '')
                    .replaceAll(')', '')}`
                if (image.startsWith(`${url}..`)){
                    tfm.push({
                        title,
                        image,
                        post_url
                    })
                }
            }
        )
        axios(url2)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('figure.mh-posts-grid-thumb', html).each(
                function () {
                    const post_url = $(this).find('a').attr('href')
                    const title = $(this).find('a').attr('title')
                    const image = $(this)
                        .find('a')
                        .find('img')
                        .attr('src')
                    _2s.push({
                        title,
                        image,
                        post_url
                    })
                }
            )
            axios(url3)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)
                $('figure.mh-custom-posts-thumb', html).each(
                    function () {
                        const post_url = $(this).find('a').attr('href')
                        const title = $(this).find('a').attr('title')
                        const image = $(this)
                            .find('a')
                            .find('img')
                            .attr('src')
                        walf.push({
                            title,
                            image,
                            post_url
                        })
                    }
                )
                axios(url4)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    $('a.secondUneFloat', html).each(
                        function () {
                            const post_url = $(this).attr('href')
                            const title = $(this)
                                .find('div.secondUneHome')
                                .find('img.imgSecondUneHome').attr('alt')
                            senenews.push({
                                title,
                                post_url
                            })
                        }
                    )
                }).catch((error) => console.log(error))
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }).catch((error) => console.log(error))
    all.tfm = [...tfm]
    all['2s'] = [..._2s]
    all.walf = [...walf]
    all.senenews = [...senenews]
    res.json(all)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
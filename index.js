const PORT = 80
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const urls = {
    "tfm": "https://www.igfm.sn/",
    "2s": "https://2stv.net",
    "walf": "http://www.walf-groupe.com",
    "senenews": "https://www.senenews.com/"
}
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

function getTfmNews() {
    axios(urls.tfm)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:has(p.small_title)', html).each(
            function() {
                const post_url = `${urls.tfm + $(this).attr('href')}`
                const title = $(this).find('p.small_title').text()
                const image = `${urls.tfm + $(this)
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
                if (image.startsWith(`${urls.tfm}..`)){
                    tfm.push({
                        title,
                        image,
                        post_url
                    })
                }
            }
        )
    }).catch((error) => console.log(error))
}

function get2sNews() {
    axios(urls["2s"])
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
    }).catch((error) => console.log(error))
}

function getWalfNews() {
    axios(urls.walf)
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
    }).catch((error) => console.log(error))
}

function getSeneNews() {
    axios(urls["senenews"])
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
}

app.get("/", (req, res) => {
    res.send('Welcome to sunu-news-scrapper Api')
})

app.get("/all", (req, res) => {
    if (req.query.tv) {
        let response = []
        switch (req.query.tv) {
            case "senenews":
                getSeneNews()
                response = [...senenews]
                break
            case "tfm":
                getTfmNews()
                response = [...tfm]
                break
            case "walf":
                getWalfNews()
                response = [...walf]
                break
            case "2s":
                get2sNews()
                response = [..._2s]
                break
            default:
                res.send('invalid tv name')
        }
        res.json(response)
    } else {
        getTfmNews()
        get2sNews()
        getWalfNews()
        getSeneNews()              
        all.tfm = [...tfm]
        all['2s'] = [..._2s]
        all.walf = [...walf]
        all.senenews = [...senenews]
        res.json(all)
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
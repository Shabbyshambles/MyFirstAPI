const PORT = process.env.port || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { json } = require('express')

const app = express()

const articles = []

const newspapers = [
{
     name: "times",
     address: "https://www.thetimes.co.uk/environment/climate-change", 
     base: "The Times"
    },   
{
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "The Guardian"
},
{
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: "The Telegraph"
},
{
    name: 'bbc',
    address: 'https://www.bbc.co.uk/news/science-and-environment',
    base: "The BBC"
},
{
    name: 'es',
    address: 'https://ww.standard.co.uk/topic/climate-change',
    base: "The Standard"
},
{
    name: 'sun',
    address: 'https://www.thesun.co.uk/topic/climate-change.environment/',
    base: "The Sun"
},
{
    name: 'dm',
    address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
    base: "The Daily Mail"
},
{
    name: 'nyp',
    address: 'https://nypost.com/tag/climate-change',
    base: "The NY Post"
},
{
    name: 'nyt',
    address: 'https://www.nytimes.com/international/section/climate',
    base: "The NY Times"
},
{
    name: 'latimes',
    address: 'https://www.latimes.com/environment',
    base: 'The LA Times'
},
{
    name: 'un',
    address: 'https://www.un.org/climatechange',
    base: 'The United Nations'
}
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
         .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newspaper.base 
                })
            })
            
        })
})


app.get('/', (req, res ) => {
    res.json('Welcome to my API')
})

app.get('/news', (req, res) => {
    res.json(articles)
        })
        
app.get('/news/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperaddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperbase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    axios.get(newspaperaddress)
         .then(response => {
             const html = response.data
             const $ = cheerio.load(html)
             const specificarticles = []

             $('a:contains("climate")', html).each(function() {
                 const title = $(this).text()
                 const url = $(this).attr('href')
                 specificarticles.push({
                     title,
                     url,
                     source: newspaperbase
                 })
             })
             res.json(specificarticles)
         }).catch(err => console.log(err))
    })
app.listen(PORT, () => console.log('server running on PORT ${PORT}' ))

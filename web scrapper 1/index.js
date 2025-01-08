const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require("json2csv").Parser;
const axios = require('axios')


const url = "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html"

const ha = async () => {
    let booksData = [];
    try {
        const { data } = await axios.get(url, {
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "en-US,en;q=0.9",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });
    
        let $ = cheerio.load(data)
        // console.log($)
        // console.log($.html());

        // let name = $("#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-afa4bed1-0.iMxoKo > section > div:nth-child(5) > section > section > div.sc-9a2a0028-3.bwWOiy > div.sc-70a366cc-0.bxYZmb > h1 > span")
        // const name = $("td.titleColumn a").first().text();
        // const name = $('h1[class="sc-ec65ba05-0 dUhRgT"] > span').text();
        // const name = $('h1[class="sc-ec65ba05-0 dUhRgT"] > span');
        const name = $('div[class="col-sm-6 product_main"] > h1').text();
        const price = $('div[class="col-sm-6 product_main"] > p').first().text().trim();
        const desc = $('article[class="product_page"] > p').text();
    
        // console.log("Book name is:",name)
        // console.log("Book price is:",price)
        // console.log("Book Desc is:",desc)

        booksData.push({name, price, desc})

        const j2cp = new json2csv()
        const csv = j2cp.parse(booksData)

        fs.writeFileSync('./books.csv', csv, "utf-8");

    } catch (error) {
        console.log("Error while Scraping:", error)
    }
};

ha();
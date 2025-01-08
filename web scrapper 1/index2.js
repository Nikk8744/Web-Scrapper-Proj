const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require("json2csv").Parser;
const axios = require('axios')


// const baseUrl = "https://books.toscrape.com/catalogue/";
// const mainUrl = "https://books.toscrape.com/";

let booksData = [];

const ha = async () => {
    let pageNumber = 1;


    while (true) {
        try {
            const pageUrl = `https://books.toscrape.com/catalogue/page-${pageNumber}.html`;
        
            const { data } = await axios.get(pageUrl
            //     , {
            //     headers: {
            //         "accept": "*/*",
            //         "accept-encoding": "gzip, deflate, br, zstd",
            //         "accept-language": "en-US,en;q=0.9",
            //         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            //     },
            // }
        );
            let $ = cheerio.load(data)

            const books = $('article.product_pod');
            if (books.length === 0) {
                console.log("No more books found, ending scraping.");
                break;
            }

            // const bookLinks = [];
            books.each((index, element) => {
                // const relativeLink = $(element).attr('href');
                // const fullLink = `${baseUrl}${relativeLink}`;
                // console.log("This is the fulllllll linkkkkkkkkkk",fullLink)
                // bookLinks.push(fullLink);
                const bookName = $(element).find('h3 > a').attr('title'); // Get the book name
                const bookSlug = bookName.replace(/\s+/g, '-').toLowerCase(); 

                const bookUrl = `https://books.toscrape.com/catalogue/${bookSlug}-${pageNumber}/index.html`;
                // const bookData = scrapeDataOfBook(bookUrl);
                console.log(bookUrl)

                const bookData = scrapeDataOfBook(bookUrl); // Wait for the book data
                if (bookData) {
                    booksData.push({
                        name: bookData.name,
                        price: bookData.price,
                        desc: bookData.desc,
                        url: bookUrl
                    });
                }
                // console.log(bookData)
                // booksData.push({ name:bookData.name, desc: bookData.desc , url: bookUrl });

            });

            console.log(`Scraped page ${pageNumber} successfully.`);
            pageNumber++;
    
        } catch (error) {
            console.log("Error while Scraping:", error)
        }
    }
    const j2cp = new json2csv();
    const csv = j2cp.parse(booksData);
    fs.writeFileSync('./books2.csv', csv, "utf-8");
    console.log("Books data scraped and saved to 'books2.csv'");
};


const scrapeDataOfBook = async(bookurl) => {
    try {
        const { data } = await axios.get(bookurl, {
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "en-US,en;q=0.9",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });
    
        let $ = cheerio.load(data)

        const name = $('div[class="col-sm-6 product_main"] > h1').text();
        const price = $('div[class="col-sm-6 product_main"] > p').first().text().trim();
        const desc = $('article[class="product_page"] > p').text();
        console.log("The name is:",  name)
        console.log("The desc is:",  desc)
        return {name, price, desc}

    } catch (error) {
        console.log("Error while Scraping:", error)
        return null;
    }
}

ha();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require("json2csv").Parser;
const cron = require('node-cron');

let booksData = []; 


const scrapeBooks = async (pages, fileName) => {
    let pageNumber = 1;

    while (pageNumber<=pages) {
        try {
            const pageUrl = `https://books.toscrape.com/catalogue/page-${pageNumber}.html`; 
            const { data } = await axios.get(pageUrl); 
            let $ = cheerio.load(data); 

            const books = $('article.product_pod'); // to get all books on the page

            
            if (books.length === 0) {
                console.log("No more books found, ending scraping.");
                break;
            }

            // Loop through each book and extract data
            // books.each((index, element) => {
            for (const element of books.toArray()) {
                const bookName = $(element).find('h3 > a').attr('title'); // Get the book name
                const price = $(element).find('.price_color').text().trim(); // Get the price

                // const bookUrl = `https://books.toscrape.com/catalogue/${bookSlug}-${pageNumber }/index.html`;
                const bookUrl = $(element).find('h3 > a').attr('href');
                const description = await getDesc1(bookUrl);
                // const description = getDesc(bookSlug);

                // const description = $(element).find('p').first().text().trim(); // Get the description
                // console.log("The desc is: ",description)
                            
                booksData.push({ name: bookName, price, desc:description});
            }
            // });

            console.log(`Scraped page ${pageNumber} successfully.`);
            pageNumber++; // to move to the next page
        } catch (error) {
            console.log("Error while scraping:", error);
            break; 
        }
    }

    // Convrt books data to CSV and save to a file
    const j2cp = new json2csv();
    const csv = j2cp.parse(booksData);
    fs.writeFileSync(`./CsvFiles/${fileName}.csv`, csv, 'utf-8'); 
    console.log("Data saved to books_final.csv");
};


// const getDesc = async(bookSlug) =>  {
//     let bookNumber = 1000;
    
//     for (let index = 0; index <= 19; index++) {
//         bookNumber = bookNumber - index;
//         let newBookUrl = `https://books.toscrape.com/catalogue/${bookSlug}-${bookNumber}/index.html`;            
//         console.log(newBookUrl)
//         try {
//             const { data } = await axios.get(newBookUrl);
//             let $ = cheerio.load(data);
//             const desc = $('article[class="product_page"] > p').text().trim();
//             return desc;
//         } catch (error) {
//             console.log("Error while fetching the description:",bookSlug, "at atttempt", bookNumber)
//         }
//     }

//     return '';
//     // const { data } = await axios.get(bookUrl);
//     // let $ = cheerio.load(data);
//     // const desc = $('article[class="product_page"] > p').text();

//     // return desc;
// }

const getDesc1 = async(bookUrl) =>  {
    try {
        const fullURL = `https://books.toscrape.com/catalogue/${bookUrl}`
        // console.log(fullURL)
        const { data} = await axios.get(fullURL);
        let $ = cheerio.load(data);
        const desc = $('article[class="product_page"] > p').text().trim();
        // console.log(`The description for ${bookUrl} :`, desc)
        return desc || "Description is not avaliable";
    } catch (error) {
        console.log("Error while fetching URL:", fullURL);
        return 'Description NOT FOUNDDDDD';
    }
}

cron.schedule('* * * * * ', () => {

    const fileName = "book_data";
    const pages = 2;
    const date = new Date();
    console.log(`Scheduling started ${date.getDay()}-   ${date.getHours()}grs|${date.getMinutes()}min`);
    // console.log(`Scheduling started`, new Date());
    scrapeBooks(pages, fileName);

})

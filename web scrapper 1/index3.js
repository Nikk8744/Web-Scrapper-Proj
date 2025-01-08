const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require("json2csv").Parser;

let booksData = []; 


const scrapeBooks = async () => {
    let pageNumber = 1;

    while (pageNumber<=10) {
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
            books.each((index, element) => {
                const bookName = $(element).find('h3 > a').attr('title'); // Get the book name
                // const bookSlug = bookName.replace(/\s+/g, '-').toLowerCase(); //book name ko url friendly format mai convert krne ke liye
                const price = $(element).find('.price_color').text().trim(); // Get the price
                const description = $(element).find('p').first().text().trim(); // Get the description
                console.log("The desc is: ",description)
                
                // const bookUrl = `https://books.toscrape.com/catalogue/${bookSlug}-${pageNumber}/index.html`;

              
                // booksData.push({ name: bookName, price, description, url: bookUrl });
                booksData.push({ name: bookName, price, desc:description});
            });

            console.log(`Scraped page ${pageNumber} successfully.`);
            pageNumber++; // to move to the next page
        } catch (error) {
            console.log("Error while scraping:", error);
            break; 
        }
    }

    // Convert books data to CSV and save to a file
    const j2cp = new json2csv();
    const csv = j2cp.parse(booksData);
    fs.writeFileSync('./CsvFiles/books_new1.csv', csv, 'utf-8'); 
    console.log("Data saved to books.csv");
};


scrapeBooks();

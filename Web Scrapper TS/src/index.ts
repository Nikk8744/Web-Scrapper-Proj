const axios = require('axios');
const cheerio = require('cheerio');

interface Book {
    name: string;
    price: string;
    desc: string;
}

let booksData: Book[] = [];

const scrapeBooks = async (pages: number, fileName: string): Promise<void> => {
    let pageNumber = 1;

    while (pageNumber <= pages) {
        
        const url = `https://books.toscrape.com/catalogue/page-${pageNumber}html`;
        const { data } = await axios.get(url);
        let $ = cheerio.load(data);

        const bookList = $('article.product_pod');

        if(bookList.length === 0){
            console.log(`No books found on page ${pageNumber}`);
            break;
        }

        for(const element of bookList.toArray()){
            // const bookName = $(element).find('h3 > a').text();
            const bookName = $(element).find('h3 > a').attr('title');
            const bookPrice = $(element).find('p.price_color').text().trim();

            const bookUrl = $(element).find('h3 > a').attr('[href');
            const bookDesc = await getDesc(bookUrl)


            
        }
    }
}

const getDesc = async (bookUrl: String): Promise<string> => {
    const fullURL = `https://books.toscrape.com/catalogue/${bookUrl}`;
    
    const { data } = await axios.get(fullURL);
    const $ = cheerio.load(data);
}

const pages = 2;
const fileName = 'books';

scrapeBooks(pages, fileName );




// import axios from 'axios';
// import cheerio from 'cheerio';
// import fs from 'fs';
// import { Parser } from 'json2csv';
// import cron from 'node-cron';

// // Declare the structure of book data
// interface Book {
//   name: string;
//   price: string;
//   desc: string;
// }

// // Array to hold scraped book data
// let booksData: Book[] = []; 

// // Function to scrape books from the website
// const scrapeBooks = async (pages: number, fileName: string): Promise<void> => {
//   let pageNumber = 1;

//   while (pageNumber <= pages) {
//     try {
//       const pageUrl = `https://books.toscrape.com/catalogue/page-${pageNumber}.html`; 
//       const { data } = await axios.get(pageUrl); 
//       const $ = cheerio.load(data); 

//       const books = $('article.product_pod'); // to get all books on the page

//       if (books.length === 0) {
//         console.log("No more books found, ending scraping.");
//         break;
//       }

//       // Loop through each book and extract data
//       for (const element of books.toArray()) {
//         const bookName = $(element).find('h3 > a').attr('title') || "Unknown"; // Get the book name
//         const price = $(element).find('.price_color').text().trim(); // Get the price

//         const bookUrl = $(element).find('h3 > a').attr('href') || ""; // Get the book URL
//         const description = await getDesc1(bookUrl);
        
//         booksData.push({ name: bookName, price, desc: description });
//       }

//       console.log(`Scraped page ${pageNumber} successfully.`);
//       pageNumber++; // to move to the next page
//     } catch (error) {
//       console.log("Error while scraping:", error);
//       break; 
//     }
//   }

//   // Convert books data to CSV and save to a file
//   const j2cp = new Parser();
//   const csv = j2cp.parse(booksData);
//   fs.writeFileSync(`./CsvFiles/${fileName}.csv`, csv, 'utf-8'); 
//   console.log("Data saved to books_final.csv");
// };

// // Function to get book description
// const getDesc1 = async (bookUrl: string): Promise<string> =>  {
//   try {
//     const fullURL = `https://books.toscrape.com/catalogue/${bookUrl}`;
//     const { data } = await axios.get(fullURL);
//     const $ = cheerio.load(data);
//     const desc = $('article[class="product_page"] > p').text().trim();
//     return desc || "Description is not available";
//   } catch (error) {
//     console.log("Error while fetching URL:", fullURL);
//     return 'Description NOT FOUND';
//   }
// };

// // Cron job to run the scraper at a specified interval
// cron.schedule('* * * * *', () => {
//   const fileName = "book_data";
//   const pages = 2;
//   const date = new Date();
//   console.log(`Scheduling started`, date);
//   scrapeBooks(pages, fileName);
// });

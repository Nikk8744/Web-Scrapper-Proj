const axios = require('axios');
const cheerio = require('cheerio');
const json2csv = require('json2csv').Parser;
const fs = require('fs');
const cron = require('node-cron');

interface Book {
    name: string;
    price: string;
    desc: string;
}

let booksData: Book[] = [];

const scrapeBooks = async (pages: number, fileName: string): Promise<void> => {
    let pageNumber = 1;

    while (pageNumber <= pages) {
        
        const url = `https://books.toscrape.com/catalogue/page-${pageNumber}.html`;
        try {
            const { data } = await axios.get(url);
            let $ = cheerio.load(data);
            // console.log(data)
            const bookList = $('article.product_pod'); // get all book elements
    
            if(bookList.length === 0){
                console.log(`No books found on page ${pageNumber}`);
                break;
            }
            
            // loop through each book element and extract the title, price and description
            for(const element of bookList.toArray()){
                // const bookName = $(element).find('h3 > a').text();
                const bookName = $(element).find('h3 > a').attr('title');
                const bookPrice = $(element).find('p.price_color').text().trim();
    
                const bookUrl = $(element).find('h3 > a').attr('href');

                const bookDescription = await getDesc(bookUrl) // get book description from url
                // console.log(bookUrl)

                // to push the data in the array
                booksData.push({name: bookName, price: bookPrice, desc: bookDescription});          
            }
            
            console.log(`Page ${pageNumber} scraped successfullyyyy`);
            pageNumber++;
        } catch (error) {
            console.error("Error occured while scraping!!");
            break;
        }
    }

    const j2c = new json2csv(); // create a new json2csv object
    const csv = j2c.parse(booksData); // parse the data to csv format
    fs.writeFileSync(`./src/CsvFiles/${fileName}.csv`, csv, 'utf-8'); // write the csv data to a file
    console.log("Data saved to csv file:", fileName,".csv");
}

const getDesc = async (bookUrl: String): Promise<string> => {
    const fullURL = `https://books.toscrape.com/catalogue/${bookUrl}`;
    
   try {
        const { data } = await axios.get(fullURL);
        const $ = cheerio.load(data);
    
        const desc = $('article[class="product_page"] > p').text().trim();
    
        return desc || "Description is not avaliable";
   } catch (error) {
        console.error("Error while fetching the description",error);
        return "Description is not avaliable/found!!";
   }
};

// call the function in cron schedular
cron.schedule('* * * * *', () => {
    const pages = 2;
    const fileName = 'books';
    const d = new Date();

    console.log("Scheduling started at", d.toISOString());
    scrapeBooks(pages, fileName );
})
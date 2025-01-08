## Web Scrapper in JS
This is a simple web scrapper in JavaScript that uses the `axios` library to fetch data from
a website and then parse the HTML content using `cheerio` library. The scrapper is designed to
extract data from a specific website, in this case, a website that displays a list of books.

#### Tools Used:
- `axios` for making HTTP requests
- `cheerio` for parsing HTML content
- `node.js` for running the scrapper
#### Code
```javascript

// This is just an example code

const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://example.com/books'; // Replace with the URL of the website you want
// to scrapper
axios.get(url)
.then(response => {
    const $ = cheerio.load(response.data);
    const bookList = $('div.book-list > ul > li');
    bookList.each((index, element) => {
        const title = $(element).find('h2').text();
        const author = $(element).find('p.author').text();
        console.log(`Title: ${title}, Author: ${author}`);
        });
    })
.catch(error => {
    console.error(error);
});

```
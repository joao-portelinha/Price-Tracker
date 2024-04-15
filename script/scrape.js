const puppeteer = require('puppeteer');
const fs = require('fs');

const productUrls = {
    'Sapphire NITRO+ Radeon RX 7800 XT': 'https://pt.pcpartpicker.com/product/N4P8TW/sapphire-nitro-radeon-rx-7800-xt-16-gb-video-card-11330-01-20g',
    'PowerColor Hellhound OC Radeon RX 7800 XT': 'https://pt.pcpartpicker.com/product/BtkH99/powercolor-hellhound-oc-radeon-rx-7800-xt-16-gb-video-card-rx-7800-xt-16g-loc',
    'ASRock Challenger OC Radeon RX 7800 XT' : 'https://pt.pcpartpicker.com/product/rfV2FT/asrock-challenger-oc-radeon-rx-7800-xt-16-gb-video-card-rx7800xt-cl-16go',
    'ASRock Phantom Gaming OC Radeon RX 7800 XT' : 'https://pt.pcpartpicker.com/product/2NsV3C/asrock-phantom-gaming-oc-radeon-rx-7800-xt-16-gb-video-card-rx7800xt-pg-16go',
};

const csvFilePath = "prices.csv";

async function scrapeProduct(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto(url);
    await page.waitForSelector('.td__finalPrice');
    
    const price = await page.$eval('.td__finalPrice a', element => element.textContent.trim());
    const merchantTag = await page.$eval('.td__finalPrice a', element => element.getAttribute('data-merchant-tag'));

    await browser.close();

    return { price, merchantTag };
}

async function main() {
    const rows = [];
    const currentDate = new Date().toLocaleDateString();
    
    // Push headers as the first row
    rows.push(['Product Name', 'Price', 'Date']);
    
    for (const [productName, url] of Object.entries(productUrls)) {
        try {
            const { price, merchantTag } = await scrapeProduct(url);
            console.log(`${productName} -> ${price}€ (${merchantTag})`);

            const existingRow = rows.find(row => row[0] === productName);
            if (existingRow) {
                existingRow[2] = currentDate;
            } else {
                rows.push([productName, price, currentDate]);
            }
        } catch (error) {
            console.error(`Failed to scrape ${productName}: ${error}`);
        }
    }

    // Convert rows to CSV format and write to file
    const csvData = rows.map(row => row.join(',')).join('\n');
    fs.writeFileSync(csvFilePath, csvData, 'utf-8');
}

main();

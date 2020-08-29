const puppeteer = require('puppeteer');
const readline = require('readline-sync');

const SEARCHTERM = readline.question('Product search term: ');

async function start() {    
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        page.goto(`https://www.google.com.br/search?q=${SEARCHTERM}&source=lnms&tbm=shop&sa=X&ved=2ahUKEwjMwYO69MDrAhXMI7kGHYCGBFcQ_AUoAXoECA8QAw`);
    
        await page.waitFor('.Nr22bf');
        const prices = await page.$$eval('.Nr22bf', prices => prices.map(price => price.innerText));
        const links = await page.$$eval('.shntl.hy2WroIfzrX__merchant-name', links => links.map(link => {
            return {
                href: link.href,
                title: link.innerText,
            }
        }));
    
        let searchResult = prices.reduce((acc, price, index) => {
            const search = {
                value: price,
                title: links[index].title,
                href: links[index].href,
            };
    
            acc.push(search);
    
            return acc;
        }, []);
        
        searchResult = searchResult.sort((a, b) => a.value < b.value ? -1 : 1);
        console.log(searchResult);
    } catch (err) {
        console.error('Erro ->', err);
    }
};

start();
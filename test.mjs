// @ts-check
import {DOMParser, parseHTML} from 'linkedom';
import {readFile, writeFile} from 'fs/promises';
import cheerio from 'cheerio';
/**@type {string} */
const html = await readFile('test.html', 'utf8');

// const url = (a) => `https://www.ingles.com/pronunciacion/${a}`
// await wri§teFile("test.html", "")

// const resp  = await fetch(url("hello"))
// .then(response => response.text())

const {window, document} = parseHTML(html);

function findText(html, searchText) {
    const $ = cheerio.load(html);
    let results = [];

    $('*').each(function() {
        if ($(this).children().length === 0 && $(this).text().includes(searchText)) { // leaf nodes
            results.push(this);
        }
    });

    return results;
}

const nodes = findText(html, "Alfabeto fonético simplificado (AFS)");
const c = cheerio(nodes[0]).parent().html()
const {document: a} = parseHTML(c);

const b = a.querySelector("div:nth-child(2)'")?.innerHTML

nodes.forEach(node => {
  console.log('Found in Tag:', cheerio(node).prop('tagName'));
  cheerio(node).parent().html()
  console.log('Parent HTML:', cheerio(node).parent().html());
});

console.log(nodes);
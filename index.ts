import puppeteer from 'puppeteer'
import {pipe, filter, map, toArray, toAsync,uniq} from '@fxts/core'

function checkValidHref(url: string): boolean {
  return url.startsWith('http')
    || url.startsWith('https')
    || url.startsWith('/');
}

async function run(url: string) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {
    // NOTE: try 'domcontentloaded'
    waitUntil: 'networkidle0'
  })
  const linkElementList = await page.$$('a')
  const linkList = await pipe(
    linkElementList,
    toAsync,
    map(async (element) => {
      const elementHref = await element.getProperty('href')
      const href = await elementHref.jsonValue()
      return href
    }),
    filter((href) => checkValidHref(href)),
    uniq,
    toArray
  )
  console.log(linkList.length)
  await browser.close()
}

run('https://www.kurly.com/main')
const puppeteer = require("puppeteer");
const jwt = require("jwt-simple");
const keys = require("../config/keys");

let browser, page;

beforeEach(async () => {
    // automatically create a page
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto("localhost:3000");
});
afterEach(async () => {
    await browser.close();
});
// all activities handling with browser instance are async!
test("the header has the correct image", async () => {
    // el=>el.src function will be serialized to "el=>el.src" by puppeteer.
    // Then puppeteer sends it over to the chromium browser instance.
    // Then the func string gets turned back to the actual function executed, and
    // then whatever gets returned is turned into string as well and commucated back
    // over to our running NodeJS runtime.
    const src = await page.$eval("img", el => el.src);
    expect(src).toBe("http://localhost:3000/static/media/logo.3ca05336.jpg");
});

test("click login with email starts login process", async()=>{
     await page.click('.withEmail');
     const url = await page.url()
     expect(url).toBe("http://localhost:3000/login")

})

test.only("Once logged in, shows the recommendation page", async()=>{
    const userId = 43;
    const timestamp = new Date().getTime();
    const token = jwt.encode({ sub: userId, iat: timestamp }, keys.secret)

    await page.evaluate((token) => {
          localStorage.setItem('jwtToken', token);
        });
    await page.goto('localhost:3000')
    await page.waitFor('.Recommendation-root-9');
    // here the page has not been loaded completely, so the ele cannot be found
    const result = await page.$('.Recommendation-root-9');
    expect(result).toBeTruthy();
})
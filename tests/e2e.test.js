const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000';

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

let newBook = {
    title: "",
    image: "#",
    year: "1997",
    author:"Dickens",
    genre:"mistery",
    description: "My favorite book"

}

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
    test("Registration with valid data", async ()=>{

        await page.goto(host);
        await page.click("//a[@href='/register']");
        await page.waitForSelector("//form");

        let random = Math.floor(Math.random() * 1000);
        user.email = `email_${random}@abv.bg`;

        await page.fill("//input[@name='email']", user.email);
        await page.fill("//input[@name='password']", user.password);
        await page.fill("//input[@name='conf-pass']", user.confirmPass);
        await page.click("//button[text()='Register']")

        await expect(page.locator("//a[@href='/logout']")).toBeVisible();
        expect(page.url()).toBe(host + '/');

    })  
    test("Login with valid data", async ()=>{

        await page.goto(host);
        await page.click("//a[@href='/login']");
        await page.waitForSelector("//form");

        await page.fill("//input[@name='email']", user.email);
        await page.fill("//input[@name='password']", user.password);

        await page.click("//button[text()='Login']");

        await expect(page.locator("//a[@href='/logout']")).toBeVisible();
        expect(page.url()).toBe(host + '/');

    })
    test("Logout from the application", async ()=>{

        await page.goto(host);
        await page.click("//a[@href='/login']");
        await page.waitForSelector("//form");

        await page.fill("//input[@name='email']", user.email);
        await page.fill("//input[@name='password']", user.password);

        await page.click("//button[text()='Login']");

        await page.click("//a[@href='/logout']");

        await expect(page.locator("//a[@href='/login']")).toBeVisible();
        expect(page.url()).toBe(host + '/');

    })  
        
    });

    describe("navbar", () => {
    test("Navigation for Logged-In user", async ()=>{

        await page.goto(host);
        await page.click("//a[@href='/login']");
        await page.waitForSelector("//form");

        await page.fill("//input[@name='email']", user.email);
        await page.fill("//input[@name='password']", user.password);

        await page.click("//button[text()='Login']");

        await expect(page.locator("//a[text()='Home']")).toBeVisible();
        await expect(page.locator("//a[text()='Collection']")).toBeVisible();
        await expect(page.locator("//a[text()='Search']")).toBeVisible();
        await expect(page.locator("//a[text()='Create Book']")).toBeVisible();
        await expect(page.locator("//a[text()='Logout']")).toBeVisible();

        await expect(page.locator("//a[@href='/login']")).toBeHidden();
        await expect(page.locator("//a[@href='/register']")).toBeHidden();

    })
    test("Navigation for guest user", async ()=>{

        await page.goto(host);
        await expect(page.locator("//a[text()='Home']")).toBeVisible
        await expect(page.locator("//a[text()='Collection']")).toBeVisible();
        await expect(page.locator("//a[text()='Search']")).toBeVisible
        await expect(page.locator("//a[@href='/login']")).toBeVisible();
        await expect(page.locator("//a[@href='/register']")).toBeVisible();

        await expect(page.locator("//a[text()='Create Book']")).toBeHidden();
        await expect(page.locator("//a[text()='Logout']")).toBeHidden();

    })
        
    });

    describe("CRUD", () => {
        beforeEach(async ()=>{
            await page.goto(host);
            await page.click("//a[@href='/login']");
            await page.waitForSelector("//form");
    
            await page.fill("//input[@name='email']", user.email);
            await page.fill("//input[@name='password']", user.password);
    
            await page.click("//button[text()='Login']");


        })
    test("Create a book", async()=>{

        await page.click("//a[text()='Create Book']");

        let random = Math.floor(Math.random() * 1000);
        newBook.title = `Title_${random}`;

        await page.fill("//input[@id='title']", newBook.title);
        await page.fill("//input[@id='coverImage']", newBook.image);
        await page.fill("//input[@id='year']", newBook.year);
        await page.fill("//input[@id='author']", newBook.author);
        await page.fill("//input[@id='genre']", newBook.genre);
        await page.fill("textarea[name='description']", newBook.description);
        await page.click("//button[text()='Save']");

        await expect(page.locator("//div[@class='book']//h2", {hasText: newBook.title})).toHaveCount(1);
        expect(page.url()).toBe(host + '/collection');

    })
    test("Edit a book", async ()=>{

        await page.click("//a[@href='/search]");
        await page.waitForSelector("//form");
        await page.locator('//input[@name="search"]').fill(newBook.title);
        await page.click("//button[@type='submit']");
        await page.click('//li//a');

        await page.click("//a[@class='edit-btn']");
        await page.waitForSelector("//form");
        await page.locator("//input[@id='title']").fill(`${newBook.title}_Edited`);
        await page.click("//button[@class='save-btn']");

        await expect(page.locator(`//div[@class='book-info']//h2`, {hasText: newBook.title})).toHaveCount(1);
        
       

    }) 
    test("Delete a book", async ()=>{

        await page.click("//a[text()='Search']");
        await page.fill("input[type='text']", newBook.title);
        await page.click("//button[text()='Search']");

        await page.click("//div[@class='search-page']//li//a");
        await page.click("//a[@class='delete-btn']")

        await expect(page.locator(`//div[@class='book-info']//h2`, {hasText: newBook.title})).toHaveCount(0);
        expect(page.url()).toBe(host + '/collection');

    })  

        
    });
});
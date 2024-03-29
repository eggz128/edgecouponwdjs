import { WebDriver, Builder, By, Key, until } from 'selenium-webdriver'; //WebDriver is imported explicitly for type hinting
import chai from 'chai'

const expect = chai.expect; //Choose expect style to mirror playwright testrunner
describe('A Suite', async function () {
    this.timeout(0) //Mocha normally times out tests after 2s - this disables timeouts (wont work with arrow syntax)
    /**@type {WebDriver} */
    let driver; //Type annotation above hints to VSCode the type for better intellisense
    beforeEach(async function () {
        console.log(`Running ${this.currentTest.title}`)
        driver = new Builder().forBrowser('chrome').build()
        //await driver.manage().window().maximize()
        await driver.manage().window().setRect({ width: 1024, height: 768 })
        await driver.get('https://www.edgewordstraining.co.uk/demo-site')
        await driver.findElement(By.linkText('Dismiss')).click()
    });
    afterEach(async function () {
        await driver.sleep(2000)
        await driver.findElement(By.css('[aria-label="Remove this item"]')).click()
        //Short animation as item removed - need to wait for "Return To Shop" link before clicking
        await driver.wait(until.elementLocated(By.linkText('Return to shop')), 3000)
            .then(returnLink => returnLink.click())
        await driver.sleep(3000) //3 second dumb wait before close
        await driver.quit()
    });
    //Orders 2 caps, uses drop down to navigate to cart,  applies edgewords coupon, asserts on coupon discount amount
    it('Coupon test', async function () {

        {   //Real keyboard events unlike Cypress and Playwright?
            //wait driver.findElement(By.css('input[placeholder="Search products…"]')).click()
            //await driver.actions().keyDown(Key.SHIFT).sendKeys('cap').keyUp(Key.SHIFT).pause(3000).perform()
        }
        /*
        * Arrange
        */
        await driver.findElement(By.css('input[placeholder="Search products…"]')).sendKeys('Cap' + Key.ENTER)

        await driver.findElement(By.css('button[name=add-to-cart]')).click()
        { //Do mouse hover to show drop down
            const dropDownCartMenu = await driver.findElement(By.id('site-header-cart'))
            await driver.actions().move({ origin: dropDownCartMenu }).pause(500).perform()
        }
        // Click link in drop down
        // await driver.findElement(By.className('widget_shopping_cart_content')) 
        //     .findElement(By.partialLinkText('View cart')).click();

        // Might be best to wait - here in two steps
        // const cartLink = await driver.wait(async function (driver) {
        //     return await driver.findElement(By.className('widget_shopping_cart_content')).findElement(By.partialLinkText('View cart')); //chained to ensure link is from drop down
        // }, 5000)
        // await cartLink.click()

        //wait using just one 'step', and arrow function syntax
        await driver.wait(async (driver) => { //using own function. Will retry until not falsy / timeout
            return await driver.findElement(By.className('widget_shopping_cart_content')).findElement(By.partialLinkText('View cart')) //chained to ensure link is from drop down
        }, 5000)
            .then(link => link.click()); //as wait returns promise of elm, can then() it. This is a JS standard then - not a Cypress (Bluebird) then()


        /*
        *Act
        */
        await driver.findElement(By.css('input[id^="quantity"]')).clear()
        await driver.findElement(By.css('input[id^="quantity"]')).sendKeys('2')
        await driver.findElement(By.css('button[value="Update cart"]')).click()
        //Wait for cart to be updated or coupon may not apply properly
        await driver.wait(async (driver) => {
            console.log('Waiting')
            let expectedAlertMessage
            try {
                expectedAlertMessage = await driver.findElement(By.css('[role=alert]')).getText()
            } catch (e) {
                return false
            }
            return (expectedAlertMessage.includes('Cart updated.'))
        }, 3000)
        await driver.findElement(By.css('label[for^=coupon] + input')).sendKeys('edgewords')
        await driver.findElement(By.css('button[value="Apply coupon"]')).click()
        //Wait for JS to update page or risk stale/detached elements
        await driver.wait(until.elementLocated(By.css('[data-title^="Coupon"] > .amount')), 5000)

        const cartTotals = await driver.findElement(By.css('.cart_totals table'))
        let subTotal = await cartTotals.findElement(By.css('[data-title="Subtotal"')).getText()
        let couponDiscount = await cartTotals.findElement(By.css('[data-title^="Coupon"] > .amount')).getText() //May also need to wait for coupon to apply earlier
        let shipping = await cartTotals.findElement(By.css('label[for^=shipping] > .amount')).getText()
        let total = await cartTotals.findElement(By.css('[data-title=Total] .amount')).getText()
        console.log(`Checking values have been captured: ${subTotal} ${couponDiscount} ${shipping} ${total}`);
        /*
        * Assert
        */
        //Strip £, convert to whole pennies for calc purposes. There are better suited external libraries for monetary/currency calculations, but this avoids extra dependencies
        let textTotals = [subTotal, couponDiscount, shipping, total].map(function (x) { return x.replace('£', '') })
        let [subTotalPennies, couponDiscountPennies, shippingPennies, totalPennies] = textTotals.map(text => parseFloat(text) * 100)

        console.log(`Checking conversion to pennies worked: ${subTotalPennies} ${couponDiscountPennies} ${shippingPennies} ${totalPennies}`);

        //Test calculates 15% discount for comparison with site calculation
        let calculatedDiscount = Math.round(subTotalPennies * 0.15) //rounding to avoid possible fractions of a penny
        //calculatedDiscount -= 1; //Saboutage test to check assertion
        console.log(`Captured values:
        CapturedPennies,CapturedDiscountPennies,CapturedShippingPennies,CapturedTotalPennies : Sub-Discount+Shipping=Total
        ${[subTotalPennies, couponDiscountPennies, shippingPennies, totalPennies]} : ${subTotalPennies - couponDiscountPennies + shippingPennies == totalPennies}
        CapturedPennies,CalculatedDiscountPennies,CapturedShippingPennies,CapturedTotalPennies : Sub-Discount+Shipping=Total
        ${[subTotalPennies, calculatedDiscount, shippingPennies, totalPennies]} : ${subTotalPennies - calculatedDiscount + shippingPennies == totalPennies}
        `)
        //Chai expect style assert. Similar to Playwright bundled Jest expect.
        expect(couponDiscountPennies).to.equal(calculatedDiscount)
    });
});
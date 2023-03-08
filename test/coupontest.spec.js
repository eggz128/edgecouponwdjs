import { Builder, By, Key, until } from 'selenium-webdriver';
import chai from 'chai'
const expect = chai.expect;
describe('A Suite', async function () {
    this.timeout(0)
    let driver;
    beforeEach(async function () {
        driver = new Builder().forBrowser('MicrosoftEdge').build()
        await driver.get('https://www.edgewordstraining.co.uk/demo-site')
        await driver.findElement(By.linkText('Dismiss')).click()
    });
    afterEach(async function () {
        await driver.sleep(3000)
        await driver.quit()
    });
    it('Coupon test', async function () {
        {   //Real keyboard events unlike Cypres and Playwright?
            //wait driver.findElement(By.css('input[placeholder="Search products…"]')).click()
            //await driver.actions().keyDown(Key.SHIFT).sendKeys('cap').keyUp(Key.SHIFT).pause(3000).perform()
        }
        await driver.findElement(By.css('input[placeholder="Search products…"]')).sendKeys('Cap' + Key.ENTER)

        await driver.findElement(By.css('button[name=add-to-cart]')).click()
        { //Do mouse hover to show drop down
            const dropDownCartMenu = await driver.findElement(By.id('site-header-cart'))
            await driver.actions().move({ origin: dropDownCartMenu }).pause(1000).perform()
        }
        // await driver.findElement(By.className('widget_shopping_cart_content')) //chained to ensure link is from drop down
        //     .findElement(By.partialLinkText('View cart')).click();
        const cartLink = await driver.wait(async function (driver) {
            return await driver.findElement(By.className('widget_shopping_cart_content')).findElement(By.partialLinkText('View cart'));
        }, 5000)
        await cartLink.click()
        await driver.findElement(By.css('input[id^="quantity"]')).clear()
        await driver.findElement(By.css('input[id^="quantity"]')).sendKeys('2')
        await driver.findElement(By.css('button[value="Update cart"]')).click()
        //Page autoscrolls - need to manually wait or coupon may not be entered/apply button goes stale
        await driver.sleep(3000)
        await driver.findElement(By.css('label[for^=coupon] + input')).sendKeys('edgewords')
        await driver.findElement(By.css('button[value="Apply coupon"]')).click()

        const cartTotals = await driver.findElement(By.css('.cart_totals table'))

        let subTotal = await cartTotals.findElement(By.css('[data-title="Subtotal"')).getText()
        let couponDiscount = await cartTotals.findElement(By.css('[data-title^="Coupon"] > .amount')).getText() //May also need to wait for coupon to apply earlier
        let shipping = await cartTotals.findElement(By.css('label[for^=shipping] > .amount')).getText()
        let total = await cartTotals.findElement(By.css('[data-title=Total] .amount')).getText()
        console.log(`Checking values have been captured: ${subTotal} ${couponDiscount} ${shipping} ${total}`);
        /*
        * Assert
        */
        //Strip £, convert to whole pennies for calc purposes. There are better suitad external libraries for monetary/currency calculations, but this avoids extra dependencies
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

        expect(couponDiscount).to.equal(calculatedDiscount)
    });
});
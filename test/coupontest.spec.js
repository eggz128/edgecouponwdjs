import { Builder, By, Key, until } from 'selenium-webdriver';

describe('A Suite', async function () {
    this.timeout(0)
    it('Coupon test', async function () {

        const driver = new Builder().forBrowser('MicrosoftEdge').build()
        await driver.get('https://www.edgewordstraining.co.uk/demo-site')
        await driver.findElement(By.linkText('Dismiss')).click()
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
        const cartLink = await driver.wait(async function(driver){
            return await driver.findElement(By.className('widget_shopping_cart_content')).findElement(By.partialLinkText('View cart'));
        }, 5000)
        await cartLink.click()
        await driver.findElement(By.css('input[id^="quantity"]')).clear()
        await driver.findElement(By.css('input[id^="quantity"]')).sendKeys('2')
        
        await driver.sleep(3000)

        await driver.quit();
    });
});
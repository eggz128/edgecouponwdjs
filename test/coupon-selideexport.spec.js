// Generated by Selenium IDE
//const { Builder, By, Key, until } = require('selenium-webdriver')
//const assert = require('assert')
//Project is configured for ES6 Modules
import { Builder, By, Key, until } from 'selenium-webdriver'
import assert from 'assert'

describe.skip('coupon', function() { //Test wont run to completion without more fixes - so skip.
  this.timeout(60000) //Upped 30s default for debugging
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('firefox').build()
    vars = {}
    driver.manage().setTimeouts({implicit:2000}) //Added to avoid sync problems for now
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('coupon', async function() {
    // Test name: coupon
    // Step # | name | target | value
    // 1 | open | /demo-site/ | 
    await driver.get("https://www.edgewordstraining.co.uk/demo-site/")
    // 2 | click | linkText=Dismiss | 
    await driver.findElement(By.linkText("Dismiss")).click()
    // 3 | click | id=woocommerce-product-search-field-0 | 
    await driver.findElement(By.id("woocommerce-product-search-field-0")).click()
    // 4 | type | id=woocommerce-product-search-field-0 | cap
    await driver.findElement(By.id("woocommerce-product-search-field-0")).sendKeys("cap")
    // 5 | sendKeys | id=woocommerce-product-search-field-0 | ${KEY_ENTER}
    await driver.findElement(By.id("woocommerce-product-search-field-0")).sendKeys(Key.ENTER)
    // 6 | click | name=add-to-cart | 
    await driver.findElement(By.name("add-to-cart")).click()
    // 7 | mouseOver | css=.count:nth-child(2) | 
    {
      const element = await driver.findElement(By.css(".count:nth-child(2)"))
      //await driver.actions({ bridge: true }).moveToElement(element).perform()
      await driver.actions().move({origin: element}).perform()
    }
    // 8 | click | linkText=View cart | 
    await driver.findElement(By.linkText("View cart")).click()
    // 9 | click | css=[id^=quantity] | 
    await driver.findElement(By.css("[id^=quantity]")).click()
    // 10 | type | css=[id^=quantity] | 2
    await driver.findElement(By.css("[id^=quantity]")).clear()
    await driver.findElement(By.css("[id^=quantity]")).sendKeys("2")
    // 11 | click | name=update_cart | 
    await driver.findElement(By.name("update_cart")).click()
    // 12 | click | id=coupon_code | 
    //Needs wait for page update/scroll to finish
    await driver.findElement(By.id("coupon_code")).click()
    // 13 | type | id=coupon_code | edgewords
    await driver.findElement(By.id("coupon_code")).sendKeys("edgewords")
    // 14 | click | name=apply_coupon | 
    await driver.findElement(By.name("apply_coupon")).click()
    // 15 | click | css=td:nth-child(2) > .woocommerce-Price-amount > bdi | 
    await driver.findElement(By.css("td:nth-child(2) > .woocommerce-Price-amount > bdi")).click()
    // 16 | click | css=td:nth-child(2) > .woocommerce-Price-amount > bdi | 
    await driver.findElement(By.css("td:nth-child(2) > .woocommerce-Price-amount > bdi")).click()
    // 17 | assertText | css=td:nth-child(2) > .woocommerce-Price-amount > bdi | £32.00
    assert(await driver.findElement(By.css("td:nth-child(2) > .woocommerce-Price-amount > bdi")).getText() == "£32.00")
    // 18 | assertText | css=label bdi | £3.95
    assert(await driver.findElement(By.css("label bdi")).getText() == "£3.95")
    // 19 | click | css=strong bdi | 
    await driver.findElement(By.css("strong bdi")).click()
    // 20 | assertText | css=strong bdi | £31.15
    assert(await driver.findElement(By.css("strong bdi")).getText() == "£31.15")
    // 21 | assertText | css=.cart-discount .woocommerce-Price-amount | £4.80
    assert(await driver.findElement(By.css(".cart-discount .woocommerce-Price-amount")).getText() == "£4.80")
    // 22 | click | linkText=× | 
    await driver.findElement(By.linkText("×")).click()
    // 23 | click | linkText=Return to shop | 
    await driver.findElement(By.linkText("Return to shop")).click()
    // 24 | click | linkText=Home | 
    await driver.findElement(By.linkText("Home")).click()
  })
})
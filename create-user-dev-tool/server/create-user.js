/*************************************************************************
 *
 * COMPRO CONFIDENTIAL
 * __________________
 *
 *  [2015] - [2020] Compro Technologies Private Limited
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Compro Technologies Private Limited. The
 * intellectual and technical concepts contained herein are
 * proprietary to Compro Technologies Private Limited and may
 * be covered by U.S. and Foreign Patents, patents in process,
 * and are protected by trade secret or copyright law.
 *
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Compro Technologies Pvt. Ltd..
 ***************************************************************************/


/**********************************************************************
 * Provides functions for getting class/product related data
 ***********************************************************************/
'use strict';

/************************************
* Internal npm Modules
************************************/

const puppeteer = require("puppeteer");

exports.createUser = createUser;

async function createUser(req, res) {
    const envConfig = {
        "thor": "https://micro-nemo.comprodls.com/register-learner?ielts=true",
        "qa": "https://qa.cambridgeone.org/register-learner?ielts=true"
    }
    try {
        let currentTimestamp = Date.now();
        const { environment, count } = req.query;
        const url = envConfig[environment];
        let promiseArray = []
        for (let i = 1; i <= count; i++) {
            let email = `usr_${environment}_${currentTimestamp}_${i}@yopmail.com`;
            console.log('email', email);
            promiseArray.push(creteUsr(email, url));
        }
        let response = await Promise.all(promiseArray);
        res.send(response);
    } catch (err) {
        res.send(err);
    }
}

async function creteUsr(email, signUpUrl) {
    // Launch the browser
    try {
        const browser = await puppeteer.launch();
        // Create an instance of the page
        const page = await browser.newPage();
        // Go to the web page that we want to scrap
        await page.goto(signUpUrl, {
            waitUntil: 'networkidle0'
        });

        await page.waitForSelector('input#gigya-password-56383998600152700.gigya-input-password');
        await page.evaluate((email) => {
            document.querySelector("input#gigya-password-56383998600152700.gigya-input-password").value = "Compro11";
            document.querySelector("input#gigya-textbox-31541372373165936.gigya-input-text").value = "India";
            document.querySelector("input#gigya-loginID-109656003259475650.gigya-input-text").value = email;
            document.querySelector("input#gigya-textbox-56649036382991330.gigya-input-text").value = "demo";
            document.querySelector("input#gigya-textbox-120640165044771760.gigya-input-text").value = "test"
            document.querySelector("input#learner-checkbox-1.gigya-input-checkbox.consentCheck").click();
            [...document.querySelectorAll(".gigya-input-submit")].filter(ele => { return ele.value == "Sign up" })[0].click();
        }, email);

        await page.waitFor(()=>document.querySelectorAll("div.v-email.font-weight-bold.d-inline").length > 0)

        await page.goto('http://www.yopmail.com/en/', {
            waitUntil: 'networkidle0'
        });

        await page.evaluate((email) => {
            document.querySelector("input#login.scpt").value = email;
        }, email)

        await Promise.all([
            page.click("input.sbut"),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        let url = await page.evaluate(() => {
            return document.querySelectorAll('iframe')[2].contentWindow.document.body.querySelectorAll('a')[2].href
        });

        console.log("Verification URL", url);

        await page.goto(url, {
            waitUntil: 'networkidle0'
        });

        await browser.close();
        return email;
    } catch (err) {
        res.send(err);
    }
}
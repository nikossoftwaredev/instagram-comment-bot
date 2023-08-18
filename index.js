import puppeteer from "puppeteer";
import "dotenv/config";

const {
  INSTAGRAM_USERNAME,
  INSTAGRAM_PASSWORD,
  INSTAGRAM_TAGS,
  INSTAGRAM_POST_LINK,
} = process.env;

const getRandomTimeout = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(INSTAGRAM_POST_LINK);

  const allowCookiesButton = await page.waitForSelector("button._a9--._a9_0");
  await allowCookiesButton.click();

  const usernameField = await page.waitForSelector(`input[name="username"]`);
  await usernameField.type(INSTAGRAM_USERNAME);

  const passwordField = await page.waitForSelector(`input[name="password"]`);
  await passwordField.type(INSTAGRAM_PASSWORD);

  await page.keyboard.press("Enter");

  await page.waitForNavigation();

  const mainDiv = await page.waitForSelector('[role="main"]');
  await mainDiv.click();

  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  const commentSection = await page.waitForSelector(
    'textarea[aria-label="Add a comment…"]'
  );

  while (true) {
    commentSection.focus();
    await commentSection.type(INSTAGRAM_TAGS, { delay: 50 });

    const timeout = getRandomTimeout(40000, 50000);
    await new Promise((r) => setTimeout(r, timeout));

    // Locate the div inside the form using the provided selector
    const postButtonSelector = "div._aidp div";
    const postButton = await page.waitForSelector(postButtonSelector);
    await postButton.click();

    await new Promise((r) => setTimeout(r, 10000));
  }
})();

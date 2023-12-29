const puppeteer = require("puppeteer");

let finalResults = [];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bookingExtractor(props) {
  try {
    const bookingBaseUrl = "https://www.booking.com/searchresults.en-gb.html";
    const maxPages = 20;
    // Load details from details.json
    // const details = await fs.readFile("details.json", "utf-8");
    const {
      destination,
      date,
      numberOfAdults,
      numberOfRooms,
      numberOfChildren,
      kidsAge,
      // currency,
    } = props;
    const currency = "USD"

    let fullUrl = `${bookingBaseUrl}?ss=${encodeURIComponent(
      destination
    )}&sb=1&checkin=${date.checkIn}&checkout=${
      date.checkOut
      }&group_adults=${numberOfAdults}&no_rooms=${numberOfRooms}`;
    
    for (let age of kidsAge) {
      fullUrl += `&age=${age}`;
    }

    if (currency) {
      fullUrl += `&selected_currency=${currency}`;
    }

    // Output the full URL for debugging
    console.log("Full URL:", fullUrl);

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    );

    // Set viewport
    await page.setViewport({
      width: 1366,
      height: 768,
    });

    try {
      await page.goto(fullUrl);

      try {
        // Wait for the dismiss button to be available
        await page.waitForSelector(
          'button[aria-label="Dismiss sign in information."]',
          { timeout: 3000 }
        );

        // Click on the dismiss button
        await page.click('button[aria-label="Dismiss sign in information."]');
        console.log("Popup closed");
      } catch (error) {
        console.error(
          "Dismiss button not found or popup did not appear. Continuing without dismissing sign-in information."
        );
      }

      // Process the first page
      await processPage(page);
      console.log(`Finished page 1`);

      // Continue to the next pages, up to the specified maxPages
      let pageCounter = 2;
      while (pageCounter <= maxPages) {
        // Check if "Next page" button is enabled
        const isNextButtonEnabled = await page.$eval(
          'button[aria-label="Next page"]',
          (button) => !button.disabled
        );

        if (!isNextButtonEnabled) {
          console.log("Next button is disabled. Exiting.");
          break;
        }

        // Click on "Next page" button
        await page.click('button[aria-label="Next page"]');

        // Wait for navigation to complete
        await delay(2000);

        // Process the current page
        await processPage(page);
        console.log(`Finished page ${pageCounter++}`);
      }

      console.log("Finished job");
    } finally {
      await browser.close();

      return finalResults;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function processPage(page) {
  // Log the page URL
  // console.log('Current page URL:', page.url());

  // Wait for the property cards to appear
  await page.waitForSelector('[data-testid="property-card-container"]');

  // Get booking details from all property cards
  const results = await page.$$eval(
    '[data-testid="property-card-container"]',
    (cards) => {
      return cards.map((card) => {
        const bookingTitle = card.querySelector(
          ".f6431b446c.a15b38c233"
        ).innerText;
        const bookingPrice = card.querySelector(
          '[data-testid="price-and-discounted-price"]'
        ).innerText;

        const pattern = /(\d+)/g;
        const bookingPriceNumber = bookingPrice.match(pattern).join("");

        const bookingLink = card
          .querySelector("[data-testid=title-link]")
          .getAttribute("href");

        let bookingStars = "";
        if (card.querySelector(".b3f3c831be")) {
          bookingStars = card
            .querySelector(".b3f3c831be")
            .getAttribute("aria-label");
        }

        let bookingRate = "";
        if (card.querySelector(".a3b8729ab1.d86cee9b25")) {
          bookingRate = card
            .querySelector(".a3b8729ab1.d86cee9b25")
            .getAttribute("aria-label");
        }

        let bookingDistance = "";
        if (card.querySelector('[data-testid="distance"]')) {
          let raw = card.querySelector(
            '[data-testid="distance"]'
          ).innerText;
          bookingDistance = raw.replace("centre", "center")
        }

        return {
          booking_title: bookingTitle,
          booking_price: bookingPriceNumber,
          booking_rate: bookingRate,
          booking_stars: bookingStars,
          booking_distance: bookingDistance,
          booking_link: bookingLink,
        };
      });
    }
  );

  finalResults = [...finalResults, ...results];

  // Read existing results
  //   const resultFilePath = path.join("data_json_files", "booking_results.json");
  //   const existingResults = JSON.parse(
  //     await fs.readFile(resultFilePath, "utf-8")
  //   );

  //   // Append the results to booking_results.json
  //   const updatedResults = existingResults.concat(results);
  //   await fs.writeFile(resultFilePath, JSON.stringify(updatedResults, null, 2));
}

module.exports = { bookingExtractor };
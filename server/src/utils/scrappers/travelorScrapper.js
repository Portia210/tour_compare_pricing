const puppeteer = require("puppeteer");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getInnerText(element) {
  return element ? element.evaluate((el) => el.textContent.trim()) : "";
}

// function to take the details of each hotel
async function extractDataFromDiv(div, destinationBaseUrl, fidString, items) {
  try {
    const titleElement = await div.$(
      "h4.font-bold.text-lg.w-full.leading-tight"
    );
    const priceElement = await div.$(
      ".block span span span.text-lg.text-green-500.font-semibold.leading-none"
    );
    const linkElement = await div.$(
      ".px-2.py-1.border.border-transparent.font-medium.whitespace-nowrap.shadow.rounded.text-white.bg-blue-600.hover\\:bg-blue-500.focus\\:outline-none.focus\\:ring.transition.ease-in-out"
    );
    // image with alt = titleElement
    const imageElement = await div.$(`img`);
    let src = "";

    if (imageElement) {
      src = await imageElement.evaluate((el) => el.getAttribute("src"));
    }

    const title = await getInnerText(titleElement);
    let price = await getInnerText(priceElement);

    const pattern = /(\d+)/g;
    let match = price.match(pattern);

    if (match) {
      price = match.join("");
    }

    const originalLink = linkElement
      ? await linkElement.evaluate((el) => el.getAttribute("href"))
      : null;
    const modifiedLink = originalLink
      ? `${destinationBaseUrl}${originalLink.replace("?", `?${fidString}`)}`
      : null;

    items.push({ title, price, travellor_link: modifiedLink, image: src });
  } catch (error) {
    console.error("Error extracting data from div", error.message, error.stack);
  }
}

// fuction to discover the number of all the hotels in this location, to use it later.
async function getHotelsNumber(page) {
  const hotelsNumberElement = await page.$(
    "h2.text-xl.sm\\:text-2xl.md\\:text-3xl.leading-none > span"
  );
  const hotelsNumberText = await getInnerText(hotelsNumberElement);
  const hotelsNumber = parseInt(hotelsNumberText, 10);
  return isNaN(hotelsNumber) ? 0 : hotelsNumber;
}

async function travelorExtractor(props) {
  console.log("starting extracting from travelor.com");
  // we need to get the right url for the search
  const baseUrl = "https://www.travelor.com";
  const fidString = "fid=68181&";
  let allDivs;
  try {
    // Load details from details.json
    // const details = await fs.readFile("details.json", "utf-8");
    const {
      destination,
      date,
      numberOfAdults,
      numberOfChildren,
      kidsAge,
      country,
      currency,
      radius,
      applyFilters,
      stars,
      rating,
      priceFilter,
      minPrice,
      maxPrice,
    } = props;

    const browser = await puppeteer.launch({
      headless: true, // Set to true for headless mode
    });

    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    );

    // Set a larger viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    try {
      await page.goto("https://www.travelor.com/");

      // Click on the destination input field
      await page.click("#destination");

      // Type the destination variable
      await page.type("#destination", destination);

      // Wait for a moment for the suggestions to appear
      await delay(1000);

      // Click on the first suggestion with class pac-item
      await page.waitForSelector(".pac-item:first-child");
      await page.click(".pac-item:first-child");

      // Wait for a moment for the page to update
      await delay(1000);

      // Click on the button with data-v-35bbae54
      await page.click(
        "button.block.relative.h-12.md\\:h-14.-mt-6.md\\:-mt-8.w-64.max-w-full.mx-auto.px-4.md\\:px-4.py-3.border.border-transparent.text-lg.md\\:text-2xl.leading-6.font-medium.shadow-lg.rounded-md.text-white.bg-blue-600.hover\\:bg-blue-500.focus\\:outline-none.focus\\:ring.transition"
      );

      // Wait for the new page to load
      await page.waitForNavigation();

      // Extract the unnecessary part of the current URL
      const currentURL = page.url();
      const placeId = currentURL.match(/place\/([^/]+)/)[1]; // Extract the place ID from the URL

      // Extract latitude and longitude from the original URL
      const originalParams = new URLSearchParams(
        currentURL.slice(currentURL.indexOf("?") + 1)
      );
      const originalLatitude = originalParams.get("latitude");
      const originalLongitude = originalParams.get("longitude");

      // Constructing the new parameters
      const newParams = new URLSearchParams();
      newParams.set("check_in", date.checkIn);
      newParams.set("check_out", date.checkOut);
      newParams.set(
        "guests",
        "a,".repeat(numberOfAdults) +
          kidsAge.slice(0, numberOfChildren).join(",")
      );
      newParams.set("country", country);
      newParams.set("currency", "USD");
      newParams.set("radius", 50000);
      // sort it by popularity
      // newParams.set("sort", "desc");
      // Add latitude and longitude to new parameters
      if (originalLatitude !== null && originalLongitude !== null) {
        newParams.set("latitude", originalLatitude);
        newParams.set("longitude", originalLongitude);
      }

      // Add additional parameters if applyFilters is true
      if (applyFilters) {
        newParams.set("rating", rating);

        if (stars && stars.length > 0) {
          const starsQuery = stars.join(",");
          newParams.set("stars", starsQuery);
        }

        if (priceFilter && minPrice !== undefined && maxPrice !== undefined) {
          newParams.set("min_price", minPrice);
          newParams.set("max_price", maxPrice);
        }
      }

      // Construct the new URL with the updated parameters and the unchanged place ID
      const newURL = `https://www.travelor.com/hotels/place/${placeId}/results?${newParams.toString()}`;
      console.log(newURL);

      // Navigate to the new URL
      await page.goto(newURL);

      // get local storage item `vuex` and parse it
      const vuex = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem("vuex"));
      });

      if (vuex) {
        vuex.currency = "USD";
      }

      // set local storage item `vuex`
      await page.evaluate((vuex) => {
        localStorage.setItem("vuex", JSON.stringify(vuex));
      }, vuex);

      // refresh page
      await page.reload();

      // Wait until the div is not present or does not have a child svg, the svg is a loading svg, when it's not there that's mean the page has finished loading
      await page.waitForFunction(
        () => {
          const div = document.querySelector(
            ".hidden.md\\:flex.flex-nowrap.items-center"
          );
          return !div || !div.querySelector("svg");
        },
        { timeout: 120000 } // Set a custom timeout of 120 seconds
      );

      console.log("Page loading completed");

      // get's the number of all the hotels in the page
      const hotelsNumber = await getHotelsNumber(page);
      console.log("Number of hotels found:", hotelsNumber);

      // Scroll down until the number of loaded divs is equal to hotelsNumber
      let iterations = 0;
      const maxIterations = 10; // Adjust this value based on your requirements

      while (true) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        await delay(1000); // Introduce a 2-second delay

        // allDivs = await page.$$(
        //   ".w-full.md\\:w-1\\/2.xl\\:w-1\\/3.md\\:px-3.pb-6"
        // );
        allDivs = await page.$$(
          ".w-full.md\\:w-1\\/2.xl\\:w-1\\/3.md\\:px-3.pb-6"
        );

        console.log("Number of all divs:", allDivs.length);

        if (allDivs.length >= hotelsNumber) {
          console.log("all the hotels has loaded");
          break;
        }

        iterations++;

        if (iterations >= maxIterations || allDivs.length >= 150) {
          console.log("Reached hotels or iterations limit. Exiting the loop.");
          break;
        }
      }

      console.log("out of the loop");

      // Extract data from each div
      // this part has some problems, somtimes it take it a lot of time to extract the data, and the computer stuck, haven't manage to overcome this yet.
      const items = [];
      for (const div of allDivs) {
        await extractDataFromDiv(div, baseUrl, fidString, items);
      }
      console.log("number of hotels in the array is", items.length);
      // Write the items array to the JSON file
      const resultFilePath = "data_json_files/travellor_result.json";

      console.log("Extracted data from travelor.com");

      return items;
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      // Close the browser
      await browser.close();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = { travelorExtractor };

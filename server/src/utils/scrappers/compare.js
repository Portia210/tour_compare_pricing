const fs = require("fs");

// Path to the JSON files
// const travellorPath = "././data_json_files/travellor_results.json";
// const bookingPath = "././data_json_files/booking_results.json";

// Comparison JSON file path
const comparisonPath = "././data_json_files/final_results.json";

// Function to remove spaces and U+200F from a string
function cleanString(str) {
  return str.replace(/\s/g, "").replace(/\u200F/g, "");
}

// Read the JSON files
// const travellorData = JSON.parse(fs.readFileSync(travellorPath, "utf8"));
// const bookingData = JSON.parse(fs.readFileSync(bookingPath, "utf8"));

function compare(props) {
  // Initialize an array to store the matched objects
  const matches = [];
  const travellorData = props.travelorResult;
  const bookingData = props.bookingResult;

  travellorData.forEach((travellorObject) => {
    // Use a labeled statement for the outer loop
    outerLoop: for (let i = 0; i < bookingData.length; i++) {
      const bookingObject = bookingData[i];
      if (travellorObject.title === bookingObject.booking_title) {
        // Remove spaces and U+200F from the strings
        const cleanedTravellorPrice = cleanString(travellorObject.price);
        const cleanedBookingPrice = cleanString(bookingObject.booking_price);

        // Convert prices to numbers
        const travellorPrice = parseFloat(
          cleanedTravellorPrice.replace(/[^\d.]/g, "")
        );
        const bookingPrice = parseFloat(
          cleanedBookingPrice.replace(/[^\d.]/g, "")
        );

        console.log(travellorPrice, bookingPrice);
        // 1.8 km from center
        // Result should be 1.8km

        let pattern = /from center/g;
        const distance = bookingObject.booking_distance;
        const distanceOnlyWithUnits = distance.replace(pattern, "");

        pattern = /[^\d.]/g;
        const rateNumber = bookingObject.booking_rate.replace(pattern, "");

        // Calculate the difference and add to the matches array
        const priceDifference = bookingPrice - travellorPrice;
        if (priceDifference > 0) {
          matches.push({
            hotel_title: travellorObject.title,
            stars: parseInt(bookingObject.booking_stars.split(" ")[0]),
            rate: parseInt(rateNumber),
            distance: distanceOnlyWithUnits.replace(/\s/g, ""),
            travellor_price: parseInt(cleanedTravellorPrice),
            booking_price: parseInt(cleanedBookingPrice),
            price_difference: priceDifference,
            travellor_link: travellorObject.travellor_link,
            booking_link: bookingObject.booking_link,
            image: travellorObject.image,
          });
        }

        // Break out of the outer loop when a match is found
        break outerLoop;
      }
    }
  });

  // Sort the array based on the price difference (descending order)
  matches.sort((a, b) => b.price_difference - a.price_difference);

  // Check if any matches were found
  if (matches.length > 0) {
    // Create the comparison JSON file
    // fs.writeFileSync(comparisonPath, JSON.stringify(matches, null, 2));
    console.log(`Found ${matches.length} matches`);
    return matches;
  } else {
    console.log("Didn't find any matches");
  }
}

module.exports = { compare };

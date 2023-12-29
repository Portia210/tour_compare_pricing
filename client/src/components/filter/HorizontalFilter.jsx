import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import GuestPopup from "../popups/GuestPopup";
import { api } from "../utils/api";

const initialState = {
  rooms: [
    {
      id: 1,
      adults: 1,
      children: 0,
      childrenAges: [],
    },
  ],
  noOfRooms: 1,
  adults: 0,
  children: 0,
  date: {
    checkIn: "",
    checkOut: "",
  },
  destination: "",
};

export default function HorizontalFilter({ setCompareResults }) {
  const [guests, setGuests] = useState(initialState);
  const [guestPopup, setGuestPopup] = useState(false);
  const [currency, setCurrency] = useState("USD"); // ["USD", "ILS", "EU", "GBP"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // calculate total adults and children
    let totalAdults = 0;
    let totalChildren = 0;
    guests.rooms.forEach((room) => {
      totalAdults += parseInt(room.adults);
      totalChildren += parseInt(room.children);
    });

    setGuests({
      ...guests,
      adults: totalAdults,
      children: totalChildren,
    });
  }, [guests.rooms]);

  function handleChange(e) {
    const { name, value } = e.target;

    // validate checkin and checkout dates
    if (name === "checkIn") {
      // Checkin date cannot be less than today
      console.log(new Date().toISOString().split("T")[0]);
      if (value < new Date().toISOString().split("T")[0]) {
        alert("Checkin date cannot be less than today");
        return;
      }

      if (guests.date.checkOut && value > guests.date.checkOut) {
        alert("Checkin date cannot be greater than checkout date");
        return;
      }
    }

    if (name === "checkOut" && guests.date.checkIn) {
      if (value < guests.date.checkIn) {
        alert("Checkout date cannot be less than checkin date");
        return;
      }
    }

    if (name === "checkIn" || name === "checkOut") {
      setGuests({
        ...guests,
        date: {
          ...guests.date,
          [name]: value,
        },
      });
      return;
    }

    setGuests({
      ...guests,
      [name]: value.trim(),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // validation
    if (!guests.destination || !guests.date.checkIn || !guests.date.checkOut) {
      alert("Please fill all the fields");
      return;
    }

    // children ages from all rooms
    const kidsAge = [];
    guests.rooms.forEach((room) => {
      kidsAge.push(...room.childrenAges);
    });

    const payload = {
      numberOfAdults: guests.adults,
      numberOfChildren: guests.children,
      numberOfRooms: guests.noOfRooms,
      destination: guests.destination,
      date: guests.date,
      kidsAge,
    };

    try {
      setLoading(true);
      const res = await api.post("/filters", payload);

      if (res.status === 200 && res.data) {
        const newState = res.data.map((result) => {
          return {
            ...result,
            travellor_price: result.travellor_price + "$",
            booking_price: result.booking_price + "$",
            price_difference: result.price_difference + "$",
          };
        });

        setCompareResults(newState);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-20 bg-blue-500 relative">
      <FormControl >
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currency}
          label="Currency"
          onChange={(e) => setCurrency(e.target.value)}
          size="small"
        >
          <MenuItem value="USD">US Dollar</MenuItem>
          <MenuItem value="ILS">Israeli New Sheqel</MenuItem>
          <MenuItem value="EU">Euro</MenuItem>
          <MenuItem value="GBP">British Pound Sterling</MenuItem>
        </Select>
      </FormControl>

      {/* <div className="absolute top-3 right-4 bg-">{currency}</div> */}

      <form
        className="bg-white w-full sm:w-11/12  absolute z-50 -bottom-[40%] left-1/2 -translate-x-1/2 shadow-xl rounded"
        onSubmit={handleSubmit}
      >
        <div className="p-2 flex justify-between items-center space-x-1">
          <TextField
            label="Destination"
            variant="outlined"
            size="small"
            name="destination"
            className="flex-1"
            onChange={handleChange}
            value={guests.destination}
          />
          <TextField
            placeholder="Check in"
            label="Check in"
            variant="outlined"
            size="small"
            name="checkIn"
            onChange={handleChange}
            value={guests.date.checkIn}
            type="date"
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "3px" }, // Adjust the value as needed
            }}
            className="flex-1"
          />{" "}
          <TextField
            placeholder="Check out"
            label="Check out"
            variant="outlined"
            size="small"
            name="checkOut"
            onChange={handleChange}
            value={guests.date.checkOut}
            type="date"
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "3px" }, // Adjust the value as needed
            }}
            className="flex-1"
          />
          <button
            onClick={() => setGuestPopup(true)}
            type="button"
            className="w-64 flex-1 border border-gray-400 px-2 py-[6px] rounded"
          >
            {guests.adults} Adults, {guests.children} Children,{" "}
            {guests.noOfRooms} Rooms
          </button>
          <button
            type="submit"
            className="w-28 px-2 py-[6px] bg-blue-600 text-white rounded border border-blue-600"
          >
            {loading ? "Loading..." : "Search"}
          </button>
          {guestPopup && (
            <GuestPopup
              guests={guests}
              setGuests={setGuests}
              setGuestPopup={setGuestPopup}
            />
          )}
        </div>
      </form>
    </div>
  );
}

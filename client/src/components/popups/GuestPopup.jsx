import { TextField } from "@mui/material";
import React, { useEffect } from "react";

export default function GuestPopup({ guests, setGuests, setGuestPopup }) {
  function changeChilrenOrAdults(e, id) {
    const { name } = e.target;
    const value = parseInt(e.target.value);

    // validation
    if (!value && value !== 0) return;
    if (value < 0) return;

    const room = guests.rooms.find((room) => room.id === id);

    // max 5 adults + children per room
    if ((name === "adults" && value + room.children > 5) || value === 0) return;
    if (name === "children" && value + room.adults > 5) return;

    if (name === "children" && value < room.children) {
      const newState = {
        ...guests,
        rooms: guests.rooms.map((room) => {
          if (room.id === id) {
            return {
              ...room,
              [name]: value,
              childrenAges: room.childrenAges.slice(0, value),
            };
          }
          return room;
        }),
      };
      setGuests(newState);
      return;
    }

    const newState = {
      ...guests,
      rooms: guests.rooms.map((room) => {
        if (room.id === id) {
          return {
            ...room,
            [name]: value,
          };
        }
        return room;
      }),
    };
    setGuests(newState);
  }

  function addRoom() {
    const state = {
      id: guests.noOfRooms + 1,
      adults: 1,
      children: 0,
      childrenAges: [],
    };

    const newState = {
      ...guests,
      rooms: [...guests.rooms, state],
      noOfRooms: guests.noOfRooms + 1,
    };

    setGuests(newState);
  }

  function removeRoom(id) {
    if (guests.noOfRooms === 1) return;

    const newState = {
      ...guests,
      rooms: guests.rooms.filter((room) => room.id !== id),
      noOfRooms: guests.noOfRooms - 1,
    };
    setGuests(newState);
  }

  function setChildrensAge(e, id, child) {
    const value = parseInt(e.target.value);

    // validation
    if (!value && value !== 0) return;
    if (value < 0) return;
    if (value > 17) return;

    const newState = {
      ...guests,
      rooms: guests.rooms.map((room) => {
        if (id === room.id) {
          if (room.childrenAges.length < child) {
            return {
              ...room,
              childrenAges: [...room.childrenAges, value],
            };
          }
          return {
            ...room,
            childrenAges: room.childrenAges.map((age, i) => {
              if (i === child - 1) {
                return value;
              }
              return age;
            }),
          };
        }
        return room;
      }),
    };

    setGuests(newState);
  }

  return (
    <div className="w-[350px] shadow-xl z-50 bg-white absolute top-[130%] right-0 p-6 space-y-3">
      <div className="space-y-5">
        {guests.rooms.map((room) => (
          <div key={room.id} className="">
            <div className="flex justify-between items-center pb-3">
              <h1 className="text-sm">Room {room.id}</h1>
              <button
                className="text-red-500 text-sm"
                onClick={() => removeRoom(room.id)}
              >
                Remove
              </button>
            </div>
            <div className="flex space-x-2">
              <TextField
                label="Adults"
                name="adults"
                value={room.adults}
                onChange={(e) => changeChilrenOrAdults(e, room.id)}
                type="number"
                variant="outlined"
                size="small"
              ></TextField>
              <TextField
                label="Children"
                name="children"
                value={room.children}
                onChange={(e) => changeChilrenOrAdults(e, room.id)}
                type="number"
                variant="outlined"
                size="small"
              ></TextField>
            </div>
            <div className="pt-3">
              {/* children ages input */}
              {room.children > 0 && (
                <>
                  <h1 className="text-slate-500 text-sm pb-3">Children Ages</h1>
                  <div className="flex items-center justify-between space-x-2">
                    {Array.from(Array(room.children), (_, i) => i + 1).map(
                      (child) => (
                        <TextField
                          key={child}
                          label={`Age`}
                          name={`child${child}age`}
                          value={room.childrenAges[child - 1]}
                          onChange={(e) => setChildrensAge(e, room.id, child)}
                          type="number"
                          variant="outlined"
                          size="small"
                          className="flex-1"
                        ></TextField>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <ButtonGroup
        addRoom={addRoom}
        guests={guests}
        setGuestPopup={setGuestPopup}
      />
    </div>
  );
}

function ButtonGroup({ addRoom, guests, setGuestPopup }) {
  return (
    <div className="space-y-3">
      <button
        onClick={addRoom}
        type="button"
        className="w-full text-slate-500 border-gray border border-gray-400 px-2 py-[4px] rounded"
      >
        Add Room
      </button>
      <button
        onClick={() => setGuestPopup(false)}
        type="button"
        className="w-full text-white border-gray bg-blue-500 border border-blue-500 px-2 py-[4px] rounded"
      >
        OK{" "}
        <span className="text-sm">
          ( {guests.adults} Adults, {guests.children} Children )
        </span>
      </button>
    </div>
  );
}

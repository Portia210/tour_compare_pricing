import React from "react";

export default function Results({ compareResults }) {
  if (!compareResults || compareResults?.length === 0) return null;
  return (
    <section className="pt-16 w-full flex items-center justify-center">
      <table className="w-11/12 table-fixed border border-slate-400 border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="table-fixed w-44 border border-slate-400 py-4 px-4">
              Hotel
            </th>
            <th className="table-fixed border border-slate-400 px-4">Stars</th>
            <th className="table-fixed border border-slate-400 px-4">Rate</th>
            <th className="table-fixed border border-slate-400 px-4">
              Distance
            </th>
            <th className="table-fixed border border-slate-400 px-4">
              Travellor Price
            </th>
            <th className="table-fixed border border-slate-400 px-4">
              Booking Price
            </th>
            <th className="table-fixed border border-slate-400 px-4">
              Price Difference
            </th>
            <th className="table-fixed border border-slate-400 px-4">
              Travellor Link
            </th>
            <th className="table-fixed border border-slate-400 px-4">
              Booking Link
            </th>
          </tr>
        </thead>

        <tbody>
          {compareResults.map((hotel, index) => {
            return (
              <tr key={index} className="hover:bg-slate-100">
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.hotel_title}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.stars}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.rate}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.distance}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.travellor_price}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.booking_price}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-center">
                  {hotel.price_difference}
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-blue-600 text-center">
                  <a target="_blank" href={hotel.travellor_link}>
                    Buy With Travelor
                  </a>
                </td>
                <td className="table-fixed border border-slate-400 px-4 py-2 text-blue-600 text-center">
                  <a target="_blank" href={hotel.booking_link}>
                    Buy With Booking
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

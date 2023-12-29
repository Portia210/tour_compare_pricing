import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          `https://open.er-api.com/v6/latest/USD`
        );
        const rate = response.data.rates[toCurrency];
        setExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      const converted = amount * exchangeRate;
      setConvertedAmount(converted.toFixed(2));
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleFromCurrencyChange = (e) => {
    const value = e.target.value;
    setFromCurrency(value);
  };

  const handleToCurrencyChange = (e) => {
    const value = e.target.value;
    setToCurrency(value);
  };

  return (
    <div>
      <h2>Currency Converter</h2>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <label>From Currency:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {/* Add currency options here */}
        </select>
      </div>
      <div>
        <label>To Currency:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {/* Add currency options here */}
        </select>
      </div>
      <div>
        <p>
          {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;

// https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID

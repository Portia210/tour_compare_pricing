import { useState } from "react";
import HorizontalFilter from "./components/filter/HorizontalFilter";
import Results from "./components/filter/Results";

function App() {
  const [compareResults, setCompareResults] = useState([]);

  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto">
      <HorizontalFilter setCompareResults={setCompareResults} />
      <Results compareResults={compareResults} />
    </div>
  );
}

export default App;

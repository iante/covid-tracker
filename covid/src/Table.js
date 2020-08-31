import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {/*for every country, split it up and get the country and cases */}
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>
       {/* formats the numbers by adding commas etc*/}{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;

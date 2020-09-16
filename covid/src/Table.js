import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {/*getiing cases for each country */}
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>
       {numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;

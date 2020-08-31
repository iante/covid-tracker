import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
    //keeping track of the country selected in the select option
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
    //keeps track of the cases type selected by user
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 0.0236 , lng: 37.9062 });
  const [mapZoom, setMapZoom] = useState(3);

  //This useEffect displays all countries info when worlwide is selected
    useEffect(() => {
        //async request = cause we are sending a request to server
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
        //fetches data from the server
      fetch("https://disease.sh/v3/covid-19/countries")
        //takes only the json data
        .then((response) => response.json())
        .then((data) => { /*take the data from the server and go through
      data about each counry in a loop and only get country and countryInfo.iso2 data*/
          const countries = data.map((country) => ({
            name: country.country, //i.e kenya
            value: country.countryInfo.iso2, //i.e KE
          }));
          let sortedData = sortData(data);
           //pushing the. countries we requested from the server, to our useState
          setCountries(countries);
          
          //Getting all information about countries from the server API
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
//calling the getCountriesData function we just created above
    getCountriesData();
  }, []);

  console.log(casesType);

    //its async because we are going to be making a call to it
  const onCountryChange = async (e) => {
      //grabs the selected country by user
    const countryCode = e.target.value;
      
 /*Getting data of a particular country based on users selection of a country
     If the country code is worldwide then make url as shown*/
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      //based on the url as per the parameters above, fetch data using the spcified url
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        
        //Storing all the data from a particular country from the server
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker <i>(By Yours Truly IANTE)</i></h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
       //looping through the countries array in the useState
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
            {/* The onClick ={e => setCasesType('recovered')} sets the caseType as defined based on what the user clicks*/}
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases(Today)"
            isRed
             //getting the active case
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered (Today)"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths(Today)"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries} //passing mapCountries as a prop from map.js
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
{/*casesType={casesType} changes the graph and map color based on
what the user clicks i.e deaths, recovered */}
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;

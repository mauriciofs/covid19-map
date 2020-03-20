# Corona vírus Map

Corona vírus updates map, build in Node JS and React.

## Backend

Backend is built in NodeJs, pulling data information from [ECDC] website. A backend process pull information every hour and update the database, file is in xls format:

```txt
DateRep     CountryExp  NewConfCases  NewDeaths GeoId EU
15/03/2020  Afghanistan 3          0         AF       Non-EU/EEA
// file https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-2020-03-15.xls
```

Column date have a history of the corona updates per country.

## Frontend

Frontend is build in React and uses OpenStreeMap to show map data.

[ECDC]: (https://www.ecdc.europa.eu/)

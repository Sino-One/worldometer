import React, { useState, useEffect } from "react";
import { getData } from "../../api/fetch";

export default function Production() {
  const [phones, setPhones] = useState({
    cellular_phones_sold_today: 0,
    cellular_phones_sold_this_year: 0,
  });
  const [bicyles, setBicyles] = useState({
    bicyles_produced_this_year: 0,
    bicyles_produced_today: 0,
  });
  const [cars, setCars] = useState({
    cars_produced_today: 0,
    cars_produced_this_year: 0,
  });
  const [computers, setComputers] = useState({
    computers_produced_today: 0,
    computers_produced_this_year: 0,
  });

  function retrieveData() {
    getData("computers").then((res) => {
      if (
        res &&
        res.data &&
        res.data.computers_produced_today &&
        res.data.computers_produced_this_year
      ) {
        setComputers(res.data);
      }
    });
    getData("bicycles").then((res) => {
      if (
        res &&
        res.data &&
        res.data.bicyles_produced_this_year &&
        res.data.bicyles_produced_today
      ) {
        setBicyles(res.data);
      }
    });
    getData("cars").then((res) => {
      if (
        res &&
        res.data &&
        res.data.cars_produced_this_year &&
        res.data.cars_produced_today
      ) {
        setCars(res.data);
      }
    });
    getData("cellular").then((res) => {
      if (
        res &&
        res.data &&
        res.data.cellular_phones_sold_this_year &&
        res.data.cellular_phones_sold_today
      ) {
        setPhones(res.data);
      }
    });
  }

  useEffect(() => {
    retrieveData();
    setInterval(() => {
      retrieveData();
    }, Math.random() * 20000);
  }, []);

  return <span>{phones.cellular_phones_sold_today}</span>;
}

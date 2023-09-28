import React, { useEffect, useState } from "react";
import { colors, transparentColor } from "../../Utils/utils";
import { getData } from "../../api/fetch";
import { Bar } from "react-chartjs-2";
import { Dna } from "react-loader-spinner";
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";

export default function PopulationGrowth() {
  const [deaths, setDeaths] = useState({
    deaths_today: 0,
    deaths_this_year: 0,
  });
  const [abortions, setAbortions] = useState({
    abortions_today: 0,
    abortions_this_year: 0,
  });
  const [births, setBirths] = useState({
    births_today: 0,
    births_this_year: 0,
  });
  const [chartDayData, setChartDayData] = useState({});
  const [chartYearData, setChartYearData] = useState({});
  const [firstValues, setFirstValues] = useState({
    deaths: 0,
    abortions: 0,
    births: 0,
  });
  const [counter, setCounter] = useState(0);

  function retrieveData() {
    getData("deaths").then((res) => {
      if (
        res &&
        res.data &&
        res.data.deaths_today &&
        res.data.deaths_this_year
      ) {
        setDeaths(res.data);
      }
    });
    getData("abortions").then((res) => {
      if (
        res &&
        res.data &&
        res.data.abortions_today &&
        res.data.abortions_this_year
      ) {
        setAbortions(res.data);
      }
    });
    getData("births").then((res) => {
      if (
        res &&
        res.data &&
        res.data.births_today &&
        res.data.births_this_year
      ) {
        setBirths(res.data);
      }
    });
  }

  useEffect(() => {
    retrieveData();
    setInterval(() => {
      retrieveData();
    }, Math.random() * 20000);
  }, []);

  useEffect(() => {
    setChartDayData({
      labels: [""],
      datasets: [
        {
          label: "Morts",
          data: [deaths.deaths_today],
          backgroundColor: colors.blue,
          borderColor: transparentColor.blue,
          borderWidth: 1,
        },
        {
          label: "Avortements",
          data: [Math.floor(abortions.abortions_this_year / 365)],
          backgroundColor: colors.orange,
          borderColor: transparentColor.orange,
          borderWidth: 1,
        },
        {
          label: "Naissance",
          data: [births.births_today],
          backgroundColor: colors.purple,
          borderColor: transparentColor.purple,
          borderWidth: 1,
        },
      ],
    });
    setChartYearData({
      labels: [""],
      datasets: [
        {
          label: "Morts",
          data: [deaths.deaths_this_year],
          backgroundColor: colors.blue,
          borderColor: transparentColor.blue,
          borderWidth: 1,
        },
        {
          label: "Avortements",
          data: [abortions.abortions_this_year],
          backgroundColor: colors.orange,
          borderColor: transparentColor.orange,
          borderWidth: 1,
        },
        {
          label: "Naissance",
          data: [births.births_this_year],
          backgroundColor: colors.purple,
          borderColor: transparentColor.purple,
          borderWidth: 1,
        },
      ],
    });
    setFirstValues({
      deaths: !firstValues.deaths
        ? deaths.deaths_this_year
        : firstValues.deaths,
      abortions: !firstValues.abortions
        ? abortions.abortions_this_year
        : firstValues.abortions,
      births: !firstValues.births
        ? births.births_this_year
        : firstValues.births,
    });
  }, [deaths, abortions, births]);

  useEffect(() => {
    const timer =
      counter >= 0 && setInterval(() => setCounter(counter + 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div>
      {/* <div style={{ position: "fixed", inset: 0, height: "80%" }}>
        <Tldraw />
      </div> */}
      {deaths.deaths_this_year === 0 &&
        abortions.abortions_this_year === 0 &&
        births.births_this_year === 0 && (
          <>
            <div
              style={{
                margin: 0,
                position: "absolute",
                top: "50%",
                left: "50%",
                // msTransform: "translate(" - (50 % ", ") - (50 % ")"),
                // transform: "translate(" - (50 % ", ") - (50 % ")"),
              }}
            >
              <Dna
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          </>
        )}

      {!!deaths.deaths_this_year &&
        !!abortions.abortions_this_year &&
        !!births.births_this_year && (
          <>
            <div style={{ display: "flex" }}>
              <div className="chart-container" style={{ width: "50%" }}>
                {/* <h2 style={{ textAlign: "center" }}>Bar Chart</h2> */}
                <Bar
                  data={chartYearData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Cette année",
                      },
                      legend: {
                        display: true,
                      },
                    },
                    // scales: {
                    //   x: {
                    //     display: true,
                    //   },
                    //   y: {
                    //     display: true,
                    //     type: "logarithmic",
                    //   },
                    // },
                  }}
                />
              </div>
              <div className="chart-container" style={{ width: "50%" }}>
                {/* <h2 style={{ textAlign: "center" }}>Bar Chart</h2> */}
                <Bar
                  data={chartDayData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Aujourd'hui",
                      },
                      legend: {
                        display: true,
                      },
                    },
                    // scales: {
                    //   x: {
                    //     display: true,
                    //   },
                    //   y: {
                    //     display: true,
                    //     type: "logarithmic",
                    //   },
                    // },
                  }}
                />
              </div>
            </div>
            {!!firstValues.deaths &&
              !!firstValues.abortions &&
              !!firstValues.births && (
                <>
                  <div>{counter} secondes</div>
                  <h6>Nombre de morts depuis que vous êtes sur la page : </h6>
                  <h3>{deaths.deaths_this_year - firstValues.deaths}</h3>
                  <h6>
                    Nombre d'avortements depuis que vous êtes sur la page :{" "}
                  </h6>
                  <h3>
                    {abortions.abortions_this_year - firstValues.abortions}
                  </h3>
                  <h6>
                    Nombre de naissance depuis que vous êtes sur la page :{" "}
                  </h6>
                  <h3>{births.births_this_year - firstValues.births}</h3>
                </>
              )}
          </>
        )}
    </div>
  );
}

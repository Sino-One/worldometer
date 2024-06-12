import React, { useEffect, useState } from "react";
import { colors, transparentColor } from "../../Utils/utils";
import { getData } from "../../api/fetch";
import { Bar } from "react-chartjs-2";
import { Dna } from "react-loader-spinner";
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { solidDataWiD } from "../../Utils/solidData";

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
    console.log(deaths, abortions, births, firstValues);
  }, [deaths, abortions, births]);

  useEffect(() => {
    if (firstValues.deaths && firstValues.abortions && firstValues.births) {
      const timer =
        counter >= 0 && setInterval(() => setCounter(counter + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, firstValues]);

  return (
    <div style={{ padding: 16 }}>
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
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div style={{ width: "50%" }}>
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
                    responsive: true,
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
              <div style={{ width: "50%" }}>
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
                    responsive: true,
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
                  <Box sx={{ minWidth: 275 }}>
                    <Card variant="outlined">
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          Heure de connexion (UTC +2) :
                        </Typography>
                        <Typography variant="h5" component="div">
                          {new Date().toLocaleTimeString("fr-FR")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <Box
                      sx={{
                        minWidth: 275,
                        maxWidth: 300,
                        padding: 4,
                      }}
                    >
                      <Card
                        variant="outlined"
                        style={{
                          minHeight: 120,
                        }}
                      >
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Nombre de morts depuis {counter} secondes :
                          </Typography>
                          <Typography variant="h5" component="div">
                            {deaths.deaths_this_year - firstValues.deaths}
                          </Typography>
                          {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        adjective
                      </Typography>
                      <Typography variant="body2">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                      </Typography>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions> */}
                        </CardContent>
                      </Card>
                    </Box>
                    <Box sx={{ minWidth: 275, maxWidth: 300, padding: 4 }}>
                      <Card
                        variant="outlined"
                        style={{
                          minHeight: 120,
                        }}
                      >
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Nombre de naissances depuis {counter} secondes :
                          </Typography>
                          <Typography variant="h5" component="div">
                            {births.births_this_year - firstValues.births}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    <Box sx={{ minWidth: 275, maxWidth: 300, padding: 4 }}>
                      <Card
                        variant="outlined"
                        style={{
                          minHeight: 120,
                        }}
                      >
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Nombre d'avortements depuis {counter} secondes :
                          </Typography>
                          <Typography variant="h5" component="div">
                            {abortions.abortions_this_year -
                              firstValues.abortions}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <Box sx={{ minWidth: 275, padding: 4 }}>
                      <Card variant="outlined">
                        <CardContent style={{ textAlign: "center" }}>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Statistiques des morts par an:
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((deaths.deaths_this_year -
                                solidDataWiD.deaths[2022]) /
                                solidDataWiD.deaths[2022]) *
                              100
                            ).toFixed(2)}{" "}
                            % depuis 2022 ({solidDataWiD.deaths[2022]})
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((solidDataWiD.deaths[2022] -
                                solidDataWiD.deaths[2021]) /
                                solidDataWiD.deaths[2021]) *
                              100
                            ).toFixed(2)}{" "}
                            % entre 2021 et 2022({solidDataWiD.deaths[2021]})
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((solidDataWiD.deaths[2021] -
                                solidDataWiD.deaths[2020]) /
                                solidDataWiD.deaths[2020]) *
                              100
                            ).toFixed(2)}{" "}
                            % entre 2020 et 2021({solidDataWiD.deaths[2020]})
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((solidDataWiD.deaths[2020] -
                                solidDataWiD.deaths[2019]) /
                                solidDataWiD.deaths[2019]) *
                              100
                            ).toFixed(2)}{" "}
                            % entre 2019 et 2020({solidDataWiD.deaths[2019]})
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    <Box sx={{ minWidth: 275, padding: 4 }}>
                      <Card variant="outlined">
                        <CardContent style={{ textAlign: "center" }}>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Statistiques des naissances par an:
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((births.births_this_year -
                                solidDataWiD.births[2022]) /
                                solidDataWiD.births[2022]) *
                              100
                            ).toFixed(2)}{" "}
                            % depuis 2022 ({solidDataWiD.births[2022]})
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((solidDataWiD.births[2022] -
                                solidDataWiD.births[2021]) /
                                solidDataWiD.births[2021]) *
                              100
                            ).toFixed(2)}{" "}
                            % entre 2021 et 2022({solidDataWiD.births[2021]})
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((solidDataWiD.births[2021] -
                                solidDataWiD.births[2020]) /
                                solidDataWiD.births[2020]) *
                              100
                            ).toFixed(2)}{" "}
                            % entre 2020 et 2021 ({solidDataWiD.births[2020]})
                          </Typography>
                          <Typography variant="h5" component="div">
                            {(
                              ((solidDataWiD.births[2020] -
                                solidDataWiD.births[2019]) /
                                solidDataWiD.births[2019]) *
                              100
                            ).toFixed(2)}{" "}
                            % entre 2019 et 2020 ({solidDataWiD.births[2019]})
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </div>
                </>
              )}
          </>
        )}
    </div>
  );
}

import Grid from "@mui/material/Grid";
import PrayerCard from "./PrayerCard";
import Mode from "./modeSwitch";
import Select from "./Select";
import Loading from "./Loading";
import Footer from "./footer.jsx";
import Logo from "../../public/images/logo.png";
import "../css files/MainComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
export default function Maincomponent() {
  // selected city
  const [selectedCity, setSelectedcity] = useState({
    arabicCityName: "دمشق",
    CountryISOName: "SY",
    cityName: "Damascus",
  });
  function updateCity(city) {
    setSelectedcity(city);
  }
  // available cities
  let cities = [
    {
      arabicCityName: "دمشق",
      CountryISOName: "SY",
      cityName: "Damascus",
    },
    {
      arabicCityName: "القاهرة",
      CountryISOName: "EGY",
      cityName: "Cairo",
    },
    {
      arabicCityName: "بيروت",
      CountryISOName: "LBN",
      cityName: "Beirut",
    },
    {
      arabicCityName: "مكة المكرمة",
      CountryISOName: "SA",
      cityName: "Makkah al Mukarramah",
    },
    {
      arabicCityName: "الرياض",
      CountryISOName: "SA",
      cityName: "Alriyad",
    },
    {
      arabicCityName: "الشرقية",
      CountryISOName: "SA",
      cityName: "AL sharkeya ",
    },
    {
      arabicCityName: "جدة",
      CountryISOName: "SA",
      cityName: "Jaddah",
    },
  ];
  // dark mode
  const [darkMode, setDarkMode] = useState(false);
  function handleModeClick() {
    if (darkMode === false) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }
  const checkBackground = darkMode ? "background dark" : "background light";
  // a new state to store the timings "after" re-render (update the city)
  const [timings, setTimings] = useState({
    Asr: "00:00",
    Dhuhr: "00:00",
    Fajr: "00:00",
    Imsak: "00:00",
    Isha: "00:00",
    Midnight: "00:00",
    Sunrise: "00:00",
    Sunset: "00:00",
  });
  // a new state to store the current date
  const [date, setDate] = useState();
  // a new state to store the current date (hijri)
  const [dateHijri, setDateHijri] = useState();
  // loading state
  const [loading, setLoading] = useState(false);
  // get timings function
  async function getTimings() {
    setLoading(true);

    try {
      const param = {
        country: selectedCity.CountryISOName,
        city: selectedCity.cityName,
      };

      const data = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
        params: param,
      });

      setTimings(data.data.data.timings);

      const date = data.data.data.date.gregorian.date;
      const weekDay = data.data.data.date.hijri.weekday.ar;
      setDate(`${weekDay} ${date}`);

      const dateHijri = data.data.data.date.hijri.date;
      const weekDayHijri = data.data.data.date.hijri.month.ar;
      setDateHijri(`${weekDayHijri} ${dateHijri}`);
    } catch (error) {
      console.error("Error fetching timings:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getTimings();
  }, [selectedCity]);
  // next prayer time
  const [timer, setTimer] = useState();
  const [nextPrayer, setNextPrayer] = useState();
  useEffect(() => {
    let counter = setInterval(() => {
      getNextPrayer();
    }, 1000);

    return () => clearInterval(counter);
  }, [timings]);
  function getNextPrayer() {
    // here we use a library in javascript (moment.js)
    const now = moment();
    const fajrMoment = moment(timings["Fajr"], "hh:mm");
    const dhuhrMoment = moment(timings["Dhuhr"], "hh:mm");
    const asrMoment = moment(timings["Asr"], "hh:mm");
    const sunsetMoment = moment(timings["Sunset"], "hh:mm");
    const ishaMoment = moment(timings["Isha"], "hh:mm");
    if (now.isAfter(fajrMoment) && now.isBefore(dhuhrMoment)) {
      setNextPrayer("الظهر");
      setTimer(moment.utc(dhuhrMoment.diff(now)).format("HH:mm:ss"));
    } else if (now.isAfter(dhuhrMoment) && now.isBefore(asrMoment)) {
      setNextPrayer("العصر");
      setTimer(moment.utc(asrMoment.diff(now)).format("HH:mm:ss"));
    } else if (now.isAfter(asrMoment) && now.isBefore(sunsetMoment)) {
      setNextPrayer("المغرب");
      setTimer(moment.utc(sunsetMoment.diff(now)).format("HH:mm:ss"));
    } else if (now.isAfter(sunsetMoment) && now.isBefore(ishaMoment)) {
      setNextPrayer("العشاء");
      setTimer(moment.utc(ishaMoment.diff(now)).format("HH:mm:ss"));
    } else {
      setNextPrayer("الفجر");
      const diffone = moment("23:59:59", "hh:mm:ss").diff(now);
      const difftwo = fajrMoment.diff(moment("00:00:00", "hh:mm:ss"));
      const sum = moment.duration(diffone + difftwo);
      const result = `${sum.hours().toString().padStart(2, "0")}:${sum
        .minutes()
        .toString()
        .padStart(2, "0")}:${sum.seconds().toString().padStart(2, "0")}`;
      setTimer(result);
    }
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* dark and light mode */}
      <Mode darkModeFunction={handleModeClick} darkMode={darkMode} />
      {/* --------------------------------------------------- */}
      {/* header */}
      <Grid
        container
        spacing={2}
        className={darkMode ? "header dark" : "header light"}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <Grid
          size={6}
          className={darkMode ? "time-place dark" : "time-place light"}
        >
          <h2>
            {loading ? (
              ""
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{ marginLeft: "5px" }}
                />
                {date}
              </>
            )}
          </h2>
          <h2>
            {loading ? (
              <Loading darkMode={darkMode} />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{ marginLeft: "5px" }}
                />
                {dateHijri}
              </>
            )}
          </h2>
          <h2>
            {loading ? (
              ""
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ marginLeft: "5px" }}
                />
                {selectedCity.arabicCityName}
              </>
            )}
          </h2>
        </Grid>
        <Grid
          size={6}
          className={darkMode ? "next-prayer dark" : "next-prayer light"}
        >
          {loading ? (
            <Loading darkMode={darkMode} />
          ) : (
            <>
              <h2>متبقي حتى صلاة {nextPrayer}</h2>
              <h2>{timer}</h2>
            </>
          )}
        </Grid>
      </Grid>
      {/* --------------------------------------------------- */}
      {/* prayer timings */}
      <div className={darkMode ? "landing dark" : "landing light"}>
        {/* title */}
        <p className={darkMode ? "title dark one" : "title light one"}>
          <FontAwesomeIcon icon={faClock} className="title-icon" /> مواقيت
          الصلاة
        </p>
        {/* prayer timings cards */}
        <div className="cards-container">
          <PrayerCard
            name={"الفجر"}
            time={timings.Fajr}
            darkMode={darkMode}
            iconPlace={"fajr"}
          ></PrayerCard>
          <PrayerCard
            name={"الظهر"}
            darkMode={darkMode}
            time={timings.Dhuhr}
            iconPlace={"dhuhr"}
          ></PrayerCard>
          <PrayerCard
            name={"العصر"}
            time={timings.Asr}
            darkMode={darkMode}
            iconPlace={"asr"}
          ></PrayerCard>
          <PrayerCard
            name={"المغرب"}
            time={timings.Sunset}
            darkMode={darkMode}
            iconPlace={"sunset"}
          ></PrayerCard>
          <PrayerCard
            name={"العشاء"}
            time={timings.Isha}
            darkMode={darkMode}
            iconPlace={"isha"}
          ></PrayerCard>
        </div>
        {/* title */}
        <p className={darkMode ? "title dark" : "title light"}>
          <FontAwesomeIcon icon={faClock} className="title-icon" /> مواقيت أخرى
        </p>
        <div className="cards-container">
          {" "}
          <PrayerCard
            name={"الإمساك"}
            time={timings.Imsak}
            darkMode={darkMode}
            iconPlace={"imsak"}
          ></PrayerCard>
          <PrayerCard
            name={"الشروق"}
            time={timings.Sunrise}
            darkMode={darkMode}
            iconPlace={"sunrise"}
          ></PrayerCard>
          <PrayerCard
            name={"منتصف الليل"}
            time={timings.Midnight}
            darkMode={darkMode}
            iconPlace={"mid"}
          ></PrayerCard>
        </div>
        <Select
          cities={cities}
          updateCity={updateCity}
          darkMode={darkMode}
        ></Select>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

// *********************************

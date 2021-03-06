import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EventCalender.scss";

moment.locale("en-GB");

class EventCalender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      views: ["week", "day"],
      defaultView: "day",
      viewDate: null,
    };
  }

  /*
    Inside componentDidMount following things are done
    1. creating an online-offline event object and pushing it to the tempEvents array 
    2. adding the last event date to viewDate(it will redirect to given date when calendar opens )
  */
  componentDidMount() {
    const activityPeriods = this.props.activityPeriods;
    let tempEvents = [];

    activityPeriods.forEach((item, index) => {
      tempEvents.push({
        id: index,
        title: "",
        start: this.createNewDate(item.start_time),
        end: this.createNewDate(item.end_time),
      });
    });

    this.setState({
      events: tempEvents,
      viewDate: tempEvents[tempEvents.length - 1].start,
    });
  }

  /*
    It return the new Date object from given date string
  */
  createNewDate = (date) => {
    let tempDate = date.split(/\s+/);
    tempDate[0] = this.getMonthNumber(tempDate[0]);
    tempDate[3] = this.convertTime12to24(tempDate[3].replace(/.{2}$/, " $&"));
    const year = tempDate[2];
    const month = tempDate[0];
    const day = tempDate[1];
    const hours = tempDate[3].split(":")[0];
    const minutes = tempDate[3].split(":")[1];
    return new Date(year, month, day, hours, minutes);
  };

  /*
    It return the month index from given month name 
  */
  getMonthNumber = (month) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let monthNumber;

    months.forEach((item, index) => {
      if (item === month) {
        monthNumber = index;
      }
    });
    return monthNumber.toString();
  };

  /*
    It convert the 12 hours time to 24 hours
  */
  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  render() {
    const { events, views, defaultView, viewDate } = this.state;
    return (
      <Calendar
        events={events}
        defaultView={defaultView}
        views={views}
        defaultDate={new Date()}
        step={15}
        timeslots={4}
        localizer={momentLocalizer(moment)}
        date={viewDate}
        onNavigate={(date) => {
          this.setState({ viewDate: date });
        }}
      />
    );
  }
}

export default EventCalender;

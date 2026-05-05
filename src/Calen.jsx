import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

function Calen() {
  const [value, setValue] = useState(new Date());

  return (
    <div className="calendar-wrapper">
      <Calendar
        value={value}
        onChange={setValue} 
        
      />
    </div>
  );
}

export default Calen;

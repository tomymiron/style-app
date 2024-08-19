import { COLORS, SIZES } from "../constants/theme";
import { Link } from "react-router-dom";
import Transition from "../Transition";
import Icon from "../constants/Icon";
import { useState } from "react";
import "./styles/booking.scss";

export function Booking() {
  const [step, setStep] = useState(1);

  // -- DATE SELECT LOGIC --
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  function getNextDays(startDate, numberOfDays = 6) {
    const dates = [];
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({dateObj: date, dayOfWeek: daysOfWeek[date.getDay()], day: date.getDate(), month: months[date.getMonth()]});
    }
    return dates;
  }
  const handleDateSelect = (date) => { setSelectedDate(date);};
  const handleNextDays = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 6);
    setStartDate(newStartDate);
  };
  const handlePreviousDays = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newStartDate >= today) {
      setStartDate(newStartDate);
    }
  };
  const currentDays = getNextDays(startDate);
  // -- DATE SELECT LOGIC --

  // -- TIME SELECT LOGIC --
  const [selectedTime, setSelectedTime] = useState(null);

  function generateTimeSlots(startTime = "09:00", endTime = "21:00", intervalMinutes = 30) {
    const slots = [];
    let start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    while (start <= end) {
      slots.push(start.toTimeString().substring(0, 5) + "hs");
      start = new Date(start.getTime() + intervalMinutes * 60000);
    }
    return slots;
  }
  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time) => setSelectedTime(time);
  // -- TIME SELECT LOGIC --

  function ServiceItem ({ id, title, price, time }) {
    const [select, setSelect] = useState(false);

    return (
      <button className={select ? "serviceSelectItem active" : "serviceSelectItem"} onClick={() => setSelect(!select)}>
        <p className="serviceSelectItemTitle">{title}</p>
        <p className="serviceSelectItemPrice">${price}</p>
        <p className="serviceSelectItemTime">{time}</p>
        <div className="serviceSelectItemIcon">
          <Icon name={select ? "minus" : "plus"} color={select ? COLORS.black_01 : COLORS.white_01}/>
        </div>
      </button>
    )
  }

  function DateItem({ date, month, dateObj, start = false, end = false }) {
    const isSelected = selectedDate && selectedDate?.getTime() &&  selectedDate.getTime() === dateObj.getTime();

    return (
      <button className={`dateSelectItem ${start ? "start" : ""} ${end ? "end" : ""} ${isSelected ? "selected" : ""}`} onClick={() => handleDateSelect(dateObj)}>
        <p className="dateSelectItemDate">{date}</p>
        <p className="dateSelectItemMonth">{month}</p>
      </button>
    );
  }

  function TimeItem({ time }){
    const isSelected = selectedTime === time;

    return (
      <button className={`timeSelectItem ${isSelected ? "selected" : ""}`} onClick={() => handleTimeSelect(time)}>
        <p className="timeSelectItemTime">{time}</p>
      </button>
    );
  }

  return (
    <div id="Booking">
        <section id="step01" className="bookStep" style={{left: step == 1 ? 0 : "-100vw"}}>

          <Link className="backBtn">
            <Icon name="left-arrow" color={COLORS.black_01}/>
          </Link>
          <div className="activityIndicator">
            <h2>SOLICITAR TURNO</h2>
          </div>
          <h1>RICHARD ANDERSON</h1>
          <h3>Seleccione al menos un servicio</h3>

          <div id="serviceSelect">

            <ServiceItem title="Corte de pelo" price="7.000" time="30 mins" />
            <ServiceItem title="Corte de barba" price="3.000" time="15 mins" />
            <ServiceItem title="Corte y barba" price="8.000" time="45 mins" />
            <ServiceItem title="Claritos con corte" price="20.000" time="2hrs 30 mins" />
            <ServiceItem title="Color completo con corte" price="24.000" time="3hrs" />

          </div>
          
        </section>

        <section id="step02" className="bookStep" style={{left: step == 1 ? "0" : step == 2 ? "-100vw" : "-200vw"}}>

          <button className="backBtn" onClick={() => setStep(1)}>
            <div>
              <Icon name="left-arrow" color={COLORS.black_01}/>
            </div>
          </button>
          <div className="activityIndicator">
            <h2>AGENDAR TURNO</h2>
          </div>
          <h1>RICHARD ANDERSON</h1>
          <h3>Seleccione una fecha y horario</h3>

          
          <div id="dateSelectContainer">
            <button id="dateSelectBackBtn" onClick={() => handlePreviousDays()}>
              <Icon name="left-arrow-simple" color={COLORS.gray_01} size={24}/>
            </button>

            <div id="dateSelect">

              <div id="dateSelectTop">
                {currentDays.map((day, index) => ( <p key={index}>{day.dayOfWeek}</p>))}
              </div>

              <div id="dateSelectBody">
                {currentDays.map((day, index) => (<DateItem key={index} date={day.day} month={day.month} dateObj={day.dateObj} start={index === 0} end={index === currentDays.length - 1}/>))}
              </div>

            </div>

            <button id="dateSelectNextBtn" onClick={handleNextDays}>
              <Icon name="right-arrow-simple" color={COLORS.gray_01} size={24}/>
            </button>
          </div>

          <div id="timeSelect">
            {timeSlots.map((time, index) => (<TimeItem key={index} time={time}/>))}
          </div>
          
        </section>

        <section id="step03" className="bookStep" style={{left: step == 1 || step == 2 ? "0" : step == 3 ? "-200vw" : "-300vw"}}>

          <button className="backBtn" onClick={() => setStep(2)}>
            <div>
              <Icon name="left-arrow" color={COLORS.black_01}/>
            </div>
          </button>
          <div className="activityIndicator">
            <h2>CONFIRMAR TURNO</h2>
          </div>
          <h1>RICHARD ANDERSON</h1>
          <p id="locationText">Avenida Eva Peron 354</p>
          <h3>Ingrese algunos datos</h3>

          <div id="inputContainer">
            <input name="mail" placeholder="Email"/>
            <input name="name" placeholder="Nombre"/>
            <input name="instagram" placeholder="Instagram (opcional)"/>
            <textarea name="note" placeholder="Comentario (opcional)"/>
          </div>

          <h4>Reserva para la fecha <strong>Viernes 01 Sep</strong> a las <strong>12.00hs</strong></h4>

          <div id="checkoutItemsContainer">
            <div id="checkoutItemsContainerTop">

              <div className="checkoutItem">
                <div className="checkoutItemLeft">
                  <Icon name="right-arrow-simple" color={COLORS.blue_01}/>
                  <div>
                    <p className="checkoutItemTitle">Corte de pelo y barba</p>
                    <p className="checkoutItemTime">45 mins</p>
                  </div>
                </div>
                <p className="checkoutItemPrice">$8.000</p>
              </div>

            </div>
            <div id="checkoutItemsContainerBottom">
              <p>Total</p>
              <p>$8.000</p>
            </div>
          </div>

        </section>

        <section id="step04" className="bookStep final" style={{left: step == 1 || step == 2 || step == 3 ? "0" : step == 4 ? "-300vw" : "-400vw"}}>
          <Link className="backBtn invert">
              <Icon name="close" color={COLORS.blue_01}/>
          </Link>
          <h5>RESERVA REALIZADA CON EXITO!</h5>
          <p id="successEndMessage">Se envio un email con los detalles de la reserva</p>
        </section>

        <button id="continueBtn" className="hiden" onClick={() => setStep(step + 1)}>
          <div id="continueBtn1">
            <p id="continueBtnTotal">Total: <strong>$8.000</strong></p>
            <p id="continueBtnServices">1 Servicio</p>
          </div>
          <div id="continueBtn2">
            <p>CONTINUAR</p>
            <Icon name="right-arrow-simple" color={COLORS.black_01}/>
          </div>
        </button>
    </div>
  );
}

export default Transition(Booking);
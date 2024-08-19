import { COLORS, SIZES } from "../constants/theme";
import { AsyncImage } from "loadable-image";
import { Link } from "react-router-dom";
import Transition from "../Transition";
import { Fade } from "transitions-kit";
import Icon from "../constants/Icon";
import "./styles/clientViewer.scss";

import background01 from "../assets/background-01.png";
import image01 from "../assets/image01.png";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../config/axios.js";

export function ClientViewer() {
  const storeId = 1;

  const { data: store, isLoading } = useQuery({
    queryFn: () => makeRequest.get("/store").then((res) => res.data),
    queryKey: ["store", storeId],
  });
  console.log(store)

  if(isLoading) {
    return (
      <div>
        <p>Cargando...</p>
      </div>
    )
  }

  function ServiceItem({id, title, time, price}) {

    return (
      <div className="serviceItem" key={id}>
      <div className="serviceItem1">
        <div className="serviceItemIcon">
          <Icon name="right-arrow-simple" color={COLORS.blue_01}/>
        </div>
        <div className="serviceItem2">
          <p className="itemTitle">{title}</p>
          <p className="itemTime">{time}</p>
        </div>
      </div>
      <p className="itemPrice">${price}</p>
    </div>
    );
  }

  function ContactItem({ type, value, visibleValue }) {

    return (
      <div className="contactItem">
        <div className="contactItem1">
          <div className="calendarIcon">
            <Icon name="right-arrow-simple" color={COLORS.blue_01}/>
          </div>
          <p className="contactItemType">{type}</p>
        </div>
        <p className="contactItemValue">{visibleValue ? visibleValue : value}</p>
      </div>
    );
  }

  const contactLinksTemplate = ["mailto:", "https://wa.me/", "https://www.instagram.com/", "https://www.facebook.com/"];
  const contactIconsTemplate = ["email", "whatsapp-logo", "instagram-logo"];
  function ContactItemLink({ typeId, value }) {

    return (
      <a className="contactLinkItem" href={contactLinksTemplate[typeId - 1] + value} target="_BLANK">
        <Icon name={contactIconsTemplate[typeId - 1]}/>
      </a>
    );
  }

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  function formatTime(time) {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const formattedHours = parseInt(hours, 10);
    return minutes === '00' ? formattedHours : `${formattedHours}.${minutes}`;
  }
  
  function calculateTimeDifference(openingTimes) {
    const now = new Date();
    const currentDay = now.getDay() || 7;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextOpening = Infinity;
    let nextClosing = Infinity;
    let openingToday = false;
    let closingToday = false;

    openingTimes.forEach(({ day, start_time, end_time }) => {
        const start = parseInt(start_time.split(':')[0], 10) * 60 + parseInt(start_time.split(':')[1], 10);
        const end = parseInt(end_time.split(':')[0], 10) * 60 + parseInt(end_time.split(':')[1], 10);

        if (day === currentDay) {
            openingToday = true;

            if (currentTime < start) nextOpening = Math.min(nextOpening, start - currentTime);
            else if (currentTime < end) {
                closingToday = true;
                nextClosing = Math.min(nextClosing, end - currentTime);
            }
        } else {
            if (day > currentDay) nextOpening = Math.min(nextOpening, (day - currentDay) * 1440 + start - currentTime);
            else nextOpening = Math.min(nextOpening, (7 - currentDay + day) * 1440 + start - currentTime);
        }
    });

    if (openingToday && closingToday) return `El local cierra en ${Math.floor(nextClosing / 60)}h ${nextClosing % 60}m`;
    if (openingToday && nextOpening < Infinity) return `El local abre en ${Math.floor(nextOpening / 60)}h ${nextOpening % 60}m`;
    if (nextOpening < Infinity) return `El local abre en ${Math.floor(nextOpening / 60)}h ${nextOpening % 60}m`;
    return "El local está cerrado en este momento";
}

  const scheduleMessage = store?.schedules ? calculateTimeDifference(store.schedules) : "Horario no disponible";
  console.log(scheduleMessage)


  function ScheduleItem({ day, timeStart, timeEnd }) {
    return (
      <div className="scheduleItem" >
        <div className="scheduleItem1">
          <div className="scheduleIcon">
            <Icon name="right-arrow-simple" color={COLORS.blue_01} />
          </div>
          <p className="scheduleDate">{daysOfWeek[day - 1]}</p>
        </div>
        {timeStart && timeEnd ? (
          <p className="scheduleTime">{formatTime(timeStart)}hs - {formatTime(timeEnd)}hs</p>
        ) : (
          <p className="scheduleTime closed">Cerrado</p>
        )}
      </div>
    );
  }

  const scheduleMap = new Map(store?.schedules.map(({ day, start_time, end_time }) => [day, { timeStart: start_time, timeEnd: end_time }]));

  return (
    <div id="ClientViewer">
        <div id="backgroundContainer">
            <div id="backgroundAuxiliar">
                <AsyncImage
                    Transition={Fade}
                    src={background01}
                    style={{ height: "100%", width: "100%" }}
                    loader={<div style={{ background: "transparent" }} />}
                    error={<div style={{ background: "transparent" }}/>}
                />
            </div>
        </div>
        <main id="content">
          <section id="home">
            <Link id="homeLink" to="/">STYLEAPP</Link>
            <h3>TODO SOBRE TU BARBERIA FAVORITA!</h3>
            <h1>{store.name}</h1>
            <h2>BARBER SHOP</h2>

            <div id="scrollIndicator">
              <p>DESLIZA HACIA ARRIBA</p>
              <Icon name="down-arrow-simple" size={SIZES.i1 + 16} color={COLORS.white_01}/>
            </div>
          </section>
          <section id="details">
            <a id="upArrowBtn" href="#content">
              <Icon name="up-arrow" color={COLORS.black_01}/>
            </a>
            <header>
              <div id="tagCategory">
                <h4>BARBERIA</h4>
              </div>
              <h2>{store.name}</h2>
              <p id="locationText">{store.location}<a href={"https://maps.google.com/?q=" + store.locationGoogle} target="_BLANK">VER MAPA</a></p>
              <p id="timePending">{scheduleMessage}</p>
              <div id="review">
                <Icon name="star" size={SIZES.i4} color={COLORS.blue_01}/>
                <Icon name="star" size={SIZES.i4} color={COLORS.blue_01}/>
                <Icon name="star" size={SIZES.i4} color={COLORS.blue_01}/>
                <Icon name="star" size={SIZES.i4} color={COLORS.blue_01}/>
                <Icon name="star" size={SIZES.i4} color={COLORS.blue_01}/>
              </div>
            </header>

            <section id="index">

              <a className="indexOption" href="#priceservices">
                <div className="indexOption1">
                  <Icon name="palette"/>
                  <p>Precios & Servicios</p>
                </div>
                <Icon name="right-arrow"/>
              </a>

              <Link className="indexOption" to="/booking">
                <div className="indexOption1">
                  <Icon name="calendar-select"/>
                  <p>Turnos</p>
                </div>
                <Icon name="right-arrow"/>
              </Link>

              <a className="indexOption" href="#schedules">
                <div className="indexOption1">
                  <Icon name="clock"/>
                  <p>Horarios</p>
                </div>
                <Icon name="right-arrow"/>
              </a>

              <a className="indexOption" href="#contact">
                <div className="indexOption1">
                  <Icon name="share"/>
                  <p>Contacto</p>
                </div>
                <Icon name="right-arrow"/>
              </a>

            </section>

            <section id="about">
              <h3>Nosotros</h3>
              <p>{store.description}</p>

              <div id="carrousel">
                <AsyncImage
                  Transition={Fade}
                  src={image01}
                  style={{ height: "100%", width: "100%" }}
                  loader={<div style={{ background: "transparent" }} />}
                  error={<div style={{ background: "transparent" }}/>}
                />
              </div>
            </section>

            <section id="priceservices">

              <h3>Precios & Servicios</h3>

              <div id="itemsContainer">
                {store.services.map((item) => { return <ServiceItem id={item.id} title={item.title} time={item.time} price={item.price}/>})}
              </div>

            </section>

            <section id="schedules">
              <h3>Horarios</h3>

              <div id="itemsContainer">
              {daysOfWeek.map((day, index) => {
                const scheduleData = scheduleMap.get(index + 1);
                return (
                  <ScheduleItem
                    key={index}
                    day={index + 1}
                    timeStart={scheduleData ? scheduleData.timeStart : undefined}
                    timeEnd={scheduleData ? scheduleData.timeEnd : undefined}
                  />
                );
              })}
            </div>
          </section>

            <section id="contact">
              <h3>Contacto</h3>

              <div id="itemsContainer">
                {store.contact.map((item) => { return <ContactItem key={item.id} type={item.type} value={item.value} visibleValue={item.view_value}/>})}
              </div>

              <div id="contactLinkContainer">
                {store.contact.map((item) => { return <ContactItemLink key={item.id} typeId={item.typeId} type={item.type} value={item.value}/>})}
              </div>

              <h5>Todos los derechos reservados a StyleApp</h5>
            </section>

          </section>
        </main>
    </div>
  );
}

export default Transition(ClientViewer);
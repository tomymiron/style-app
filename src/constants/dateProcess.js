export function dateFormatter(date) {
  function join(date, options, separator) {
    function format(option) {
      let formatter = new Intl.DateTimeFormat("es", option);
      return formatter.format(date);
    }
    return options.map(format).join(separator);
  }
  let options = [{ day: "numeric" }, { month: "numeric" }, { year: "numeric" }];
  let dateSta = join(new Date(date), [{ weekday: "long" }], " ");
  let dateMid = join(new Date(date), options, "/");
  let dateEnd = date.slice(-8, -3);
  let eventDate = dateSta.charAt(0).toUpperCase() + dateSta.slice(1) + " " + dateMid + " | " + dateEnd + "hs";
  return eventDate;
}

export function timeSince(date) {
  let aux = new Date(date);
  var seconds = Math.floor((new Date() - aux) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "años";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "M";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d"
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "hs"
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m"
  }
  return Math.abs(Math.floor(seconds)) + "s"
}
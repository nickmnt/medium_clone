const JDate = require("jalali-date");

export const format = (createdAt: string) => {
  const date = new Date(createdAt);
  const jdate = JDate.toJalali(date);
  
  return `${jdate[0].toLocaleString("fa-IR", {
    useGrouping: false,
  })}/${jdate[1].toLocaleString("fa-IR")}/${jdate[2].toLocaleString(
    "fa-IR"
  )} - ${date.getHours().toLocaleString("fa-IR", {
    minimumIntegerDigits: 2,
  })}:${date.getMinutes().toLocaleString("fa-IR", {
    minimumIntegerDigits: 2,
  })}`;
};

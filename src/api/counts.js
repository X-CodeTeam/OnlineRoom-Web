import request from "@/utils/request";

export function getTodayCount() {
  return request({
    url: "/statistics/today",
  });
}

export function basicOverview() {
  return request({
    url: "/statistics/basicOverview",
  });
}

export function nearlyWeekCheckInPeople() {
  return request({
    url: "/statistics/nearlyWeekCheckInPeople",
  });
}

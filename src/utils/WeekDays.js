Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.minusDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

export function getWeekTabs(counter, date = '') {
    const today = date ? new Date(date) : new Date();
    const startDate = today.minusDays(7 * counter).minusDays(today.getDay());
    const weekDates = getDates(startDate, startDate.addDays(6));
    let tabs = [];
    for (let weekDate of weekDates) {
        let dayInitial = weekDate.toString().split(' ')[0].substring(0, 1);
        let dateValue = weekDate.toString().split(' ')[2];
        const dateData = {
            id: dateValue,
            label: dayInitial + ' - ' + dateValue,
            date: weekDate
        }
        tabs.push(dateData);
    }
    return tabs;
}

export function getSelectKey(date) {
    if (date?.startDate == null || date?.startDate == undefined) {
        return new Date().toString().split(' ')[2];
    } else {
        return date?.startDate?.toString().split('-')[2];
    }
}

export function getMonthYear(tabs) {
    const firstDate = tabs[0].date.toString();
    const lastDate = tabs[tabs.length - 1].date.toString();
    const firstMonth = firstDate.split(' ')[1] + " " + firstDate.split(' ')[3];
    const lastMoth = lastDate.split(' ')[1] + " " + lastDate.split(' ')[3];
    let currentMoth = "";
    if (firstMonth === lastMoth) {
        currentMoth = firstMonth;
    } else {
        currentMoth = firstMonth + " - " + lastMoth;
    }
    return currentMoth;
}
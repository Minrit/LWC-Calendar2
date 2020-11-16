import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class Calendar2 extends LightningElement {
    @api
    modalSize = "small";
    @track
    calendarData = [];
    @track
    columns = [
        {
            label: "SUN",
            fieldName: "sun"
        },
        {
            label: "MON",
            fieldName: "mon"
        },
        {
            label: "TUE",
            fieldName: "tue"
        },
        {
            label: "WED",
            fieldName: "wed"
        },
        {
            label: "THU",
            fieldName: "thu"
        },
        {
            label: "FRI",
            fieldName: "fri"
        },
        {
            label: "SAT",
            fieldName: "sat"
        }
    ];
    @track
    showCreateModal = false;
    @track
    showDetailModal = false;
    @track
    detailModalStatus = false;
    @track
    detailModalIfMulti = false;
    @api
    originEventList = [];
    @track
    eventList = [];
    @track
    onProcess = false;
    @track
    actualTimeZone;
    @track
    monthNow = 0;
    monthOptions = [
        {
            value: 0,
            label: "January"
        },
        {
            value: 1,
            label: "February"
        },
        {
            value: 2,
            label: "March"
        },
        {
            value: 3,
            label: "April"
        },
        {
            value: 4,
            label: "May"
        },
        {
            value: 5,
            label: "June"
        },
        {
            value: 6,
            label: "July"
        },
        {
            value: 7,
            label: "August"
        },
        {
            value: 8,
            label: "September"
        },
        {
            value: 9,
            label: "October"
        },
        {
            value: 10,
            label: "November"
        },
        {
            value: 11,
            label: "December"
        }
    ];
    // normal data used to render the calendar
    monthLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    monthNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    monthName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    // to show the date in the detail modal
    get dateTempForUser() {
        return new Date(this.dateTemp).toLocaleString();
    }
    // to show the start date in the detail modal
    get dateStartTempForUser() {
        return new Date(this.dateStartTemp).toLocaleString();
    }
    // to show the end date in the detail modal
    get dateEndTempForUser() {
        return new Date(this.dateEndTemp).toLocaleString();
    }
    // render the month name now
    get monthNowText() {
        return this.monthName[this.monthNow];
    }
    get createModalCss() {
        let showCreateModal = this.showCreateModal ? "slds-slide-up-open" : "";
        return `slds-modal slds-modal_${this.modalSize} ${showCreateModal}`;
    }
    get createBackdropCss() {
        return this.showCreateModal
            ? "slds-backdrop slds-backdrop_open"
            : "slds-backdrop";
    }
    get detailModalCss() {
        let showDetailModal = this.showDetailModal ? "slds-slide-up-open" : "";
        return `slds-modal slds-modal_${this.modalSize} ${showDetailModal}`;
    }
    get detailBackdropCss() {
        return this.showDetailModal
            ? "slds-backdrop slds-backdrop_open"
            : "slds-backdrop";
    }
    get monthYearModalCss() {
        let showMonthYearModal = this.showMonthYearModal
            ? "slds-slide-up-open"
            : "";
        return `slds-modal slds-modal_${this.modalSize} ${showMonthYearModal}`;
    }
    get monthYearBackdropCss() {
        return this.showMonthYearModal
            ? "slds-backdrop slds-backdrop_open"
            : "slds-backdrop";
    }
    connectedCallback() {
        this.getBasicData();
        this.generateCalendarData();
        Object.assign(this.eventList, this.originEventList);
        this.arrangeEvents();
    }
    renderedCallback() {
        this.reduceOtherDayOpactiy();
        this.highlightToday();
    }
    saveNewEvent() {
        let inputStartDateStatus = JSON.stringify(
            this.template.querySelector(".inputStartDate").value
        );
        let inputEndDateStatus = JSON.stringify(
            this.template.querySelector(".inputEndDate").value
        );
        let inputStartDate = this.template.querySelector(".inputStartDate")
            .value;
        let inputEndDate = this.template.querySelector(".inputEndDate").value;
        let inputEvent = this.template.querySelector(".inputEvent").value;
        let inputDescription = this.template.querySelector(".inputDescription")
            .value;
        let randomNum = "";
        for (let i = 0; i < 6; i++) {
            randomNum += Math.floor(Math.random() * 10);
        }
        let eventId = new Date(inputStartDate).getMilliseconds() + randomNum;
        if (
            inputEvent.replace(/(^s*)|(s*$)/g, "").length !== 0 &&
            inputStartDateStatus !== "null" &&
            inputEndDateStatus !== "null" &&
            new Date(inputStartDate) < new Date(inputEndDate)
        ) {
            this.onProcess = true;
            this.template.querySelector(".inputStartDate").disabled = true;
            this.template.querySelector(".inputEndDate").disabled = true;
            this.template.querySelector(".inputEvent").disabled = true;
            this.template.querySelector(".inputDescription").disabled = true;
            let newEvent = {
                startDate: new Date(inputStartDate),
                endDate: new Date(inputEndDate),
                title: inputEvent,
                description: inputDescription,
                id: eventId
            };
            const event = new CustomEvent("newevent", {
                detail: newEvent
            });
            this.dispatchEvent(event);
            this.eventList.push(newEvent);
            this.refreshCalendar();
            this.onProcess = false;
            this.toHideCreateModal();
            this.template.querySelector(".inputStartDate").disabled = false;
            this.template.querySelector(".inputEndDate").disabled = false;
            this.template.querySelector(".inputEvent").disabled = false;
            this.template.querySelector(".inputDescription").disabled = false;
        } else {
            this.showToast("ERROR", "Illegal input", "error");
        }
    }
    eventClickHandler(evt) {
        evt.stopPropagation();
        this.titleTemp = evt.target.title;
        this.descriptionTemp = evt.target.dataset.description;
        this.eventId = evt.target.dataset.id;
        this.eventType = evt.target.dataset.type;
        this.dateStartTemp = evt.target.dataset.datestart;
        this.dateEndTemp = evt.target.dataset.dateend;
        this.toShowDetailModal();
    }
    toEdit() {
        this.detailModalStatus = true;
        this.dateStartTempEdit = this.dateStartTemp;
        this.dateEndTempEdit = this.dateEndTemp;
        this.titleTempEdit = this.titleTemp;
        this.descriptionTempEdit = this.descriptionTemp;
    }
    backToDetail() {
        this.detailModalStatus = false;
    }
    toSaveEdit() {
        let inputStartDateStatus = JSON.stringify(
            this.template.querySelector(".inputStartDateEdit").value
        );
        let inputStartDate = this.template.querySelector(".inputStartDateEdit")
            .value;
        let inputEndDateStatus = JSON.stringify(
            this.template.querySelector(".inputEndDateEdit").value
        );
        let inputEndDate = this.template.querySelector(".inputEndDateEdit")
            .value;
        let inputEvent = this.template.querySelector(".inputEventEdit").value;
        let inputDescription = this.template.querySelector(
            ".inputDescriptionEdit"
        ).value;
        if (
            inputEvent.replace(/(^s*)|(s*$)/g, "").length !== 0 &&
            inputStartDateStatus !== "null" &&
            inputEndDateStatus !== "null" &&
            new Date(inputStartDate).getTime() <
                new Date(inputEndDate).getTime()
        ) {
            this.onProcess = true;
            this.template.querySelector(".inputStartDateEdit").disabled = true;
            this.template.querySelector(".inputEndDateEdit").disabled = true;
            this.template.querySelector(".inputEventEdit").disabled = true;
            this.template.querySelector(
                ".inputDescriptionEdit"
            ).disabled = true;
            this.dateStartTempEdit = inputStartDate;
            this.dateEndTempEdit = inputEndDate;
            this.titleTempEdit = inputEvent;
            this.descriptionTempEdit = inputDescription;
            let editEvent = {
                startDate: new Date(inputStartDate),
                endDate: new Date(inputEndDate),
                title: inputEvent,
                description: inputDescription,
                id: this.eventId
            };
            const event = new CustomEvent("editevent", {
                detail: editEvent
            });
            this.dispatchEvent(event);
            this.template.querySelector(".inputStartDateEdit").disabled = false;
            this.template.querySelector(".inputEndDateEdit").disabled = false;
            this.template.querySelector(".inputEventEdit").disabled = false;
            this.template.querySelector(
                ".inputDescriptionEdit"
            ).disabled = false;
            this.onProcess = false;
            this.toHideDetailModal();
            this.detailModalStatus = false;
            this.deleteEventByEventId();
            this.eventList.push(editEvent);
            this.refreshCalendar();
            this.showToast("Success", "Edit Success", "success");
        } else {
            this.showToast("ERROR", "Illegal input", "error");
        }
    }
    toDeleteEvent() {
        this.onProcess = true;
        const event = new CustomEvent("deleteevent", {
            detail: {
                eventId: this.eventId
            }
        });
        this.dispatchEvent(event);
        this.deleteEventByEventId();
        this.refreshCalendar();
        this.toHideDetailModal();
        this.detailModalStatus = false;
        this.onProcess = false;
        this.showToast("Success", "Delete Success", "success");
    }
    deleteEventByEventId() {
        let length = this.eventList.length;
        for (let i = 0; i < length; i++) {
            if (this.eventList[i].id === this.eventId) {
                this.eventList.splice(i, 1);
                break;
            }
        }
    }
    refreshCalendar() {
        this.calendarData = [];
        this.generateCalendarData();
        this.arrangeEvents();
    }
    thisMonth(d, h, m) {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0);
    }
    dateTileClickHandler(evt) {
        //let the input value equal to the date of the tile clicked
        this.tempDate = new Date(
            evt.currentTarget.dataset.datestring
        ).toUTCString();
        this.toShowCreateModal();
    }
    /**
     * @description generate calendar data for template to render
     * @param {*} eventList
     */
    generateCalendarData() {
        let totalDay = this.getIfLeap(this.monthNow, this.yearNow); //get the total day count of this month
        let firstDay = this.getDayStart(this.monthNow, this.yearNow); //get the first day(week) of this month
        //get next page day
        let nextPageMonth = this.monthNow + 1;
        let nextPageYear = this.yearNow;
        if (nextPageMonth > 11) {
            nextPageYear = this.yearNow + 1;
            nextPageMonth = 0;
        }
        //get previous page day
        let prevPageMonth = this.monthNow - 1;
        let prevPageYear = this.yearNow;
        if (prevPageMonth < 0) {
            prevPageYear = this.yearNow - 1;
            prevPageMonth = 11;
        }
        let calendarList = [];
        let count = 0;
        let countN = 0;
        let countP = this.getIfLeap(prevPageMonth, prevPageYear) - firstDay;
        let k = 0;
        // assemble the calendar list
        for (let i = 0; i < 6; i++) {
            let itemList = [];
            if (i === 0) {
                for (k = 1; k <= firstDay; k++) {
                    countP++;
                    itemList.push({
                        value: countP + "",
                        type: "",
                        label: countP + "",
                        index: countP + "",
                        status: "prevMonth",
                        dateString: new Date(
                            prevPageYear,
                            prevPageMonth,
                            countP,
                            0,
                            0,
                            0,
                            0
                        ).toISOString()
                    });
                }
                k--;
            } else {
                k = 0;
            }
            for (let j = 0; j < 7 - k; j++) {
                count++;
                if (count > totalDay) {
                    countN++;
                    itemList.push({
                        value: countN + "",
                        type: "",
                        label: countN + "",
                        index: countN + "",
                        status: "nextMonth",
                        dateString: new Date(
                            nextPageYear,
                            nextPageMonth,
                            countN,
                            0,
                            0,
                            0,
                            0
                        ).toISOString()
                    });
                } else {
                    itemList.push({
                        value: count + "",
                        type: "",
                        label: count + "",
                        index: count,
                        status: "thisMonth",
                        dateString: new Date(
                            this.yearNow,
                            this.monthNow,
                            count,
                            0,
                            0,
                            0,
                            0
                        ).toISOString()
                    });
                }
            }
            calendarList.push({
                items: itemList,
                weekStart: itemList[0].dateString,
                weekIndex: i,
                events: []
            });
        }
        this.calendarData = calendarList;
    }
    arrangeEvents() {
        let calendarData = this.calendarData;
        for (let i = 0; i < 6; i++) {
            const weekStart = new Date(calendarData[i].weekStart);
            const items = this.findAndSortItemsInWeek(weekStart);
            const results = [];
            const itemRows = [[], [], [], [], [], [], []];
            for (let i = 0; i < items.length; i++) {
                const ep = Object.assign({}, items[i], {
                    classes: ["cv-item"],
                    itemRow: 0
                });
                const continued = ep.startDate < weekStart;
                const startOffset = continued
                    ? 0
                    : this.dayDiff(weekStart, ep.startDate);
                const span = Math.min(
                    7 - startOffset,
                    this.dayDiff(
                        this.addDays(weekStart, startOffset),
                        ep.endDate
                    ) + 1
                );
                if (continued) ep.classes.push("continued");
                if (this.dayDiff(weekStart, ep.endDate) > 6)
                    ep.classes.push("toBeContinued");
                if (this.isInPast(ep.endDate)) ep.classes.push("past");
                // if (ep.originalItem.url) ep.classes.push("hasUrl")
                for (let d = 0; d < 7; d++) {
                    if (d === startOffset) {
                        let s = 0;
                        while (itemRows[d][s]) {
                            s++;
                        }
                        ep.itemRow = s;
                        itemRows[d][s] = true;
                    } else if (d < startOffset + span) {
                        itemRows[d][ep.itemRow] = true;
                    }
                }

                ep.classes.push(`offset${startOffset}`);
                ep.classes.push(`span${span}`);

                let classesString = "";
                for (let c = 0; c < ep.classes.length; c++) {
                    classesString += ep.classes[c] + " ";
                }
                ep.classesString = classesString;
                let top = this.getItemTop(ep.itemRow);
                let style = `top:${top};`;
                ep.style = style;
                results.push(ep);
            }
            calendarData[i].events = results;
        }
        this.calendarData = calendarData;
        console.log(JSON.stringify(this.calendarData));
    }
    getItemTop(itemRow) {
        // Compute the top position of the item based on its assigned row within the given week.
        const itemTop = "1.4em";
        const r = itemRow;
        const h = "2.2em";
        const b = "2px";
        return `calc(${itemTop} + ${r}*${h} + ${r}*${b})`;
    }
    isInPast(d) {
        return this.dateOnly(d) < this.today();
    }
    today() {
        return this.dateOnly(new Date());
    }
    dayDiff(d1, d2) {
        const endDate = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()),
            startDate = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        return (endDate - startDate) / 86400000;
    }
    itemComparer(a, b) {
        if (a.startDate < b.startDate) return -1;
        if (b.startDate < a.startDate) return 1;
        if (a.endDate > b.endDate) return -1;
        if (b.endDate > a.endDate) return 1;
        return a.id < b.id ? -1 : 1;
    }
    findAndSortItemsInWeek(weekStart) {
        // Return a list of items that INCLUDE any portion of a given week.
        return this.findAndSortItemsInDateRange(
            weekStart,
            this.addDays(weekStart, 6)
        );
    }
    findAndSortItemsInDateRange(startDate, endDate) {
        let events = this.eventList;
        let eventInRangeList = [];
        let eventLength = events.length;
        for (let i = 0; i < eventLength; i++) {
            let item = events[i];
            if (
                new Date(item.endDate) >= startDate &&
                this.dateOnly(item.startDate) <= endDate
            ) {
                eventInRangeList.push(item);
            }
        }
        eventInRangeList.sort(this.itemComparer);
        return eventInRangeList;
    }
    addDays(d, days) {
        return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate() + days,
            d.getHours(),
            d.getMinutes(),
            d.getSeconds()
        );
    }
    dateOnly(d) {
        // Always use a copy, setHours mutates argument
        const d2 = new Date(d);
        d2.setHours(0, 0, 0, 0);
        return d2;
    }
    /**
     * @description highlight the tile of today
     */
    highlightToday() {
        let dateString = new Date(
            this.yearOrigin +
                "-" +
                (this.monthOrigin + 1) +
                "-" +
                this.dayOrigin
        ).toLocaleDateString();
        //to fix a funny bug.
        let tileList = this.template.querySelectorAll(".dateTile");
        for (let i = 0; i < tileList.length; i++) {
            tileList[i].style.backgroundColor = "white";
        }
        if (this.template.querySelector(`[data-datestring="${dateString}"]`)) {
            this.template.querySelector(
                `[data-datestring="${dateString}"]`
            ).style.backgroundColor = "#f0fbff";
        }
    }
    toPrevMonth() {
        this.monthNow--;
        if (this.monthNow < 0) {
            this.yearNow--;
            this.monthNow = 11;
        }
        this.generateCalendarData();
        this.arrangeEvents();
    }
    toNextMonth() {
        this.monthNow++;
        if (this.monthNow > 11) {
            this.yearNow++;
            this.monthNow = 0;
        }
        this.generateCalendarData();
        this.arrangeEvents();
    }
    toToday() {
        this.monthNow = this.monthOrigin;
        this.yearNow = this.yearOrigin;
        this.generateCalendarData();
        this.arrangeEvents();
    }
    newEvent() {
        this.tempDate = "";
        this.toShowCreateModal();
    }
    reduceOtherDayOpactiy() {
        let prevDayList = this.template.querySelectorAll(
            `[data-datestatus="prevMonth"]`
        );
        for (let i = 0; i < prevDayList.length; i++) {
            prevDayList[i].style.color = "#dfdfdf";
        }
        let nextDayList = this.template.querySelectorAll(
            `[data-datestatus="nextMonth"]`
        );
        for (let i = 0; i < nextDayList.length; i++) {
            nextDayList[i].style.color = "#dfdfdf";
        }
    }
    showToast(title, message, variant) {
        const showToastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(showToastEvent);
    }
    /**
     * @description generate the basic data to render the calendar
     */
    getBasicData() {
        this.dateNow = new Date();
        this.yearNow = this.dateNow.getFullYear();
        this.monthNow = this.dateNow.getMonth();
        this.dayNow = this.dateNow.getDate();
        this.yearOrigin = this.yearNow;
        this.monthOrigin = this.monthNow;
        this.dayOrigin = this.dayNow;
        this.actualTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    /**
     * @description get the first day of a month
     */
    getDayStart(month, year) {
        let tmpDate = new Date(year, month, 1);
        return tmpDate.getDay();
    }
    /**
     * @description get the day count of a month in consideration of the leap year.
     * @param {*} month
     * @param {*} year
     */
    getIfLeap(month, year) {
        let tmp = year % 4;
        let monthDayNumber = 0;
        if (tmp === 0) {
            monthDayNumber = this.monthLeap[month];
        } else {
            monthDayNumber = this.monthNormal[month];
        }
        return monthDayNumber;
    }
    toShowCreateModal() {
        this.showCreateModal = true;
    }
    toHideCreateModal() {
        this.showCreateModal = false;
    }
    toShowDetailModal() {
        this.showDetailModal = true;
    }
    toHideDetailModal() {
        this.showDetailModal = false;
    }
}

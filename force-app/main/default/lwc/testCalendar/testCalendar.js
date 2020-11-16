import { LightningElement, track } from "lwc";

export default class TestCalendar extends LightningElement {
    @track
    eventList;

    connectedCallback() {
        let isoDateString = new Date().toISOString().substring(0, 11);
        let isoMonthString = isoDateString.substring(0, 7);
        // this.eventList = [{
        //     dateTime: isoDateString + "07:54:00.000Z",
        //     eventInfo: "Event Info7",
        //     eventDescription: "test",
        //     eventId: "10/9/20197:54:00 PM515186"
        //   },
        //   {
        //     dateTime: isoDateString + "06:54:00.000Z",
        //     eventInfo: "Event Info6",
        //     eventDescription: "test",
        //     eventId: "10/9/20196:54:00 PM805008"
        //   },
        //   {
        //     dateTime: isoDateString + "09:54:00.000Z",
        //     eventInfo: "Event Info9",
        //     eventDescription: "test",
        //     eventId: "10/9/20199:54:00 PM723764"
        //   },
        //   {
        //     dateTime: isoDateString + "03:54:00.000Z",
        //     eventInfo: "Event Info3",
        //     eventDescription: "test",
        //     eventId: "10/9/20193:54:00 PM435214"
        //   },
        //   {
        //     dateTime: isoDateString + "02:54:00.000Z",
        //     eventInfo: "Event Info2",
        //     eventDescription: "test",
        //     eventId: "10/9/20192:54:00 PM445314"
        //   },
        //   {
        //     dateStart: isoDateString + "09:54:00.000Z",
        //     dateEnd: "2019-10-13T09:54:00.000Z",
        //     eventInfo: "testm",
        //     eventDescription: "test",
        //     eventId: "10/9/20199:54:00 PM723765"
        //   },{
        //     dateTime: isoMonthString + "-20T04:54:00.000Z",
        //     eventInfo: "Event Info4",
        //     eventDescription: "test",
        //     eventId: "10/20/20197:54:00 PM515186"
        //   },
        //   {
        //     dateTime: isoMonthString + "2019-10-20T08:54:00.000Z",
        //     eventInfo: "Event Info8",
        //     eventDescription: "test",
        //     eventId: "10/20/20196:54:00 PM805008",
        //   }];
        // this.performanceTest();
        this.eventList = [
            {
                id: "e1",
                startDate: this.thisMonth(15, 18, 30),
                endDate: this.thisMonth(15, 19, 30),
                title: "test2"
            },
            {
                id: "e2",
                startDate: this.thisMonth(15),
                endDate: this.thisMonth(15),
                title: "Single-day item with a long title"
            },
            {
                id: "e3",
                startDate: this.thisMonth(7, 9, 25),
                endDate: this.thisMonth(10, 16, 30),
                title: "Multi-day item with a long title and times"
            },
            {
                id: "e4",
                startDate: this.thisMonth(20),
                endDate: this.thisMonth(20),
                title: "My Birthday!",
                classes: "birthday",
                url: "https://en.wikipedia.org/wiki/Birthday"
            },
            {
                id: "e5",
                startDate: this.thisMonth(5),
                endDate: this.thisMonth(12),
                title: "Multi-day item",
                classes: "purple"
            },
            {
                id: "foo",
                startDate: this.thisMonth(29),
                endDate: this.thisMonth(29),
                title: "Same day 1"
            },
            {
                id: "e6",
                startDate: this.thisMonth(29),
                endDate: this.thisMonth(29),
                title: "Same day 2",
                classes: "orange"
            },
            {
                id: "foo",
                startDate: this.thisMonth(29),
                endDate: this.thisMonth(29),
                title: "Same day 1"
            },
            {
                id: "e6",
                startDate: this.thisMonth(29),
                endDate: this.thisMonth(29),
                title: "Same day 2",
                classes: "orange"
            },
            {
                id: "foo",
                startDate: this.thisMonth(29),
                endDate: this.thisMonth(29),
                title: "Same day 1"
            },
            {
                id: "e6",
                startDate: this.thisMonth(29),
                endDate: this.thisMonth(29),
                title: "Same day 2",
                classes: "orange"
            }
        ];
    }
    thisMonth(d, h, m) {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0);
    }
    performanceTest() {
        for (let k = 0; k < 5; k++) {
            for (let i = 1; i < 10; i++) {
                this.eventList.push(
                    {
                        dateTime: "2019-10-0" + i + "T07:54:00.000Z",
                        eventInfo: "Event Info"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T06:54:00.000Z",
                        eventInfo: "Event Info1"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T09:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T03:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T05:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T04:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T02:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T12:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T11:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T22:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T19:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T19:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T15:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-0" + i + "T03:54:00.000Z",
                        eventInfo: "Event Info2"
                    }
                );
            }
            for (let i = 10; i <= 31; i++) {
                this.eventList.push(
                    {
                        dateTime: "2019-10-" + i + "T07:54:00.000Z",
                        eventInfo: "Event Info"
                    },
                    {
                        dateTime: "2019-10-" + i + "T06:54:00.000Z",
                        eventInfo: "Event Info1"
                    },
                    {
                        dateTime: "2019-10-" + i + "T09:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T12:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T01:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T08:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T04:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T07:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T03:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T14:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T13:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T17:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T20:54:00.000Z",
                        eventInfo: "Event Info2"
                    },
                    {
                        dateTime: "2019-10-" + i + "T21:54:00.000Z",
                        eventInfo: "Event Info2"
                    }
                );
            }
        }
    }
    newEventHandler(evt) {
        console.log("get");
        console.log(evt.detail.id);
        console.log(evt.detail.startDate);
        console.log(evt.detail.endDate);
        console.log(evt.detail.title);
        console.log(evt.detail.description);

    
    }
    
    getEventListHandler(evt) {
        // console.log("getCall");
        // console.log(evt.detail.yearNow);
        // console.log(evt.detail.monthNow);
        let eventList = this.eventList;

        // for (let i = 0; i < 1; i++) {

        // }
        // this.template.querySelector("c-calendar2").renderEvent(eventList);
    }
    deleteEventHandler(evt) {
        console.log("get delete event");
        // let eventId = evt.detail.eventId;
        // console.log(evt.detail.eventId);
        // let result = true;
        // for (let x = 0; x < this.eventList.length; x++) {
        //     if (this.eventList[x].eventId === evt.detail.eventId) {
        //         this.eventList.splice(x, 1);
        //     }
        // }
        // this.template.querySelector("c-calendar2").deleteEvent(result);
    }
    editEventHandler(evt) {
        console.log("get edit event");
    }
}

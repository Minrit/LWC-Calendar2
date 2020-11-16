# LWC Calendar

## Overview
This is a LWC calendar component implementation without any third-party JS library. Some of the logic of the events is referenced to [vue simple calendar](https://github.com/richardtallent/vue-simple-calendar).

## Feature
1. Month view.
2. Creating event.
3. Editing event.
4. Support multi-day event.
5. Lightning design system style.
6. No third-party JS Library.

## How to use

A simple demo can be found in this component:"testCalendar"
```
<c-calendar2
      ongeteventlist={getEventListHandler}
      ondeleteevent={deleteEventHandler}
      oneditevent={editEventHandler}
      onnewevent={newEventHandler}
      origin-event-list={eventList}
    ></c-calendar2>
```

### Custom events

* `geteventlist` Get the event list of the calendar.
* `deleteevent` Triggered when an event is deleted.
* `editevent` Triggered when an event is edited.
* `newevent` Triggered when an new event is created.

### API
* `origin-event-list` For parent component to pass the origin event list.

### Event Format
```
{
                id: <id:String>,
                startDate: <startDate:Date>,
                endDate: <endDate:Date>,
                title: <title:String>,
                description:<description:String>
}

```



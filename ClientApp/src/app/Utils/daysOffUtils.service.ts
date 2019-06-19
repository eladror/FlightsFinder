import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class DaysOffUtilsService {
    getDatesToSerach(dateRange: DateRange, wantedDaysOff, uncountedDays: Day[]): DateRange[] {
        const dateRanges: DateRange[] = [];

        const currentRange: DateRange = { begin: dateRange.begin, end: dateRange.begin };
        let currentDate = dateRange.begin;

        while (currentDate <= dateRange.end) {
            let daysOffNum = 0;
            if (this.isDayOff(currentDate, uncountedDays)) {
                daysOffNum++;
            }

            currentRange.begin = currentDate;

            while (daysOffNum <= wantedDaysOff && currentDate <= dateRange.end) {
                const nextDay = this.addDays(currentDate, 1);
                if (this.isDayOff(nextDay, uncountedDays)) {
                    if (daysOffNum < wantedDaysOff) {
                        currentDate = nextDay;
                    }

                    daysOffNum++;
                } else {
                    currentDate = nextDay;
                }
            }

            currentRange.end = currentDate;
            dateRanges.push({ begin: currentRange.begin, end: currentRange.end });
        }
        return dateRanges;
    }

    isDayOff(day: Date, uncounedDates: Day[]): boolean {
        const weekDayName = this.getDayName(day);

        const dayInUncounedDates = uncounedDates.find((d: Day) => {
            return d.name === weekDayName;
        });

        return !dayInUncounedDates.isFreeDay;
    }

    getDayName(date: Date): string {
        const weekDays = [weekDay.sunday, weekDay.monday, weekDay.tuesday,
        weekDay.wednesday, weekDay.thursday, weekDay.friday, weekDay.saturday];

        return weekDays[date.getDay()];
    }

    private addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}

export interface DateRange { begin: Date; end: Date; }

export interface Day { name: weekDay; isFreeDay: boolean; }

export enum weekDay {
    sunday = 'sunday',
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday'
}


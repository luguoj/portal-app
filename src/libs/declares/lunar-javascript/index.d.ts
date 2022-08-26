declare module 'lunar-javascript' {
    class Lunar {
        static fromDate(date: Date): Lunar

        getYear(): string

        getMonth(): string

        getDay(): string

        getYearInChinese(): string

        getMonthInChinese(): string

        getDayInChinese(): string

        getWeekInChinese(): string
    }

    export {Lunar}
}
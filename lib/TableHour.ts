export default class TableLesson {
  public number: number;

  public timeFrom: string;

  public timeTo: string;

  public constructor(number: number, timeFrom: string, timeTo: string) {
    this.number = number;
    this.timeFrom = timeFrom;
    this.timeTo = timeTo;
  }
}

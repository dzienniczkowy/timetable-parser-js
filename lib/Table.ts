import * as cheerio from 'cheerio';
import TableHour from './TableHour';

export default class Table {
  public $: CheerioStatic;

  public constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  public getDayNames(): string[] {
    return this.$('.tabela tr:first-of-type th').toArray()
      .map((element: CheerioElement): string => this.$(element).text())
      .slice(2);
  }

  public getHours(): Record<number, TableHour> {
    const rows = this.$('.tabela tr:not(:first-of-type)').toArray();
    const hours: Record<number, TableHour> = {};
    rows.forEach((row: CheerioElement): void => {
      const number = parseInt(this.$(row).find('.nr').text().trim(), 10);
      const timesText = this.$(row).find('.g').text();
      let [timeFrom, timeTo] = timesText.split('-');
      timeFrom = timeFrom.trim();
      timeTo = timeTo.trim();
      hours[number] = new TableHour(number, timeFrom, timeTo);
    });
    return hours;
  }

  public getDays(): Record<string, string>[][][] {
    const rows = this.$('.tabela tr:not(:first-of-type)').toArray();

    const days: Record<string, string>[][][] = [
      [],
      [],
      [],
      [],
      [],
    ];

    rows.forEach((row): void => {
      const lessons = this.$(row).find('.l').toArray();
      lessons.forEach((lesson, index): void => {
        if (this.$(lesson).children().length === 0) {
          days[index].push([]);
        } else {
          let groups: Record<string, string>[] = [{}];
          let groupNumber = 0;
          let commaSeperated = false;
          this.$(lesson).contents().toArray().forEach((element): void => {
            if (element.tagName === 'br') {
              groupNumber += 1;
              groups[groupNumber] = {};
            } else if (/,/.test(this.$(element).text())) {
              const groupNameMatch = this.$(element).text().match(/-\d{1,}\/\d{1,}/);

              if (groupNameMatch) {
                groups[groupNumber].groupName = groupNameMatch[0].substr(1);
              }

              groupNumber += 1;
              groups[groupNumber] = {};
              commaSeperated = true;

              if (groups[groupNumber - 1].teacher) {
                groups[groupNumber].teacher = groups[groupNumber - 1].teacher;
              }

              if (groups[groupNumber - 1].subject) {
                groups[groupNumber].subject = groups[groupNumber - 1].subject;
              }
            } else {
              const groupNameMatch = this.$(element).text().match(/-\d{1,}\/\d{1,}/);

              if (groupNameMatch) {
                groups[groupNumber].groupName = groupNameMatch[0].substr(1);
              }

              if (this.$(element).hasClass('p')) {
                if (!groups[groupNumber].subject) {
                  groups[groupNumber].subject = this.$(element).text().replace(/-\d{1,}\/\d{1,}/, '');
                } else {
                  groups[groupNumber].subject += ' ';
                  groups[groupNumber].subject += this.$(element).text().replace(/-\d{1,}\/\d{1,}/, '');
                }
              }

              if (this.$(element).find('.p').length !== 0) {
                if (!groups[groupNumber].subject) {
                  groups[groupNumber].subject = this.$(element).find('.p').text().replace(/-\d{1,}\/\d{1,}/, '');
                } else {
                  groups[groupNumber].subject += ' ';
                  groups[groupNumber].subject += this.$(element).find('.p').text().replace(/-\d{1,}\/\d{1,}/, '');
                }
              }

              if (this.$(element).hasClass('n')) {
                groups[groupNumber].teacher = this.$(element).text();
              }

              if (this.$(element).find('.n').length !== 0) {
                groups[groupNumber].teacher = this.$(element).find('.n').text();
              }

              if (this.$(element).hasClass('o')) {
                groups[groupNumber].className = this.$(element).text();
              }

              if (this.$(element).find('.o').length !== 0) {
                groups[groupNumber].className = this.$(element).find('.o').text();
              }

              if (this.$(element).hasClass('s')) {
                groups[groupNumber].room = this.$(element).text();
              }

              if (this.$(element).find('.s').length !== 0) {
                groups[groupNumber].room = this.$(element).find('.s').text();
              }

              if (commaSeperated) {
                groups.slice(0, groups.length - 1).forEach((group, groupIndex): void => {
                  if (!groups[groupIndex].teacher && groups[groupNumber].teacher) {
                    groups[groupIndex].teacher = groups[groupNumber].teacher;
                  }

                  if (!groups[groupIndex].subject && groups[groupNumber].subject) {
                    groups[groupIndex].subject = groups[groupNumber].subject;
                  }
                });
              }
            }
          });

          groups = groups.filter(
            (group): boolean => (Object.getOwnPropertyNames(group).length !== 0),
          );

          days[index].push(groups);
        }
      });
    });

    return days;
  }
}

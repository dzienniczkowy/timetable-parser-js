import * as cheerio from 'cheerio';
import { TableHour, TableLesson } from './types';

export default class Table {
  public $: CheerioStatic;

  public constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  /*
   * Parses the text from the header, for instance class name
   */
  public getTitle(): string {
    return this.$('.tytulnapis').text();
  }

  public getDayNames(): string[] {
    return this.$('.tabela tr:first-of-type th')
      .toArray()
      .map((element: CheerioElement): string => this.$(element).text())
      .slice(2);
  }

  public getHours(): Record<number, TableHour> {
    const rows = this.$('.tabela tr:not(:first-of-type)').toArray();
    const hours: Record<number, TableHour> = {};
    rows.forEach((row: CheerioElement): void => {
      const number = parseInt(this.$(row).find('.nr').text().trim(), 10);
      const timesText = this.$(row).find('.g').text();
      const [timeFrom, timeTo] = timesText
        .split('-')
        .map((e): string => e.trim());
      hours[number] = {
        number,
        timeFrom,
        timeTo,
      };
    });
    return hours;
  }

  /*
  * Return table in original form (without transposing) for easier displaying.
  */
  public getRawDays(): TableLesson[][][] {
    const rows = this.$('.tabela tr:not(:first-of-type)').toArray();

    const days: TableLesson[][][] = [];

    rows.forEach((row, index): void => {
      const lessons = this.$(row).find('.l').toArray();
      lessons.forEach((lesson): void => {
        if (!days[index]) days.push([]);
        if (this.$(lesson).children().length === 0) {
          days[index].push([]);
        } else {
          const groups = this.parseLessons(this.$(lesson).contents().toArray());
          days[index].push(groups);
        }
      });
    });

    return days;
  }


  public getDays(): TableLesson[][][] {
    const rows = this.$('.tabela tr:not(:first-of-type)').toArray();

    const days: TableLesson[][][] = [
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
          const groups = this.parseLessons(this.$(lesson).contents().toArray());
          days[index].push(groups);
        }
      });
    });

    return days;
  }

  private parseLessons(data: CheerioElement[]): TableLesson[] {
    let groups: Partial<TableLesson>[] = [{}];
    let groupNumber = 0;
    let commaSeparated = false;


    data.forEach((element): void => {
      if (element.tagName === 'br') {
        groupNumber += 1;
        groups[groupNumber] = {};
      } else if (/,/.test(this.$(element).text())) {
        const groupNameMatch = this.$(element).text().match(/-\d+\/\d+/);

        if (groupNameMatch) {
          groups[groupNumber].groupName = groupNameMatch[0].substr(1);
        }

        groupNumber += 1;
        groups[groupNumber] = {};
        commaSeparated = true;

        if (groups[groupNumber - 1].teacher) {
          groups[groupNumber].teacher = groups[groupNumber - 1].teacher;
        }

        if (groups[groupNumber - 1].subject) {
          groups[groupNumber].subject = groups[groupNumber - 1].subject;
        }
      } else {
        const groupNameMatch = this.$(element).text().match(/-\d+\/\d+/);

        if (groupNameMatch) {
          groups[groupNumber].groupName = groupNameMatch[0].substr(1);
        }

        if (this.$(element).hasClass('p')) {
          if (!groups[groupNumber].subject) {
            groups[groupNumber].subject = this.$(element).text().replace(/-\d+\/\d+/, '');
          } else {
            groups[groupNumber].subject += ' ';
            groups[groupNumber].subject += this.$(element).text().replace(/-\d+\/\d+/, '');
          }
        }

        if (this.$(element).find('.p').length !== 0) {
          if (!groups[groupNumber].subject) {
            groups[groupNumber].subject = this.$(element).find('.p').text().replace(/-\d+\/\d+/, '');
          } else {
            groups[groupNumber].subject += ' ';
            groups[groupNumber].subject += this.$(element).find('.p').text().replace(/-\d+\/\d+/, '');
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

        if (commaSeparated) {
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

    return groups as TableLesson[];
  }
}

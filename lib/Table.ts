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

  /*
    Date in ISO 8601 format
   */
  public getGeneratedDate(): string | null {
    const regex = /wygenerowano (\d{1,4})[./-](\d{1,2})[./-](\d{1,4})/;
    return this.$('td')
      .toArray()
      .map((e): string | null => {
        const match = regex.exec(this.$(e).text());
        if (match === null) return null;
        const parts = [match[1], match[2], match[3]];
        if (parts[0].length !== 4) parts.reverse();
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      })
      .filter((e): boolean => e != null)[0] || null;
  }

  /*
    Usually includes the dates when the table is valid.
   */
  public getVersionInfo(): string {
    const regex = /^Obowiązuje od: (.+)$/;
    return this.$('td')
      .toArray()
      .map((e): string | null => {
        const match = regex.exec(this.$(e).text().trim());
        if (match === null) return '';
        return match[1].trim();
      })
      .filter((e): boolean => e !== '')[0] || '';
  }

  private parseLessons(data: CheerioElement[]): TableLesson[] {
    let groups: Partial<TableLesson>[] = [{}];
    let groupNumber = 0;
    let commaSeparated = false;


    data.forEach((element): void => {
      if (element.tagName === 'br') {
        groupNumber += 1;
        groups[groupNumber] = {};
      } else {
        const el = this.$(element);
        if (/,/.test(el.text())) {
          const groupNameMatch = el.text().match(/-\d+\/\d+/);

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
          const groupNameMatch = el.text().match(/-\d+\/\d+/);

          if (groupNameMatch) {
            groups[groupNumber].groupName = groupNameMatch[0].substr(1);
          }
          const withElement = (className: string, callback: (child: Cheerio) => void): void => {
            if (el.hasClass(className)) return callback(el);
            const children = el.find(`.${className}`);
            if (children.length > 0) callback(children);
          };

          withElement('p', (child): void => {
            if (!groups[groupNumber].subject) groups[groupNumber].subject = '';
            else groups[groupNumber].subject += ' ';
            groups[groupNumber].subject += child.text().replace(/-\d+\/\d+/, '');
          });

          withElement('n', (child): void => {
            groups[groupNumber].teacher = child.text();
          });

          withElement('o', (child): void => {
            groups[groupNumber].className = child.text();
          });

          withElement('s', (child): void => {
            groups[groupNumber].room = child.text();
          });

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
      }
    });

    groups = groups.filter(
      (group): boolean => (Object.getOwnPropertyNames(group).length !== 0),
    );

    return groups as TableLesson[];
  }
}

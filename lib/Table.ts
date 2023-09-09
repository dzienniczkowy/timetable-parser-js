import {
  AnyNode, Cheerio, CheerioAPI, Element, load,
} from 'cheerio';
import { TableHour, TableLesson } from './types';

export default class Table {
  public $: CheerioAPI;

  public constructor(html: string) {
    this.$ = load(html);
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
      .map((element: Element): string => this.$(element).text())
      .slice(2);
  }

  public getHours(): Record<number, TableHour> {
    const rows = this.$('.tabela tr:not(:first-of-type)');
    const hours: Record<number, TableHour> = {};
    rows.each((_, row): void => {
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
        if (this.$(lesson).text().trim() === '') {
          days[index].push([]);
        } else if (this.$(lesson).children().length === 0) {
          days[index].push([{ subject: this.$(lesson).text().trim() }]);
        } else {
          const groups = this.parseLessons(this.$(lesson).contents());
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
      this.$(row)
        .find('.l')
        .each((index, lesson): void => {
          if (this.$(lesson).text().trim() === '') {
            days[index].push([]);
          } else if (this.$(lesson).children().length === 0) {
            days[index].push([{ subject: this.$(lesson).text().trim() }]);
          } else {
            const groups = this.parseLessons(this.$(lesson).contents());
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

  private static getId(el: Cheerio<AnyNode>, letter: string): string | undefined {
    const href = el.attr('href') || '';
    return new RegExp(`^${letter}(.+)\\.html$`).exec(href)?.[1];
  }

  private parseLessons(nodes: Cheerio<AnyNode>): TableLesson[] {
    const lines: Cheerio<AnyNode>[][] = [[]];

    nodes.each((_, node) => {
      if ('tagName' in node && node.tagName === 'br') {
        lines.push([]);
        return;
      }
      lines[lines.length - 1].push(this.$(node));
    });

    return lines.flatMap((line): TableLesson[] => {
      const common: Pick<TableLesson, 'teacher' | 'teacherId' | 'room' | 'roomId' | 'subject'> = { subject: '' };
      const groups: Partial<Omit<TableLesson, keyof typeof common>>[] = [{}];
      line.forEach((el) => {
        if (el[0].type === 'text') {
          el.text().split(',').forEach((part, index) => {
            if (index > 0) groups.push({});
            if (part.trim() === '') return;
            const groupNameMatch = part.trim().match(/-(\d+\/\d+)/);
            if (groupNameMatch !== null) groups[groups.length - 1].groupName = groupNameMatch[1];
          });
          return;
        }

        const group = groups[groups.length - 1];

        const withElement = (
          className: string,
          callback: (child: Cheerio<AnyNode>) => void,
        ) => {
          if (el.hasClass(className)) {
            callback(el);
            return;
          }
          const children = el.find(`.${className}`);
          if (children.length > 0) callback(children);
        };

        withElement('p', (child): void => {
          const match = child.text().trim().match(/^(.*?)(?:-(\d+\/\d+))?$/);
          if (!match) return;
          if (match[2]) group.groupName = match[2];
          if (match[1]) {
            if (common.subject) common.subject += ' ';
            common.subject += match[1].trim();
          }
        });

        withElement('o', (child): void => {
          group.className = child.text();
          group.classId = Table.getId(child, 'o');
        });

        withElement('n', (child): void => {
          common.teacher = child.text();
          common.teacherId = Table.getId(child, 'n');
        });

        withElement('s', (child): void => {
          common.room = child.text();
          common.roomId = Table.getId(child, 's');
        });
      });
      if (common.subject.trim() === '') return [];
      return groups.map((group) => ({
        ...common,
        ...group,
      }));
    });
  }
}

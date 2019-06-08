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
          // const day: Record<string, string> = {};
          // const subject = this.$(lesson).find('.p').text();
          // const teacher = this.$(lesson).find('.n').text();
          // const className = this.$(lesson).find('.o').text();
          // const room = this.$(lesson).find('.s').text();
          // if (subject) day.subject = subject;
          // if (teacher) day.teacher = teacher;
          // if (className) day.className = className;
          // if (room) day.room = room;
          // days[index].push(day);
        }
      });
    });

    return days;
  }

  // public getTable(): Object {
  //   const table = this.$('.tabela').first();
  //   const days = this.getDays(table.find('tr th'));
  //   this.setLessonHoursToDays(table, days);
  //   const title = this.$('title').text().split(' ');
  //   const generated = this.$('td[align=right]').end().text().trim()
  //     .split(/\s+/);
  //   return {
  //     name: this.$('.tytulnapis').text(),
  //     generated: generated[1].trim(),
  //     description: this.$('td[align=left]').first().text().trim(),
  //     typeName: title[2],
  //     days,
  //   };
  // }

  // private getDays(headerCells: Cheerio): Record<string, any>[] {
  //   const headerCellsArray = headerCells.toArray();
  //   headerCellsArray.shift();
  //   headerCellsArray.shift();
  //   const days: Record<string, any>[] = [];
  //   headerCellsArray.forEach((cell): void => {
  //     days.push({
  //       name: this.$(cell).text(),
  //     });
  //   });
  //   return days;
  // }

  // private setLessonHoursToDays(table: Cheerio, days: Record<string, any>[]): void {
  //   const rows = table.find('tr').toArray();
  //   rows.shift();
  //   rows.forEach((row): void => {
  //     const rowCells = this.$(row).find('td');
  //     // fill hours in day
  //     for (let i = 2; i < rowCells.length; i++) {
  //       days[i - 2].hours.push(this.getHourWithLessons(rowCells, i));
  //     }
  //   });
  // }

  // private getHourWithLessons(rowCells: Cheerio, index: number): Object {
  //   const hours = this.$(rowCells.get(1)).text().split('-');
  //   return {
  //     number: this.$(rowCells.get(0)).text(),
  //     start: hours[0].trim(),
  //     end: hours[1].trim(),
  //     lessons: this.getExtractedLessons(rowCells.get(index)),
  //   };
  // }

  // private getExtractedLessons(current: Cheerio): Array<any> {
  //   const lessons = [];
  //   const chunks = this.$.html(current).split('<br>');
  //   const spans = current.find('span[style]').toArray();
  //   const subject = current.find('.p');
  //   if (spans.length > 0 && subject.length === 0) {
  //     spans.forEach((group): void => {
  //       lessons.push(...this.getLesson(group, true));
  //     });
  //   } else if (chunks.length > 0 && subject.length > 0) {
  //     chunks.forEach((item): void => {
  //       this.setLessonFromChunk(lessons, item);
  //     });
  //   }
  //   this.updateLessonWithMultipleClasses(current, lessons);
  //   this.setFallbackLesson(current, lessons);
  //   return lessons;
  // }

  // private getLesson(cell: CheerioElement, diversion: boolean = false): array {
  //   const subject = this.$(cell).find('.p');
  //   const lesson = {
  //     teacher: this.getLessonPartValues(this.$(cell).find('.n'), 'n'),
  //     room: this.getLessonPartValues(this.$(cell).find('.s'), 's'),
  //     className: this.getLessonPartValues(this.$(cell).find('.o'), 'o'),
  //     subject: subject.text(),
  //     diversion: diversion,
  //     alt: trim(cell->findXPath('./text()')->text()),
  //     substitution: cell->find('.zas')->text(),
  //   };
  //   $subjects = cell->findXPath('./*[@class="p"]');
  //   if ($subjects->count() > 1) {
  //       $textBetweenSubject = cell->findXPath('./text()[(preceding::*[@class="p"])]');
  //       if (trim($textBetweenSubject->text()) !== '') {
  //         lesson['subject'] = subject->first()->text()
  //          .trim($textBetweenSubject->text()).' '.$subject->end()->text();
  //       } else {
  //           unset(lesson['subject']);
  //           foreach ($subjects as $subject) {
  //               lesson['subject'][] = subject->text();
  //           }
  //       }
  //   }
  //   return lesson;
  // }
}

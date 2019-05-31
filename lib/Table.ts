import * as cheerio from 'cheerio';

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

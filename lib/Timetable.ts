import * as cheerio from 'cheerio';

export default class Timetable {
  public $: CheerioStatic;

  public constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  public getTitle(): string {
    return this.$('title').text();
  }

  public getListPath(): string {
    return this.$('frame[name="list"]').attr('src');
  }
}

import { CheerioAPI, load } from 'cheerio';

export default class Timetable {
  public $: CheerioAPI;

  public constructor(html: string) {
    this.$ = load(html);
  }

  public getTitle(): string {
    return this.$('title').text();
  }

  public getListPath(): string {
    return this.$('frame[name="list"]').attr('src') || '';
  }
}

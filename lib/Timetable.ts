import { load } from 'cheerio';

export default class Timetable {
  public $: cheerio.Root;

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

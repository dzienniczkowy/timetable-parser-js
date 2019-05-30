import * as cheerio from 'cheerio';

export default class TimetableList {
  public $: CheerioStatic;

  public constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  public getListType(): string {
    if (this.$('form[name=form]').length > 0) {
      return 'select';
    }

    if (this.$('body table').length > 0) {
      return 'expandable';
    }

    return 'unordered';
  }
}

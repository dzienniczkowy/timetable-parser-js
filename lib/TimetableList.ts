import * as cheerio from 'cheerio';

export default class TimetableList {
  public $: CheerioStatic;

  constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  getListType() {
    if (this.$('form[name=form]').length > 0) {
      return 'form';
    }

    if (this.$('body table').length > 0) {
      return 'expandable';
    }

    return 'unordered';
  }
}

import * as cheerio from 'cheerio';

export default class TimetableList {
  public $: CheerioStatic;

  public constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  public getList(): Record<string, Record<string, string>[]> {
    if (this.getListType() === 'select') {
      return this.getSelectList();
    }

    throw new Error('List type not suported');
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

  private getSelectList(): Record<string, Record<string, string>[]> {
    return {
      classes: this.getSelectListValues('oddzialy'),
      teachers: this.getSelectListValues('nauczyciele'),
      rooms: this.getSelectListValues('sale'),
    };
  }

  private getSelectListValues(name: string): Record<string, string>[] {
    const nodes = this.$(`[name=${name}] option`).toArray();
    nodes.shift();

    const values: Record<string, string>[] = [];
    nodes.forEach((node): void => {
      values.push({
        name: this.$(node).text(),
        value: node.attribs.value,
      });
    });

    return values;
  }
}

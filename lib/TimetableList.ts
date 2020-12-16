import * as cheerio from 'cheerio';
import { List, ListItem } from './types';

export default class TimetableList {
  public $: CheerioStatic;

  public constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  public getList(): List {
    if (this.getListType() === 'select') {
      return this.getSelectList();
    } if (this.getListType() === 'unordered') {
      return this.getUnorderedList();
    }

    return this.getExpandableList();
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

  private getSelectList(): List {
    return {
      classes: this.getSelectListValues('oddzialy'),
      teachers: this.getSelectListValues('nauczyciele'),
      rooms: this.getSelectListValues('sale'),
    };
  }

  private getSelectListValues(name: string): ListItem[] {
    const nodes = this.$(`[name=${name}] option`).toArray();
    nodes.shift();

    const values: ListItem[] = [];
    nodes.forEach((node): void => {
      values.push({
        name: this.$(node).text(),
        value: this.$(node).attr('value'),
      });
    });

    return values;
  }

  private getExpandableList(): List {
    return this.getTimetableUrlSubType(
      '#oddzialy a',
      '#nauczyciele a',
      '#sale a',
    );
  }

  private getUnorderedList(): List {
    let teachersQuery = 'ul:nth-of-type(2) a';
    let roomsQuery = 'ul:nth-of-type(3) a';
    if (this.$('h4').length === 1) {
      teachersQuery = 'undefined';
      roomsQuery = 'undefined';
    } else if (this.$('h4:nth-of-type(2)').text() === 'Sale') {
      teachersQuery = 'undefined';
      roomsQuery = 'ul:nth-of-type(2) a';
    }
    return this.getTimetableUrlSubType(
      'ul:first-of-type a',
      teachersQuery,
      roomsQuery,
    );
  }

  private getTimetableUrlSubType(
    classQuery: string,
    teachersQuery: string,
    roomsQuery: string,
  ): List {
    return {
      classes: this.getSubTypeValue(classQuery, 'o'),
      teachers: this.getSubTypeValue(teachersQuery, 'n'),
      rooms: this.getSubTypeValue(roomsQuery, 's'),
    };
  }

  private getSubTypeValue(query: string, prefix: string): ListItem[] {
    const values: ListItem[] = [];

    const nodes = this.$(query).toArray();
    nodes.forEach((node: CheerioElement): void => {
      values.push({
        name: this.$(node).text(),
        value: this.$(node).attr('href').replace('.html', '').replace(`plany/${prefix}`, ''),
      });
    });

    return values;
  }
}

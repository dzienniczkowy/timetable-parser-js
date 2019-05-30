import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { TimetableList } from '../lib/index';

describe('List test', (): void => {
  describe('Expandable list', (): void => {
    const expandableListFilename = path.join(__dirname, 'fixtures', 'lista-expandable.html');
    const expandableListHTML = fs.readFileSync(expandableListFilename, {
      encoding: 'utf8',
    });

    let list: TimetableList;

    it('Cheerio init', (): void => {
      expect((): void => { list = new TimetableList(expandableListHTML); }).not.to.throw();
    });

    it('List type check', (): void => {
      expect(list.getListType()).to.equal('expandable');
    });
  });

  describe('Select list', (): void => {
    const selectListFilename = path.join(__dirname, 'fixtures', 'lista-select.html');
    const selectListHTML = fs.readFileSync(selectListFilename, {
      encoding: 'utf8',
    });

    let list: TimetableList;

    it('Cheerio init', (): void => {
      expect((): void => { list = new TimetableList(selectListHTML); }).not.to.throw();
    });

    it('List type check', (): void => {
      expect(list.getListType()).to.equal('select');
    });
  });

  describe('Unordered list', (): void => {
    const unorderedListFilename = path.join(__dirname, 'fixtures', 'lista-unordered.html');
    const unorderedListHTML = fs.readFileSync(unorderedListFilename, {
      encoding: 'utf8',
    });

    let list: TimetableList;

    it('Cheerio init', (): void => {
      expect((): void => { list = new TimetableList(unorderedListHTML); }).not.to.throw();
    });

    it('List type check', (): void => {
      expect(list.getListType()).to.equal('unordered');
    });
  });
});

import { TimetableList } from '../lib/index';

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('List test', () => {
  describe('Expandable list', () => {
    const expandableListFilename = path.join(__dirname, 'fixtures', 'lista-expandable.html');
    const expandableListHTML = fs.readFileSync(expandableListFilename, {
      encoding: 'utf8',
    });

    let list: TimetableList;

    it('Cheerio init', () => {
      expect(() => { list = new TimetableList(expandableListHTML); }).not.to.throw();
    });

    it('List type check', () => {
      expect(list.getListType()).to.equal('expandable');
    });
  });

  describe('Form list', () => {
    const formListFilename = path.join(__dirname, 'fixtures', 'lista-form.html');
    const formListHTML = fs.readFileSync(formListFilename, {
      encoding: 'utf8',
    });

    let list: TimetableList;

    it('Cheerio init', () => {
      expect(() => { list = new TimetableList(formListHTML); }).not.to.throw();
    });

    it('List type check', () => {
      expect(list.getListType()).to.equal('form');
    });
  });

  describe('Unordered list', () => {
    const unorderedListFilename = path.join(__dirname, 'fixtures', 'lista-unordered.html');
    const unorderedListHTML = fs.readFileSync(unorderedListFilename, {
      encoding: 'utf8',
    });

    let list: TimetableList;

    it('Cheerio init', () => {
      expect(() => { list = new TimetableList(unorderedListHTML); }).not.to.throw();
    });

    it('List type check', () => {
      expect(list.getListType()).to.equal('unordered');
    });
  });
});

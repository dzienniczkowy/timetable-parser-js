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

    const list: TimetableList = new TimetableList(expandableListHTML);

    it('Cheerio init', (): void => {
      expect((): TimetableList => new TimetableList(expandableListHTML)).not.to.throw();
    });

    it('List type check', (): void => {
      expect(list.getListType()).to.equal('expandable');
    });

    it('Return value check', (): void => {
      const nodesList = list.getList();
      expect(nodesList.classes[0].name).to.equal('1Tc');
      expect(nodesList.classes[0].value).to.equal('1');
      expect(nodesList.classes[1].name).to.equal('1Ti');
      expect(nodesList.classes[1].value).to.equal('2');
      expect(nodesList.teachers[0].name).to.equal('I.Ochocki (Io)');
      expect(nodesList.teachers[0].value).to.equal('1');
      expect(nodesList.teachers[1].name).to.equal('M.Oleszkiewicz (Mo)');
      expect(nodesList.teachers[1].value).to.equal('3');
      expect(nodesList.rooms[0].name).to.equal('16 prac. geograficzna');
      expect(nodesList.rooms[0].value).to.equal('1');
      expect(nodesList.rooms[1].name).to.equal('17 prac. fizyczna');
      expect(nodesList.rooms[1].value).to.equal('2');
    });
  });

  describe('Select list', (): void => {
    const selectListFilename = path.join(__dirname, 'fixtures', 'lista-select.html');
    const selectListHTML = fs.readFileSync(selectListFilename, {
      encoding: 'utf8',
    });

    const list: TimetableList = new TimetableList(selectListHTML);

    it('Cheerio init', (): void => {
      expect((): TimetableList => new TimetableList(selectListHTML)).not.to.throw();
    });

    it('List type check', (): void => {
      expect(list.getListType()).to.equal('select');
    });

    it('Return value check', (): void => {
      const nodesList = list.getList();
      expect(nodesList.classes[0].name).to.equal('1Tc');
      expect(nodesList.classes[0].value).to.equal('1');
      expect(nodesList.classes[1].name).to.equal('1Ti');
      expect(nodesList.classes[1].value).to.equal('2');
      expect(nodesList.teachers[0].name).to.equal('I.Ochocki (Io)');
      expect(nodesList.teachers[0].value).to.equal('1');
      expect(nodesList.teachers[1].name).to.equal('M.Oleszkiewicz (Mo)');
      expect(nodesList.teachers[1].value).to.equal('3');
      expect(nodesList.rooms[0].name).to.equal('16 prac. geograficzna');
      expect(nodesList.rooms[0].value).to.equal('1');
      expect(nodesList.rooms[1].name).to.equal('17 prac. fizyczna');
      expect(nodesList.rooms[1].value).to.equal('2');
    });
  });

  describe('Unordered list', (): void => {
    const unorderedListFilename = path.join(__dirname, 'fixtures', 'lista-unordered.html');
    const unorderedListHTML = fs.readFileSync(unorderedListFilename, {
      encoding: 'utf8',
    });

    const list: TimetableList = new TimetableList(unorderedListHTML);

    it('Cheerio init', (): void => {
      expect((): TimetableList => new TimetableList(unorderedListHTML)).not.to.throw();
    });

    it('List type check', (): void => {
      expect(list.getListType()).to.equal('unordered');
    });

    it('Return value check', (): void => {
      const nodesList = list.getList();
      expect(nodesList.classes[0].name).to.equal('1Tc');
      expect(nodesList.classes[0].value).to.equal('1');
      expect(nodesList.classes[1].name).to.equal('1Ti');
      expect(nodesList.classes[1].value).to.equal('2');
      expect(nodesList.teachers[0].name).to.equal('I.Ochocki (Io)');
      expect(nodesList.teachers[0].value).to.equal('1');
      expect(nodesList.teachers[1].name).to.equal('M.Oleszkiewicz (Mo)');
      expect(nodesList.teachers[1].value).to.equal('3');
      expect(nodesList.rooms[0].name).to.equal('16 prac. geograficzna');
      expect(nodesList.rooms[0].value).to.equal('1');
      expect(nodesList.rooms[1].name).to.equal('17 prac. fizyczna');
      expect(nodesList.rooms[1].value).to.equal('2');
    });
  });
});

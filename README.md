[![license](https://img.shields.io/github/license/wulkanowy/timetable-parser-js?logo=github&style=for-the-badge)](https://github.com/wulkanowy/timetable-parser-js)
[![stars](https://img.shields.io/github/stars/wulkanowy/timetable-parser-js?logo=github&style=for-the-badge)](https://github.com/wulkanowy/timetable-parser-js)
[![npm](https://img.shields.io/npm/v/@wulkanowy/timetable-parser?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@wulkanowy/timetable-parser)
# VULCAN Optivum Timetable parser for JS
Based on [wulkanowy/timetable-parser-php](https://github.com/wulkanowy/timetable-parser-php) *(not 1:1 copy)*

# Installation

### Via NPM

```bash
$ npm install @wulkanowy/timetable-parser
```

# Usage

## Parsing TimeTable Index Page
```js
import { TimeTable } from '@wulkanowy/timetable-parser';

const table = new TimeTable(/*Content of index.html file*/);

// Returns: String containing title of the timetable
const title = table.getTitle()

// Returns: String containing path to lista.html file
const list = table.getListPath()
```

## Parsing TimeTable List
```js
import { TimeTableList } from '@wulkanowy/timetable-parser';

const table = new TimeTableList(/*Content of lista.html file*/);

// Returns: Object of 3 lists
const list = table.getList();

// Returns: String containing path to school logo
const logo = table.getLogoSrc()
```

## Parsing TimeTable
```js
import { Table } from '@wulkanowy/timetable-parser';

const table = new Table(/*Content of plany/XYY.html file*/);

// Returns: String containing title of the timetable
const title = table.getTitle();

// Returns: Array of days from timetable headers
const dayNames = table.getDayNames()

// Returns: Object of hours
const hours = table.getHours()

// Returns: Array of lessons sorted by lesson number
const rawDays = table.getRawDays()

// Returns: Array of lessons sorted by days
const days = table.getDays()

// Returns: String containing timetable generation date
const generated = title.getGeneratedDate()

// Returns: String containing timetable effective date
const generated = title.getVersionInfo()
```
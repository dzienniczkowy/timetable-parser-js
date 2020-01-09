[![npm](https://img.shields.io/npm/v/@wulkanowy/timetable-parser.svg?style=for-the-badge)](https://www.npmjs.com/package/@wulkanowy/timetable-parser)
# VULCAN Optivum Timetable parser for JS

Based on [wulkanowy/timetable-parser-php](https://github.com/wulkanowy/timetable-parser-php) *(not 1:1 copy)*

## Installation

Via NPM

```bash
$ npm install @wulkanowy/timetable-parser
```

## Usage

```js
import { Table } from '@wulkanowy/timetable-parser';

const table = new Table(/*Content of oXX.html file*/);

// This returns array of 5 arrays (for 5 days)
const lessons = table.getDays();

// This will log name of the first lesson on monday
console.log(lessons[0][0].subject);
```

### Attributes of "lesson"

- `subject`
- `groupName`
- `teacher`
- `className`
- `room`

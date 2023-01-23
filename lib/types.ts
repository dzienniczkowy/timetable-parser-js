export interface TableHour {
  number: number;
  timeFrom: string;
  timeTo: string;
}

export interface TableLesson {
  subject: string;
  room?: string;
  roomId?: string;
  groupName?: string;
  teacher?: string;
  teacherId?: string;
  className?: string;
  classId?: string;
}

export interface List {
  classes: ListItem[];
  teachers?: ListItem[];
  rooms?: ListItem[];
}

export interface ListItem {
  name: string;
  value: string;
}

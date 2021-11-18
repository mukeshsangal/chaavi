//This Model Class is for sub-object named course in the Response to Get-action-events WS of Moodle.
//This is different from the Courses Class, which is to hold Course information.

import { NumberValueAccessor } from "@angular/forms";

export class Course {
    fullname: string;
    id: number;
}

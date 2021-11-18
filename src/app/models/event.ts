import { Url } from 'url';
import {Action} from '../models/action'
import { Course } from './course';
export class ActionEvent {
    action: Action;
    course: Course;
    id: number;
    modulename: string;
    instance: number;
    name: string;
    url: Url;
    userid: number;
}

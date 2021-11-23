import { Url } from "url";
import { ModuleFileContents } from "./module-file-contents";
import { Completiondata } from "./completiondata";
import { DatesLabelTimeStamp } from "./dates-label-time-stamp";

export class CourseModules {
    id: number;
    name: String;
    completion: number;
    modicon: Url;
    url: Url;
    modname: String;
    contents: ModuleFileContents[];
    completiondata: Completiondata;
    dates: DatesLabelTimeStamp[];
}

import { Url } from "url";
import { ModuleFileContents } from "./module-file-contents";
import { Completiondata } from "./completiondata";

export class CourseModules {
    id: number;
    name: String;
    completion: number;
    modicon: Url;
    url: Url;
    modname: String;
    contents: ModuleFileContents[];
    completiondata: Completiondata;
}

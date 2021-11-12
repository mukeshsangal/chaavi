import { H5pActvitiesDeployedFile } from "./h5p-actvities-deployed-file";
import { H5pActvitiesPackageFile } from "./h5p-actvities-package-file";

export class H5pActivities {
    course: number;
    coursemodule: number;
    deployedfile: H5pActvitiesDeployedFile;
    id: number;
    package: H5pActvitiesPackageFile[];
}

import BaseFileService from "./BaseFileService";

class FacilityFileService extends BaseFileService{
    postImage = ({facility_id, image_type, file}) => {
        if (!facility_id || !file) return this.missingData("missing facility_id or the file");

        return this.submitRequestWithPromise([file], `users/account/facilities/${facility_id}/images/chunk`, {image_type});
    };
}

export default new FacilityFileService();

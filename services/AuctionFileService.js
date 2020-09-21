import BaseServiceS3 from "./BaseServiceS3";
import {PUT} from "./RequestMethods";

class AuctionFileService extends BaseServiceS3 {
    postAuctionFiles = ({url, file, onUploadProgress}) => {
        return this.submitRequestWithPromise(PUT, url, file, {onUploadProgress});
    };
}

export default new AuctionFileService();

import {environment} from "./environment";
import BaseService from "./BaseService";
import {set} from 'lodash';
import {randomString} from "helpers/string";
import axios from "axios";
import {general_error_toastr} from "../components/partials/Notification";

export const sim_uploads = {
    callback: undefined,

    update(sim_uploads) {
        this.callback && this.callback(sim_uploads);
    }
};

export const file_progress = {
    simultaneousUploads: null,
    tracker: {},

    callback: undefined,

    files_added(target, files = []) {
        this.tracker[target].added_files = files;
    },

    track_progress(target = null, progress = undefined, initializing = undefined) {

        if (target) {
            set(this.tracker, `${target}.progress`, progress);
        }

        file_progress.callback && file_progress.callback(progress, initializing);
    },

    start(target) {
        this.tracker[target] = {
            files: 0,
            progress: 0,
            done: false,
            added_files: [],
        };

        file_progress.callback && file_progress.callback(0);
    },

    finish(target) {
        this.tracker[target].done = true;
        this.tracker[target].progress = 100;

        file_progress.callback && file_progress.callback(100);
    },

    failOrCancel(target = false) {
        if (target) {
            this.tracker[target].done = true;
            this.tracker[target].progress = 0;
        }

        file_progress.callback && file_progress.callback(0);
    },
};

export default class BaseFileService extends BaseService {

    file_ids = [];

    options = {
        fileType: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/wps-office.pdf'],
        // testChunks: false,
        // simultaneousUploads: null,
        // chunkSize: 256000,
        // maxFileSize: 10480000,
        // forceChunkSize: true,
        // chunkFormat: 'base64',
        // method: 'multipart',
    };

    /**
     * generate the array range of 0 till the request ids
     * count and push each new file it to the this.file_ids stack
     */
    async generateFileIdBatch(request_count = 1, config, image_type = undefined) {
        for (let inc = 0; inc < request_count; inc++) {
            this.file_ids.push(await this.generateFileId(config, image_type));
        }
    }

    async generateFileId(config, image_type = undefined) {

        let url = `${config.target}?randomStr=${randomString()}`;

        if (image_type) {
            url += `&image_type=${image_type}`;
        }

        const _config = {
            url,
            method: "POST",
            headers: config.headers,
        };

        try {
            const response = await axios.request(_config);

            return response.data.file_id;
        } catch (e) {

            return null;
        }
    };

    async submitRequestWithPromise(files = [], url, {apiEndPoint = environment.apiEndPoint, headers = {}, image_type = undefined, call_id = undefined, ...other_options} = {}) {

        const identifier = call_id || url;

        return this.accessToken().then(auth_token => new Promise(async (resolve, reject) => {


            const form = new FormData();
            form.append('file', files[0]);

            const response = await axios.put(url, form);
            return new Promise(resolve => {
                setTimeout(resolve, 100);
            })

            file_progress.track_progress(undefined, undefined, true);
            // remove speed check
            // other_options.simultaneousUploads = await this.doSpeedCheck({apiEndPoint, identifier});
            file_progress.track_progress(undefined, undefined, false);

            const config = {
                ...this.options,
                ...other_options,

                // full api endpoint.
                // TODO :: clean this up, check to see if we actually need the base endpoint
                // target: `${apiEndPoint}${url}`,
                target: `${url}`,
                uploadMethod: "PUT",

                headers: {
                    ...{
                        // 'x-api-key': 'ntV4QlG0kMIKjdjNgDJB1N2Uwn1RNkB7oKF3TVe2',
                        // 'Content-Type': 'multipart/form-data',
                        // 'Authorization': `Bearer ${auth_token}`,
                        // 'x-amz-acl': 'public-read'
                    },

                    // Merge headers passed in with the presets
                    ...headers
                },

                query: {
                    randomStr: randomString(),
                },
            };

            if (image_type) {
                config['query']['image_type'] = image_type;
            }

            /**
             * reserve unique file keys for upload
             */
            // await this.generateFileIdBatch(files.length, config, image_type);

            file_progress.start(identifier);

            // config.generateUniqueIdentifier = () => {
            //     const file_id = this.file_ids.shift();
            //
            //     if (!file_id) {
            //         general_error_toastr();
            //         reject('file_id_not_generated');
            //         return false;
            //     }
            //
            //     return file_id;
            // };

            const resumable = new window.Resumable(config);

            resumable.on('fileAdded', (/*file, event*/) => {
                resumable.upload();
            });

            resumable.on('filesAdded', (files_array) => {
                file_progress.files_added(identifier, files_array);
                resumable.upload();
            });

            resumable.on('progress', (file, event) => {
                file_progress.track_progress(identifier, resumable.progress() * 100);
            });

            resumable.on('complete', () => {
                file_progress.finish(identifier);

                resolve({
                    status: true,
                    event: 'complete',
                    file: true,
                })
            });

            resumable.on('error', (message, file) => {
                file_progress.failOrCancel(identifier);

                // debugger;
                reject({
                    status: false,
                    event: 'error',
                    message,
                    file,
                })
            });

            resumable.on('cancel', () => {
                file_progress.failOrCancel(identifier);

                // debugger;
                reject({
                    status: false,
                    event: 'cancel',
                })
            });

            file_progress.files_added(identifier, files);
            resumable.addFiles(files);
        }));
    }

    doSpeedCheck = async ({apiEndPoint, check_url = 'users/check-speed', identifier = 'tmp'}) => {
        return await new Promise((resolve) => {

            // set upload percentage to 1% to show loading has started
            let tracker = 1;
            file_progress.track_progress(identifier, tracker, true);

            // REVISIT :: this was a quick fix for safari. The window.Network lib appears to be failing silently
            const is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (is_safari) {
                sim_uploads.update(2);
                resolve(2);
                return true;
            }

            if (file_progress.simultaneousUploads) {
                sim_uploads.update(file_progress.simultaneousUploads);
                resolve(file_progress.simultaneousUploads);
                return true;
            }

            const configs = {
                sim_uploads: 1,
                avg_upload: 0,
                endpoint: `${apiEndPoint}${check_url}`,
                delay: 2000,
                measures: 8,
                data: {
                    size: 256000,
                    multiplier: 2
                },
            };

            const net = new window.Network(configs);

            try {
                let thinking = '';
                let prepend = 'Starting';

                net.upload
                    .on('start', function (dataSize) {
                        sim_uploads.update('Starting');
                    })
                    .on('progress', function (averageSpeed, instantSpeed) {
                        thinking += '.';
                        file_progress.track_progress(identifier, tracker + 10, true);
                        sim_uploads.update(prepend + thinking);
                    })
                    .on('restart', function (dataSize) {
                        prepend = 'Some more thinking';
                        thinking = '.';
                        sim_uploads.update(prepend);
                    })
                    .on('end', function (averageSpeed) {
                        const avg_upload = (averageSpeed * 8) / 1000;
                        let _sim_uploads = 1;

                        if (avg_upload >= 1250) {
                            _sim_uploads = 4;
                        } else if (avg_upload >= 750 && avg_upload < 1250) {
                            _sim_uploads = 2;
                        }

                        file_progress.simultaneousUploads = _sim_uploads;
                        resolve(_sim_uploads);
                        sim_uploads.update(_sim_uploads);
                    })
                    .start();
            } catch (e) {
                console.error({e});
                file_progress.simultaneousUploads = 1;
                sim_uploads.update(1);
                resolve(1);
            }
        })
    }
}

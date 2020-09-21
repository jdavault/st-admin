export const randomString = () => (
    Math.random().toString(36).substring(2, 15)
);

export const ucfirst = (theString) => {
    if (!theString){ return ''; }

    try{
        return `${theString}`.charAt(0).toUpperCase() + `${theString}`.substr(1)
    }catch (e) {
        return theString;
    }
};

/**
 custom validators
 **/

export const validator_dependant = (validatorID, {validateString, message}) => {
    try {
        window.Parsley.addValidator(validatorID, {
            validateString,
            messages: {en: message},
        });
    } catch (e) {
        console.error(`validator_dependant-${validatorID}-ERROR:`, e);
    }
};

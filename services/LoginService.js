import {Auth} from 'aws-amplify';

const LoginService = {
    async login(email, password) {
        return await Auth.signIn(email, password);
    },

    async logout() {
        return await Auth.signOut();
    },
};
export default LoginService;

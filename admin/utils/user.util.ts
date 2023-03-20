import jwt from "jsonwebtoken"
class UserService {
    user: any;

    constructor() {
        this.user = JSON.parse(window.localStorage.getItem("userData") as any);
    }

    getUser = () => {
        try {
            return this.user
        } catch (error) {
            return false
        }
    }


    getTokenAndUser = async () => {
        try {
            const { user: { user, token } } = this.user

            if (token && user) return { token, user }

        } catch (error) {
            return false
        }
    }


    getUserRegistrations = async () => {
        try {
            const { user: { user: { registrations } } } = this.user
            if (registrations) return registrations

        } catch (error) {
            return false
        }
    }


    getUserRoleData = async () => {
        try {
            let { user: { user: { registrations } } } = this.user
            let { data: { roleData } } = registrations[0]
            if (roleData) return roleData

        } catch (error) {
            return false
        }
    }

    getDecodedUserToken = async () => {
        try {
            let { user: { token } } = this.user
            let decoded = jwt.decode(token)

            if (decoded) return decoded

        } catch (error) {
            return false
        }
    }
}


export default UserService
import jwt from "jsonwebtoken"

interface SCOPES {
    disrtrict: string,
    block: string,
    any: string,
    admin: string,
    school: string,
    state: string
}
class UserService {
    user: any;
    scope: SCOPES

    constructor() {
        this.user = JSON.parse(window.localStorage.getItem("userData") as any);
        this.scope = {
            disrtrict: "District Admin",
            block: "Block Admin",
            any: "Any",
            admin: "Admin",
            school: "School Admin",
            state: "State Admin"
        }
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

    getInfoForUserListResource = async () => {
        try {
            let { roles: scope }: any = await this.getDecodedUserToken();
            let { district, block } = await this.getUserRoleData();

            console.log(scope, "scopes")

            if (scope) {
                switch (scope[0]) {
                    case this.scope.disrtrict:
                        return { district: [{ id: district, name: district }] }
                    case this.scope.block:
                        return { district: [{ id: district, name: district }], block: [{ id: block, name: block }] }
                    default:
                        return false
                }
            }

        } catch (error) {
            return false
        }
    }
}


export default UserService
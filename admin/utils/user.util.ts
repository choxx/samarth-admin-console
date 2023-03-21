import jwt from "jsonwebtoken"
import { APPLICATIONS, USER_SCOPES } from "./interfaces";


class UserService {
    user: any;
    scope: USER_SCOPES
    _applications: APPLICATIONS = {
        e_samwaad_user: { id: "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da", name: "e_samwaad_user" },
        shiksha_saathi_user: { id: "1ae074db-32f3-4714-a150-cc8a370eafd1", name: "shiksha_saathi_user" },
    };

    constructor() {
        this.user = JSON.parse(window.localStorage.getItem("userData") as any);
        this.scope = {
            district: "District Admin",
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


    getTokenAndUser = () => {
        try {
            const { user: { user, token } } = this.user

            if (token && user) return { token, user }

        } catch (error) {
            return false
        }
    }


    getUserRegistrations = () => {
        try {
            const { user: { user: { registrations } } } = this.user
            if (registrations) return registrations

        } catch (error) {
            return false
        }
    }


    getUserRoleData = (resource: string) => {
        try {
            let { user: { user: { registrations } } } = this.user
            switch (resource) {
                case this._applications.shiksha_saathi_user.name:
                    let { data: { roleData } } = registrations[0]
                    if (roleData) return roleData
                    break;
                default:
                    break;
            }

        } catch (error) {
            return false
        }
    }

    getDecodedUserToken = () => {
        try {
            let { user: { token } } = this.user
            let decoded = jwt.decode(token)

            if (decoded) return decoded

        } catch (error) {
            return false
        }
    }

    getInfoForUserListResource = async (resource: string) => {
        try {
            let { roles: scope }: any = this.getDecodedUserToken();
            let { district, block } = await this.getUserRoleData(resource);

            if (scope) {
                switch (scope[0]) {
                    case this.scope.district:
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
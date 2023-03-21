import { client } from "../../api-clients/users-client";
import { APPLICATIONS } from "../../utils/interfaces";







import UserService from "../../utils/user.util";

export const UPDATE_USER_BY_ID_QUERY = `
mutation($object:teacher_set_input!, $id:uuid!){
  update_teacher(where:{user_id:{_eq:$id}}, _set:$object){
    returning{
      id
    }
  }
}`;

const user = new UserService();

const dataProvider = {
  getList: async (
    resource: any,
    { pagination: { page, perPage }, filter }: any
  ): Promise<any> => {
    let queryString = [`registrations.applicationId:${resource === user._applications.e_samwaad_user.name ? user._applications.e_samwaad_user.id : user._applications.shiksha_saathi_user.id}`];

    let { roles: scope }: any = user.getDecodedUserToken();

    let compliment = {
      shiksha_sathi: (resource == user._applications.shiksha_saathi_user.name) && (Array.isArray(scope)),
      e_samwaad: (resource == user._applications.e_samwaad_user.name)
    }


    if (compliment.shiksha_sathi) {
      let { district, block }: any = await user.getUserRoleData(resource);
      switch (scope[0]) {
        case user.scope.district:
          queryString = [`registrations.applicationId:${user._applications.shiksha_saathi_user.id} AND data.roleData.district: ${district}`];
          break
        case user.scope.block:
          queryString = [`registrations.applicationId:${user._applications.shiksha_saathi_user.id} AND data.roleData.block: ${block}`];
          break
        default:
          break
      }
    }

    // Pass the UDISES as per Esamwaad Roles Access in the below array.
    // const UDISES = [2100600104, 110, 2080210301].join(" ");
    if (compliment.e_samwaad) {
      // queryString = [`registrations.applicationId:${Applications[resource]} AND data.udise: (${UDISES})`]
      queryString = [`registrations.applicationId:${user._applications.e_samwaad_user.id}`]
    }

    if (filter && Object.keys(filter).length > 0) {
      if (filter?.udise) {
        queryString.push(`${filter?.udise}`);
      }

      if (filter?.shikshaRoles) {
        queryString.push(`registrations.roles:%22${filter?.shikshaRoles}%22`);
      }
      if (filter?.esamwadRoles) {
        queryString.push(`registrations.roles:${filter?.esamwadRoles}`);
      }
      if (filter?.data?.roleData?.district) {
        queryString.push(
          `data.roleData.district:${filter?.data?.roleData?.district}`
        );
      }
      if (filter?.block) {
        queryString.push(`data.roleData.block:"${filter?.block}"`);
      }
      if (filter?.cluster) {
        queryString.push(`data.roleData.cluster:"${filter?.cluster}"`);
      }
      if (filter?.user_id) {
        queryString.push(`id:"${filter?.user_id}"`);
      }
      if (filter?.username) {
        queryString.push(
          `username:${filter?.username} OR username:*${filter?.username}*`
        );
        // queryString.push(``);
      }
    }
    const params = {
      startRow: (page - 1) * perPage,
      numberOfResults: perPage,
      queryString: `(${queryString.join(") AND (")})`,
      applicationId: resource === user._applications.e_samwaad_user.name ? user._applications.e_samwaad_user.id : user._applications.shiksha_saathi_user.id,
    };
    const response = await client.get("/admin/searchUser", { params });
    if (response?.data?.result) {
      return {
        total: response?.data?.result?.total,
        data: response?.data?.result?.users || [],
      };
    } else {
      return {
        total: 0,
        data: [],
      };
    }
  },
  getOne: async (resource: any, { id }: any): Promise<any> => {
    const params = {
      queryString: id
    };
    const response = await client.get("/admin/searchUser", { params });

    if (response?.data?.result) {
      return {
        data: response?.data?.result?.users?.filter((el: any) => el.id == id)?.[0],
      };
    }
    return response;
  },
  getUserByUdise: async (resource: any, { id }: any): Promise<any> => {
    const params = {
      queryString: `(registrations.applicationId:f0ddb3f6-091b-45e4-8c0f-889f89d4f5da) AND (registrations.roles:school) AND (data.udise: ${id})`,
    };
    const response = await client.get("/admin/searchUser", { params });

    if (response?.data?.result) {
      return {
        data: response?.data?.result?.users
      };
    }
    return response;
  },
  changePassword: async (resource: any, payload: any): Promise<any> => {
    const response = await client.post("/admin/changePassword", payload);
    if (response?.data?.msg) {
      return {
        data: response?.data?.msg,
      };
    }
    throw new Error("Unable to update");
  },
  updateUser: async (resource: any, data: any): Promise<any> => {
    const d = data.gql ? JSON.parse(JSON.stringify(data.gql)) : null;
    const id = data.id;
    delete data["designation"];
    delete data["employment"];
    delete data["account_status"];
    delete data["gql"];
    delete data["id"];
    try {
      const response = await client.patch("/admin/updateUser/" + id, data);
      // if (d) {
      //   await clientGQL(UPDATE_USER_BY_ID_QUERY, { object: d, id: id });
      // }
      if (response?.data?.result) {
        return {
          data: response?.data?.result,
        };
      }
    } catch (e) { }
    throw new Error("Unable to update");
  },
};
export default dataProvider;

import UserList from "./UserList";
import UserEdit from "./UserEdit";
import UserCreate from "./UserCreate";




export default {
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
  permissions: {
    canEdit: ["Admin", "State Admin", "District Admin", "Block Admin"],
    // canDelete: ["Admin"],
    canCreate: ["Admin", "State Admin"],
    canList: ["Admin", "State Admin", "District Admin", "Block Admin"],
  },
};

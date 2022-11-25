import {
  Datagrid,
  List,
  ShowButton,
  useResourceContext,
} from "react-admin";
import { usePermissions } from "ra-core";
import { ItemWithPermissionResolver } from "../layout/MenuOptions";
import EditButtonWrapper from "../styleWrappers/EditButtonWrapper";

const ListDataGridWithPermissions = ({
  children,
  listProps,
  dataGridProps,
  showExporter = false,
  withDelete = false,
}: {
  children: any;
  listProps?: any;
  dataGridProps?: any;
  showExporter?: boolean;
  withDelete?: boolean;
}) => {
  const { permissions } = usePermissions();
  const resource = useResourceContext();
  const ResourceWithPermission = ItemWithPermissionResolver(
    permissions,
    resource
  );
  const _dataGridProps = dataGridProps
    ? JSON.parse(JSON.stringify(dataGridProps))
    : {};
  if (!ResourceWithPermission?.resourcePermissions?.canDelete) {
    _dataGridProps.bulkActionButtons = null;
  }

  return (
    <>
      {
        showExporter ? <List {...(listProps || {})} empty={false} >
          <Datagrid
            bulkActionButtons={withDelete} {...(_dataGridProps || {})}>
            {children}
            {ResourceWithPermission?.resourcePermissions?.canEdit && <EditButtonWrapper />}
          </Datagrid>
        </List> : <List {...(listProps || {})} empty={false} exporter={false}>
          <Datagrid
            bulkActionButtons={withDelete} {...(_dataGridProps || {})}>
            {children}
            {ResourceWithPermission?.resourcePermissions?.canEdit && <EditButtonWrapper />}
          </Datagrid>
        </List>
      }

    </>
  );
};
export default ListDataGridWithPermissions;

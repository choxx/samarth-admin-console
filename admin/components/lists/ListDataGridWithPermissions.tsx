import { Datagrid, List, useResourceContext } from "react-admin";
import { usePermissions } from "ra-core";
import { ItemWithPermissionResolver } from "../layout/MenuOptions";
import EditButtonWrapper from "../styleWrappers/EditButtonWrapper";
import { Pagination } from "react-admin";

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
  withDelete?: any;
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

  const ListPagination = () => (
    <>
      <div className="MyCustomPagination">
        <Pagination rowsPerPageOptions={[10, 25, 50]} />
      </div>
    </>
  );
  return (
    <>
      {showExporter ? (
        <List
          {...(listProps || {})}
          pagination={<ListPagination />}
          empty={false}
        >
          <Datagrid bulkActionButtons={withDelete} {...(_dataGridProps || {})}>
            {children}
            {ResourceWithPermission?.resourcePermissions?.canEdit && (
              <EditButtonWrapper />
            )}
          </Datagrid>
        </List>
      ) : (
        <List
          {...(listProps || {})}
          pagination={<ListPagination />}
          empty={false}
          exporter={false}
        >
          <Datagrid bulkActionButtons={withDelete} {...(_dataGridProps || {})}>
            {children}
            {ResourceWithPermission?.resourcePermissions?.canEdit && (
              <EditButtonWrapper />
            )}
          </Datagrid>
        </List>
      )}
    </>
  );
};
export default ListDataGridWithPermissions;

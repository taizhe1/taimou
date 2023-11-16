import { ITreeNode } from '@/typings';
import { OperationColumn, WorkspaceTabType } from '@/constants';
import i18n from '@/i18n';
import { v4 as uuid } from 'uuid';

// ----- components -----
import { dataSourceFormConfigs } from '@/components/ConnectionEdit/config/dataSource';
import { IConnectionConfig } from '@/components/ConnectionEdit/config/types';

// ----- config -----
import { ITreeConfigItem, treeConfig } from '../treeConfig';
import { useMemo } from 'react';

// ----- store -----
import { createConsole, addWorkspaceTab } from '@/store/console';

// ---- functions -----
import { openView, openFunction, openProcedure, openTrigger } from '../functions/openAsyncSql';

// ----- utils -----
import { compatibleDataBaseName } from '@/utils/database';

interface IProps {
  treeNodeData: ITreeNode;
  loadData: any;
}

interface IOperationColumnConfigItem {
  text: string;
  icon: string;
  doubleClickTrigger?: boolean;
  handle: () => void;
}

export const useGetRightClickMenu = (props: IProps) => {
  const { treeNodeData, loadData } = props;

  const rightClickMenu = useMemo(() => {
    // 拿出当前节点的配置
    const treeNodeConfig: ITreeConfigItem = treeConfig[treeNodeData.treeNodeType];
    const { operationColumn } = treeNodeConfig;

    const dataSourceFormConfig = dataSourceFormConfigs.find((t: IConnectionConfig) => {
      return t.type === treeNodeData.extraParams?.databaseType;
    })!;

    // 有些数据库不支持的操作，需要排除掉
    function excludeSomeOperation() {
      const excludes = dataSourceFormConfig.baseInfo.excludes;
      const newOperationColumn: OperationColumn[] = [];
      operationColumn?.map((item: OperationColumn) => {
        let flag = false;
        excludes?.map((t) => {
          if (item === t) {
            flag = true;
          }
        });
        if (!flag) {
          newOperationColumn.push(item);
        }
      });
      return newOperationColumn;
    }

    const operationColumnConfig: { [key in string]: IOperationColumnConfigItem } = {
      // 刷新
      [OperationColumn.Refresh]: {
        text: i18n('common.button.refresh'),
        icon: '\uec08',
        handle: () => {
          loadData({
            refresh: true,
          });
        },
      },

      // 创建console
      [OperationColumn.CreateConsole]: {
        text: i18n('workspace.menu.queryConsole'),
        icon: '\ue619',
        handle: () => {
          createConsole({
            name: 'create console',
            dataSourceId: treeNodeData.extraParams!.dataSourceId!,
            type: treeNodeData.extraParams!.databaseType!,
            databaseName: treeNodeData.extraParams?.databaseName,
            schemaName: treeNodeData.extraParams?.schemaName,
          });
        },
      },

      // 创建表
      [OperationColumn.CreateTable]: {
        text: i18n('editTable.button.createTable'),
        icon: '\ue792',
        handle: () => {
          addWorkspaceTab({
            id: uuid(),
            title: i18n('editTable.button.createTable'),
            type: WorkspaceTabType.CreateTable,
            uniqueData: {
              dataSourceId: treeNodeData.extraParams!.dataSourceId!,
              databaseType: treeNodeData.extraParams!.databaseType!,
              databaseName: treeNodeData.extraParams?.databaseName,
              schemaName: treeNodeData.extraParams?.schemaName,
            },
          });
        },
      },

      // 删除表
      [OperationColumn.DeleteTable]: {
        text: i18n('workspace.menu.deleteTable'),
        icon: '\ue6a7',
        handle: () => {
          // setVerifyDialog(true);
        },
      },

      // 查看ddl
      [OperationColumn.ViewDDL]: {
        text: i18n('workspace.menu.ViewDDL'),
        icon: '\ue665',
        handle: () => {
          //
        },
      },

      // 置顶
      [OperationColumn.Top]: {
        text: treeNodeData.pinned ? i18n('workspace.menu.unPin') : i18n('workspace.menu.pin'),
        icon: treeNodeData.pinned ? '\ue61d' : '\ue627',
        handle: () => {},
      },

      // 编辑表
      [OperationColumn.EditTable]: {
        text: i18n('workspace.menu.editTable'),
        icon: '\ue602',
        handle: () => {
          addWorkspaceTab({
            id: `${OperationColumn.EditTable}-${treeNodeData.uuid}`,
            title: i18n('editTable.button.createTable'),
            type: WorkspaceTabType.EditTable,
            uniqueData: {
              dataSourceId: treeNodeData.extraParams!.dataSourceId!,
              databaseType: treeNodeData.extraParams!.databaseType!,
              databaseName: treeNodeData.extraParams?.databaseName,
              schemaName: treeNodeData.extraParams?.schemaName,
              tableName: treeNodeData?.name,
            },
          });
        },
      },

      // 复制名称
      [OperationColumn.CopyName]: {
        text: i18n('common.button.copyName'),
        icon: '\uec7a',
        handle: () => {
          navigator.clipboard.writeText(treeNodeData.name);
        },
      },

      // 打开表
      [OperationColumn.OpenTable]: {
        text: i18n('workspace.menu.openTable'),
        icon: '\ue618',
        doubleClickTrigger: true,
        handle: () => {
          const databaseName = compatibleDataBaseName(
            treeNodeData.extraParams!.databaseName!,
            treeNodeData.extraParams!.databaseType,
            );
          addWorkspaceTab({
            id: `${OperationColumn.OpenTable}-${treeNodeData.uuid}`,
            title: treeNodeData.name,
            type: WorkspaceTabType.EditTableData,
            uniqueData: {
              dataSourceId: treeNodeData.extraParams!.dataSourceId!,
              databaseType: treeNodeData.extraParams!.databaseType!,
              databaseName: treeNodeData.extraParams?.databaseName,
              schemaName: treeNodeData.extraParams?.schemaName,
              sql: `select * from ${databaseName}`,
            },
          });
        },
      },

      // 打开视图
      [OperationColumn.OpenView]: {
        text: i18n('workspace.menu.view'),
        icon: '\ue651',
        doubleClickTrigger: true,
        handle: () => {
          openView({
            addWorkspaceTab,
            treeNodeData,
          });
        },
      },

      // 打开函数
      [OperationColumn.OpenFunction]: {
        text: i18n('workspace.menu.view'),
        icon: '\ue651',
        doubleClickTrigger: true,
        handle: () => {
          openFunction({
            addWorkspaceTab,
            treeNodeData,
          });
        },
      },

      // 打开存储过程
      [OperationColumn.OpenProcedure]: {
        text: i18n('workspace.menu.view'),
        icon: '\ue651',
        doubleClickTrigger: true,
        handle: () => {
          openProcedure({
            addWorkspaceTab,
            treeNodeData,
          });
        },
      },

      // 打开触发器
      [OperationColumn.OpenTrigger]: {
        text: i18n('workspace.menu.view'),
        icon: '\ue651',
        doubleClickTrigger: true,
        handle: () => {
          openTrigger({
            addWorkspaceTab,
            treeNodeData,
          });
        },
      },
    };

    // 根据配置生成右键菜单
    return excludeSomeOperation().map((t, i) => {
      const concrete = operationColumnConfig[t];
      return {
        key: i,
        onClick: concrete?.handle,
        type: t,
        doubleClickTrigger: concrete.doubleClickTrigger,
        labelProps: {
          icon: concrete?.icon,
          label: concrete?.text,
        },
      };
    });
  }, [treeNodeData]);

  return rightClickMenu;
};
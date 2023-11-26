import { setWorkspaceTabList, setActiveConsoleId } from '@/pages/main/workspace/store/console';
import { useWorkspaceStore } from '@/pages/main/workspace/store';
import { ConsoleStatus, ConsoleOpenedStatus, WorkspaceTabType, DatabaseTypeCode } from '@/constants'
import historyService from '@/service/history';

interface ICreateConsoleParams { 
  name?: string;
  ddl?: string;
  dataSourceId?: number;
  dataSourceName?: string;
  databaseName?: string;
  schemaName?: string;
  databaseType?: DatabaseTypeCode;
  operationType?: string;
}

function useCreateConsole() {
  const { workspaceTabList } = useWorkspaceStore(state => {
    return {
      workspaceTabList: state.workspaceTabList,
    }
  });

  const createConsole = (params: ICreateConsoleParams) => {
    const newConsole = {
      ...params,
      name: params.name || 'create console',
      ddl: params.ddl || '',
      status: ConsoleStatus.DRAFT,
      tabOpened: ConsoleOpenedStatus.IS_OPEN,
      operationType: WorkspaceTabType.CONSOLE,
      databaseType: params.databaseType,
      dataSourceId: params.dataSourceId,
      dataSourceName: params.dataSourceName,
    };
    historyService.createConsole(newConsole).then((res) => {
      const newList = [
        ...(workspaceTabList||[]),
        {
          id: res,
          title: newConsole.name,
          type: newConsole.operationType,
          uniqueData: newConsole,
        },
      ];
      setWorkspaceTabList(newList);
      setActiveConsoleId(res);
    });
  }
  
  return {
    createConsole
  }
}

export default useCreateConsole;
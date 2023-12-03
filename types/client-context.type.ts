import { Theme } from "./theme-config.type";
type User = {
  id: string;
  isAdmin: boolean;
  isGuest: boolean;
  isViewOnly: boolean;
  countryCode: string;
  currentLanguage: string;
  timeFormat: string;
  timeZoneOffset: number;
};

type Account = {
  id: string;
};

type App = {
  id: number;
  clientId: string;
};

type AppVersion = {
  id: number;
  name: string;
  status: string;
  type: string;
  versionData: {
    major: number;
    minor: number;
    patch: number;
    type: string;
  };
};

export type BaseContext = {
  themeConfig?: Theme;
  theme: string;
  account: Account;
  user: User;
  region: string;
  app: App;
  appVersion: AppVersion;
};

export type AppFeatureBoardViewContext = BaseContext & {
  boardId: number;
  boardIds: number[];
  boardViewId: number;
  viewMode: string;
  instanceId: number;
  instanceType: string;
  workspaceId: number;
};

export type AppFeatureAiBoardMainMenuHeaderContext = BaseContext & {
  location: string;
  locationContext: {
    boardId: number;
    workspaceId: number;
  };
  appFeatureId: number;
  withExternalWidth: boolean;
  withHeaderPadding: boolean;
  boardId: number;
  workspaceId: number;
};

export type AppFeatureDashboardWidgetContext = BaseContext & {
  boardIds: number[];
  widgetId: number;
  viewMode: string;
  editMode: boolean;
  instanceId: number;
  instanceType: string;
};

export type AppFeatureItemMenuActionContext = BaseContext & {
  boardId: number;
  pulseId: number;
  itemId: number;
};

export type AppFeatureItemBatchActionContext = BaseContext & {
  boardId: number;
  itemId: number;
  selectedPulsesIds: number[];
};

export type AppFeatureGroupMenuActionContext = BaseContext & {
  groupId: string;
  boardId: number;
  groupColor: string;
};

export type AppFeatureObjectContext = BaseContext & {
  boardId: number;
  boardIds: [number];
  workspaceId: number;
  appFeatureId: number;
  instanceId: number;
  instanceType: string;
  isFullScreen: boolean;
  isPresentingMode: boolean;
  objectPermissions: string;
  isFirstLevelControlPinned: boolean;
  isSlidePanelOpen: boolean;
  boardLoadingState: number;
};

export type AppFeatureWorkspaceViewContext = BaseContext & {
  workspaceId: number;
};

export type AppFeatureItemViewContext = BaseContext & {
  workspaceId: number;
  boardId: number;
  boardIds: [number];
  itemId: number;
  instanceId: number;
  instanceType: string;
};

export type AppFeatureAiDocQuickStartType = BaseContext & {
  location: string;
  locationContext: {
    docId: number;
    objectId: number;
    workspaceId: number;
    additionalSdkMethodsList: string[];
  };
  appFeatureId: number;
  withExternalWidth: boolean;
  withHeaderPadding: boolean;
  docId: number;
  objectId: number;
  workspaceId: number;
  additionalSdkMethodsList: string[];
};

export type AppFeatureAiDocTopBarContext = BaseContext & {
  location: string;
  locationContext: {
    input: string;
    docId: number;
    objectId: number;
    workspaceId: number;
    additionalSdkMethodsList: string[];
  };
  appFeatureId: number;
  withExternalWidth: boolean;
  withHeaderPadding: boolean;
  input: string;
  docId: number;
  objectId: number;
  workspaceId: number;
  additionalSdkMethodsList: string[];
};
export type FocusedBlock = {
  id: string;
  createdUserId: number;
  accountId: number;
  docId: number;
  type: string;
  content: {
    alignment: string;
    direction: string;
    deltaFormat: Array<{
      insert: string;
    }>;
    base64Encoded: string;
  };
  position: number;
  parentBlockId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppFeatureAiDocSlashCommandContext = BaseContext & {
  location: string;
  locationContext: {
    focusedBlocks: FocusedBlock[];
    canMoveToNextSelectedTextualBlock: boolean;
    canMoveToPrevSelectedTextualBlock: boolean;
    input: string;
    isTextSelectedInBlock: boolean;
    docId: number;
    objectId: number;
    workspaceId: number;
    additionalSdkMethodsList: string[];
  };
  appFeatureId: number;
  withExternalWidth: boolean;
  withHeaderPadding: boolean;
  focusedBlocks: FocusedBlock[];
  canMoveToNextSelectedTextualBlock: boolean;
  canMoveToPrevSelectedTextualBlock: boolean;
  input: string;
  isTextSelectedInBlock: boolean;
  docId: number;
  objectId: number;
  workspaceId: number;
  additionalSdkMethodsList: string[];
};

export type AppFeatureDocActionsContext = BaseContext & {
  themeConfig: Theme;
  docId: number;
  objectId: number;
  workspaceId: number;
  focusedBlocks: FocusedBlock[];
  placement: string;
  highlightedText: string;
  range: {
    index: number;
    length: number;
  };
  blockId: string;
};

export type AppFeatureContextMap = {
  Base: BaseContext;
  AppFeatureBoardView: AppFeatureBoardViewContext;
  AppFeatureAiBoardMainMenuHeader: AppFeatureAiBoardMainMenuHeaderContext;
  AppFeatureDashboardWidget: AppFeatureDashboardWidgetContext;
  AppFeatureItemMenuAction: AppFeatureItemMenuActionContext;
  AppFeatureItemBatchAction: AppFeatureItemBatchActionContext;
  AppFeatureGroupMenuAction: AppFeatureGroupMenuActionContext;
  AppFeatureObject: AppFeatureObjectContext;
  AppFeatureWorkspaceView: AppFeatureWorkspaceViewContext;
  AppFeatureItemView: AppFeatureItemViewContext;
  AppFeatureAiDocQuickStart: AppFeatureAiDocQuickStartType;
  AppFeatureAiDocTopBar: AppFeatureAiDocTopBarContext;
  AppFeatureAiDocSlashCommand: AppFeatureAiDocSlashCommandContext;
  AppFeatureDocActions: AppFeatureDocActionsContext;
};

export type AppFeatureTypes = keyof AppFeatureContextMap;

// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdResourcesMergingHelper extends gdArbitraryResourceWorker {
  constructor(resourcesManager: gdResourcesManager, fs: gdAbstractFileSystem): void;
  setBaseDirectory(basePath: string): void;
  getAllResourcesOldAndNewFilename(): gdMapStringString;
  delete(): void;
  ptr: number;
};
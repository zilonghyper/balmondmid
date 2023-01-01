import { createPathEditorHeader } from '../utils/path-editor.js';
import { fromByteArray } from '../utils/base64.js';

const electron = require('electron');
const remote = require('@electron/remote');
const electronWindow = remote.getCurrentWindow();
const ipcRenderer = electron.ipcRenderer;

let yarn = null;

function convertJsonStringToDataUrl(jsonString) {
  const base64 = fromByteArray(new TextEncoder().encode(jsonString));
  return `data:application/json;base64,${base64}`;
}

const closeWindow = () => {
  remote.getCurrentWindow().close();
};

const editorFrameEl = document.getElementById('yarn-frame');
window.addEventListener('yarnReady', e => {
  yarn = e;
  yarn.data.restoreFromLocalStorage(false);
  ipcRenderer.send('yarn-ready');
});
editorFrameEl.src = 'yarn-editor/index.html';

// Called to load yarn data. Should be called after the window is fully loaded.
ipcRenderer.on('yarn-open', async (event, externalEditorInput) => {
  const saveAndClose = pathEditor => {
    const jsonString = yarn.data.getSaveData('json');
    const dataUrl = convertJsonStringToDataUrl(jsonString);
    ipcRenderer.send('yarn-save', {
      resources: [
        {
          name: resource ? pathEditor.state.name : undefined,
          localFilePath: resource.localFilePath,
          extension: '.json',
          dataUrl,
        },
      ],
      baseNameForNewResources: pathEditor.state.name,
      externalEditorData: null,
    });
    remote.getCurrentWindow().close();
  };

  // Make the header.
  const pathEditorHeaderDiv = document.getElementById('path-editor-header');
  const pathEditorHeader = createPathEditorHeader({
    parentElement: pathEditorHeaderDiv,
    editorContentDocument: document,
    onSaveToGd: saveAndClose,
    onCancelChanges: closeWindow,
    name: externalEditorInput.name,
  });

  // Inject custom Apply button.
  const saveToGdButton = yarn.document
    .getElementsByClassName('search-tags')[0]
    .cloneNode(true);
  saveToGdButton.onclick = () => saveAndClose(pathEditorHeader);
  yarn.document
    .getElementsByClassName('search-tags')[0]
    .parentElement.appendChild(saveToGdButton);
  saveToGdButton.childNodes[0].checked = 'checked';
  saveToGdButton.childNodes[2].innerHTML = 'Apply';
  saveToGdButton.childNodes[2].style = 'background-color: white;';
  yarn.document.getElementsByClassName('app-search')[0].style = 'right: 45px';
  saveToGdButton.style = 'padding-left: 30px;';

  yarn.data.editingPath('');
  yarn.data.editingType('json');

  const resource = externalEditorInput.resources[0] || null;
  const hasExistingResource = resource && resource.name && resource.dataUrl;
  if (hasExistingResource) {
    try {
      const response = await fetch(resource.dataUrl);
      const resourceData = await response.json();
      yarn.data.loadData(JSON.stringify(resourceData), 'json', true);
      pathEditorHeader.disableNameInput();
    } catch (error) {
      console.error('Error while loading the resource - ignoring it.', error);
    }
  }
  electronWindow.setTitle(
    'GDevelop Dialogue Tree Editor (Yarn) - ' + externalEditorInput.name
  );
});

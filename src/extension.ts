import * as vscode from 'vscode';
import { URI } from 'vscode-uri';

export function activate(context: vscode.ExtensionContext) {
  let cameltodashed = vscode.commands.registerCommand(
    'shifter.cameltodashed',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const word = document.getText(selection);
        const tranformed = word
          .replace(/\,/g, ';')
          .replace(/\'/g, '')
          .replace(/([A-Z]+[a-z]*)/g, (_, character) => {
            return `-${character.toLowerCase()}`;
          });
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, tranformed);
        });
      }
    },
  );
  let dashedtocamel = vscode.commands.registerCommand(
    'shifter.dashedtocamel',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const word = document.getText(selection);
        const tranformed = word
          .replace(/\;/g, "',")
          .replace(/\:\s/g, ": '")
          .replace(/^([^']+)(\-[a-z])/gm, (_, character1, character2) => {
            return `${character1}${character2.toUpperCase().substr(1)}`;
          });
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, tranformed);
        });
      }
    },
  );
  function stringToUint8Array(str: string) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
  }
  let inlinetofile = vscode.commands.registerCommand(
    'shifter.inlinetofile',
    async () => {
      // 获取当前文件的path
      let currentlyOpenTabfilePath =
        vscode.window.activeTextEditor!.document.fileName;
      vscode.window.showInformationMessage(currentlyOpenTabfilePath);
      // 获取当前文件的内容,修改后写入
      const current = vscode.window.activeTextEditor!.document.getText();
      let currentReplaced = current,
        stylesContent = '',
        count = 0;
      while (/style\s*=\s*\{\{[\s\S]*?\}\}/.test(currentReplaced)) {
        currentReplaced = currentReplaced.replace(
          /style\s*=\s*\{(\{[\s\S]*?\})\}/,
          (_, character) => {
            const changed = character
              .replace(/\,/g, ';')
              .replace(/\'/g, '')
              .replace(/([A-Z]+[a-z]*)/g, (_: string, character1: string) => {
                return `-${character1.toLowerCase()}`;
              });
            stylesContent += `\n.class${count}\n${changed}`;
            return `className={styles.class${count}}`;
          },
        );
        count++;
      }
      const changedText =
        "import styles from './index.module.less';\n" + currentReplaced;
      await vscode.workspace.fs.writeFile(
        URI.file(currentlyOpenTabfilePath!),
        stringToUint8Array(changedText),
      );
      // 在当前文件夹下新建index.module.less文件,并将style写入新文件
      const length = currentlyOpenTabfilePath.split('/').length;
      const fileName =
        currentlyOpenTabfilePath
          .split('/')
          .splice(0, length! - 1)
          .join('/') + '/index.module.less';
      const doc = await vscode.workspace.fs.writeFile(
        URI.file(fileName),
        stringToUint8Array(stylesContent),
      );
    },
  );

  context.subscriptions.push(cameltodashed, dashedtocamel, inlinetofile);
}

// this method is called when your extension is deactivated
export function deactivate() {}

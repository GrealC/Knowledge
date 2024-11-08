/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/betterOrderList.ts
var betterOrderList_exports = {};
__export(betterOrderList_exports, {
  default: () => BetterOrderListPlugin
});
module.exports = __toCommonJS(betterOrderList_exports);
var import_obsidian = require("obsidian");

// src/line.ts
var import_view = require("@codemirror/view");
var import_state = require("@codemirror/state");
function identifyPattern(lineText) {
  const patterns = {
    arabic: /^\d+[\.|、]/,
    uppercaseLetter: /^[A-Z][\.|、]/,
    lowercaseLetter: /^[a-z][\.|、]/,
    romanNumeral: /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})[\.|、]/,
    chineseNumeral: /^[\u4e00-\u9fa5]+[\.|、]/
  };
  for (let type in patterns) {
    if (patterns[type].test(lineText)) {
      return type;
    }
  }
  return null;
}
function getNextNumber(currentNumber, punctuation, patternType) {
  switch (patternType) {
    case "arabic":
      return parseInt(currentNumber) + 1 + punctuation;
    case "uppercaseLetter":
      return String.fromCharCode(currentNumber.charCodeAt(0) + 1) + punctuation;
    case "lowercaseLetter":
      return String.fromCharCode(currentNumber.charCodeAt(0) + 1) + punctuation;
    case "romanNumeral":
      let arabicNum = romanToArabic(currentNumber);
      return arabicToRoman(arabicNum + 1) + punctuation;
    case "chineseNumeral":
      let arabicNumChinese = chineseToArabic(currentNumber);
      return arabicToChinese(arabicNumChinese + 1) + punctuation;
    default:
      return null;
  }
}
function romanToArabic(roman) {
  const romanNumerals = {
    M: 1e3,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let arabic = 0;
  let i = roman.length;
  while (i--) {
    if (romanNumerals[roman[i]] < romanNumerals[roman[i + 1]]) {
      arabic -= romanNumerals[roman[i]];
    } else {
      arabic += romanNumerals[roman[i]];
    }
  }
  return arabic;
}
function arabicToRoman(number) {
  const romanNumerals = {
    M: 1e3,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let roman = "";
  for (let key in romanNumerals) {
    while (number >= romanNumerals[key]) {
      roman += key;
      number -= romanNumerals[key];
    }
  }
  return roman;
}
function chineseToArabic(chinese) {
  const chineseNumerals = {
    "\u4E00": 1,
    "\u4E8C": 2,
    "\u4E09": 3,
    "\u56DB": 4,
    "\u4E94": 5,
    "\u516D": 6,
    "\u4E03": 7,
    "\u516B": 8,
    "\u4E5D": 9,
    "\u5341": 10
  };
  return chineseNumerals[chinese] || 0;
}
function arabicToChinese(number) {
  const chineseNumerals = ["\u96F6", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"];
  return chineseNumerals[number] || "";
}
function calculateNewCursorPosition(forEnterChanges, state) {
  var _a, _b;
  let lastChangeEnd = 0;
  if (forEnterChanges.length === 0)
    return lastChangeEnd;
  if (forEnterChanges.length === 1) {
    if ("insert" in forEnterChanges[0] && ((_a = forEnterChanges[0].insert) == null ? void 0 : _a.trim()) === "") {
      return ((_b = forEnterChanges[0]) == null ? void 0 : _b.from) || 0;
    }
  }
  forEnterChanges.forEach((change) => {
    var _a2;
    if ("from" in change && "to" in change) {
      lastChangeEnd = ((change == null ? void 0 : change.to) || 0) + ((_a2 = change == null ? void 0 : change.insert) == null ? void 0 : _a2.length) || 0;
    }
  });
  return lastChangeEnd;
}
function extractBracketsAndText(lineText) {
  const reg = /^([\(\[\【\（])?([^\）\]\】\)]*)([\）\]\】\)])?([\.、](.*))/;
  const match = new RegExp(reg, "gm").exec(lineText);
  if (match) {
    return [match[1] || "", (match[2] || "") + (match[4] || ""), match[3] || ""];
  } else {
    return ["", lineText, ""];
  }
}
function handleDelete(transaction, state) {
  const changes = [];
  transaction.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    const deletedText = transaction.startState.doc.sliceString(fromA, toA);
    const currentLineText = state.doc.lineAt(fromA).text;
    if (toB === state.doc.length)
      return;
    const nextLine = state.doc.lineAt(toB + 1);
    if (deletedText.includes("\n") || currentLineText.trim() === "") {
      const [_, textWithoutBracketsNext, __] = extractBracketsAndText(nextLine.text);
      const patternTypeNextLine = identifyPattern(textWithoutBracketsNext);
      if (patternTypeNextLine) {
        const prevLine = state.doc.lineAt(fromA - 1);
        const [bracketLeftPrev, textWithoutBracketsPrev, bracketRightPrev] = extractBracketsAndText(prevLine.text);
        const patternTypePrevLine = identifyPattern(textWithoutBracketsPrev || "");
        let lineNumber = nextLine.number;
        let currentNumber = patternTypePrevLine && deletedText.includes("\n") ? extractNumber(textWithoutBracketsPrev, patternTypePrevLine) : 0;
        while (lineNumber <= state.doc.lines) {
          const line = state.doc.line(lineNumber);
          const [bracketLeft, textWithoutBrackets, bracketRight] = extractBracketsAndText(line.text);
          const linePatternType = identifyPattern(textWithoutBrackets);
          if (linePatternType === null)
            break;
          if (linePatternType) {
            const targetNumberText = currentNumber.toString();
            const currentNumberText = extractNumber(textWithoutBrackets, linePatternType).toString();
            const newNumberText = getNextNumber(targetNumberText, "", linePatternType);
            if (newNumberText) {
              const updatedText = `${bracketLeft}${newNumberText}${bracketRight}${textWithoutBrackets.slice(currentNumberText.length)}`;
              changes.push({ from: line.from, to: line.to, insert: updatedText });
            }
            currentNumber++;
          }
          lineNumber++;
        }
      }
    }
  });
  return changes;
}
function updateLineNumbers(startLine, state, currentNumber, patternType, hasBrackets) {
  const changes = [];
  let lineNumber = startLine;
  while (lineNumber <= state.doc.lines) {
    const line = state.doc.line(lineNumber);
    const [bracketLeft, textWithoutBrackets, bracketRight] = extractBracketsAndText(line.text);
    const linePatternType = identifyPattern(textWithoutBrackets);
    if (hasBrackets && bracketLeft === "" || !hasBrackets && bracketLeft !== "")
      break;
    if (linePatternType === null)
      break;
    if (linePatternType === patternType) {
      const targetNumberText = currentNumber.toString();
      const currentNumberText = extractNumber(textWithoutBrackets, linePatternType).toString();
      const newNumberText = getNextNumber(targetNumberText, "", linePatternType);
      if (newNumberText) {
        const updatedText = `${bracketLeft}${newNumberText}${bracketRight}${textWithoutBrackets.slice(currentNumberText.length)}`;
        changes.push({ from: line.from, to: line.to, insert: updatedText });
      }
      currentNumber++;
    }
    lineNumber++;
  }
  return changes;
}
function extractNumber(lineText, patternType) {
  const match = lineText.match(/^[\w\u4e00-\u9fa5]+/);
  if (match) {
    switch (patternType) {
      case "arabic":
        return parseInt(match[0]);
      case "uppercaseLetter":
      case "lowercaseLetter":
        return match[0].charCodeAt(0);
      case "romanNumeral":
        return romanToArabic(match[0]);
      case "chineseNumeral":
        return chineseToArabic(match[0]);
      default:
        return 1;
    }
  }
  return 1;
}
function checkForEnter(transaction, state) {
  const changes = [];
  let firstChanges = [];
  transaction.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    var _a, _b, _c, _d;
    let text = inserted.toString();
    if (text.includes("\n")) {
      const currentLineStart = state.doc.lineAt(fromA).from;
      const currentLineEnd = state.doc.lineAt(fromA).to;
      const behindLineStart = state.doc.lineAt(toB).from;
      const behindLineEnd = state.doc.lineAt(toB).to;
      const behindLineText = state.doc.sliceString(behindLineStart, behindLineEnd);
      const currentLineText = state.doc.sliceString(currentLineStart, currentLineEnd);
      if (currentLineText.trim() === "")
        return;
      if (currentLineText.trim().includes(" "))
        return;
      const reg = /^([\(\[\【\（])?([^\）\]\】\)]*)([\）\]\】\)])?([\.、](.*))/;
      let bracketPattern = new RegExp(reg, "gm");
      const bracketMatch = bracketPattern.exec(currentLineText);
      const hasBrackets = bracketMatch !== null && bracketMatch[3] != void 0;
      const textWithoutBrackets = hasBrackets ? currentLineText.replace(bracketPattern, "$2$4") : currentLineText;
      let pattern = identifyPattern(textWithoutBrackets);
      if (pattern === null)
        return;
      if (((_b = (_a = new RegExp(reg, "gm").exec(currentLineText)) == null ? void 0 : _a[5]) == null ? void 0 : _b.trim()) === "" && behindLineText.trim() === "") {
        const removePosStart = state.doc.lineAt(fromA).from;
        const removePosEnd = state.doc.lineAt(fromA).to + 1;
        const tChanges = { from: removePosStart, to: removePosEnd, insert: "" };
        changes.push(tChanges);
        const currentLineNumber = state.doc.lineAt(fromA).number;
        if (pattern) {
          const updatedChanges = updateLineNumbers(currentLineNumber + 2, state, 0, pattern, hasBrackets);
          changes.push(...updatedChanges);
          firstChanges.push(tChanges);
        }
        return;
      }
      if (pattern === "arabic" && !hasBrackets && new RegExp(/^\d+[\.]/).test(textWithoutBrackets))
        return;
      if (pattern) {
        const currentNumber = (_c = textWithoutBrackets.match(/^[\w\u4e00-\u9fa5]+/)) == null ? void 0 : _c[0];
        const punctuation = ((_d = textWithoutBrackets.match(/^[\w\u4e00-\u9fa5]+[\.\、]/)) == null ? void 0 : _d[0].slice(-1)) || ".";
        if (!currentNumber)
          return;
        let nextNumber = getNextNumber(currentNumber, punctuation, pattern);
        if (nextNumber !== null) {
          nextNumber = hasBrackets && bracketMatch[1] !== void 0 ? bracketMatch[1] + nextNumber.slice(0, -1) + bracketMatch[3] + nextNumber.slice(-1) : nextNumber;
          const insertPosition = state.doc.lineAt(toB).from;
          const tChanges = {
            from: insertPosition,
            to: insertPosition,
            insert: nextNumber + (punctuation === "\u3001" ? "" : " ")
          };
          const currentLineNumber = state.doc.lineAt(fromA).number;
          const updatedChanges = updateLineNumbers(currentLineNumber + 2, state, parseInt(nextNumber), pattern, hasBrackets);
          changes.push(tChanges, ...updatedChanges);
          firstChanges.push(tChanges);
        }
      }
    }
  });
  return {
    changes,
    firstChanges
  };
}
var enterPressPlugin = () => {
  return import_view.ViewPlugin.fromClass(class {
    update(update) {
      if (!update.docChanged)
        return;
      if (update.transactions.some((tr) => tr.annotation(import_state.Transaction.userEvent) === "undo" || tr.annotation(import_state.Transaction.userEvent) === "redo" || tr.annotation(import_state.Transaction.userEvent) === "plugin-update" || tr.annotation(import_state.Transaction.userEvent) === "set"))
        return;
      if (update.docChanged) {
        if (update.transactions.some((tr) => {
          var _a;
          return (_a = tr.annotation(import_state.Transaction.userEvent)) == null ? void 0 : _a.contains("delete");
        })) {
          update.transactions.forEach((tr) => {
            if (tr.docChanged) {
              const forDeleteChanges = handleDelete(update.transactions[0], update.view.state);
              if (forDeleteChanges.length === 0)
                return;
              setTimeout(() => {
                const tr2 = update.view.state.update({
                  changes: import_state.ChangeSet.of(forDeleteChanges, update.view.state.doc.length)
                });
                update.view.dispatch(tr2);
              });
            }
          });
          return;
        }
        update.transactions.forEach((tr) => {
          if (tr.docChanged) {
            const forEnterChanges = checkForEnter(tr, update.view.state);
            if (forEnterChanges.changes.length === 0)
              return;
            if (forEnterChanges.changes.length > 0) {
              setTimeout(() => {
                const newCursorPosition = calculateNewCursorPosition(forEnterChanges.firstChanges, update.view.state);
                const tr2 = update.view.state.update({
                  changes: import_state.ChangeSet.of(forEnterChanges.changes, update.view.state.doc.length),
                  selection: import_state.EditorSelection.cursor(newCursorPosition)
                });
                update.view.dispatch(tr2);
              });
            }
          }
        });
      }
    }
  });
};

// src/betterOrderList.ts
var BetterOrderListPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.app.workspace.onLayoutReady(() => {
      this.registerEditorExtension(enterPressPlugin());
    });
  }
  onunload() {
  }
};

/* nosourcemap */
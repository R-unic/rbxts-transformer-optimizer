import ts from "typescript";

import { f } from "../../utility/factory";
import { analyzeVariableDeclaration } from "./analyzeVariableDeclaration";
import type { AnalysisState } from "../../classes/analysisState";

export function analyzeVariableDeclarationList(state: AnalysisState, node: ts.VariableDeclarationList): ts.VariableDeclarationList | undefined {
  const declarations: ts.VariableDeclaration[] = [];
  for (const declaration of node.declarations) {
    const analyzedDeclaration = analyzeVariableDeclaration(state, declaration);
    if (analyzedDeclaration === undefined) continue;
    declarations.push(analyzedDeclaration);
  }

  return declarations.length === 0 ? undefined : f.update.variableDeclarationList(node, declarations);
}
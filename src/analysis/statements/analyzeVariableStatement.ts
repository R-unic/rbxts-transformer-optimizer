import ts from "typescript";

import { f } from "../../utility/factory";
import { analyzeVariableDeclarationList } from "./analyzeVariableDeclarationList";
import type { AnalysisState } from "../../classes/analysisState";

export function analyzeVariableStatement(state: AnalysisState, node: ts.VariableStatement): ts.VariableStatement | undefined {
  const analyzedDeclarationList = analyzeVariableDeclarationList(state, node.declarationList);
  return analyzedDeclarationList !== undefined ? f.update.variableStatement(node, analyzedDeclarationList) : undefined;
}
import ts from "typescript";

import { f } from "../../utility/factory";
import { analyzeExpression } from "../analyzeExpression";
import type { AnalysisState } from "../../classes/analysisState";

export function analyzeVariableDeclaration(state: AnalysisState, node: ts.VariableDeclaration): ts.VariableDeclaration | undefined {
  const initializer = node.initializer ? analyzeExpression(state, node.initializer) : undefined;
  const isConstExpr = f.is.constExpr(initializer);
  if (isConstExpr) {
    const constExprMap = state.getConstExprMap();
    const name = node.name.getText();
    constExprMap.set(name, initializer);
  }

  return isConstExpr ? undefined : node;
}
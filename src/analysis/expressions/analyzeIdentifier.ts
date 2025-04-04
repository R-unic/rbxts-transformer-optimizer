import ts from "typescript";
import { AnalysisState } from "../../classes/analysisState";

export function analyzeIdentifier(state: AnalysisState, node: ts.Identifier): ts.Expression {
  const constExprMap = state.getConstExprMap();
  const name = node.getText();
  const constExpr = constExprMap.get(name);
  return constExpr ? constExpr : node;
}
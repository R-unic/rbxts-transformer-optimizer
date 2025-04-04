import ts from "typescript";

import { catchDiagnostic } from "../utility/diagnostics";
import type { AnalysisState } from "../classes/analysisState";

const ANALYZERS = new Map<ts.SyntaxKind, (state: AnalysisState, node: any) => ts.Expression>([

]);

export function analyzeExpression(state: AnalysisState, expression: ts.Expression): ts.Expression {
  return catchDiagnostic(expression, () => {
    const analyzer = ANALYZERS.get(expression.kind);
    return analyzer
      ? analyzer(state, expression)
      : state.analyzeChildren(expression);
  });
}
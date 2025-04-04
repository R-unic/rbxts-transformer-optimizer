import ts from "typescript";

import { catchDiagnostic } from "../utility/diagnostics";
import { getNodeList } from "../utility/functions";
import type { AnalysisState } from "../classes/analysisState";

const ANALYZERS = new Map<ts.SyntaxKind, (state: AnalysisState, node: ts.Statement) => ts.Statement | ts.Statement[]>([

]);

export function analyzeStatement(state: AnalysisState, statement: ts.Statement): ts.Statement | ts.Statement[] {
  return catchDiagnostic<ts.Statement | ts.Statement[]>(statement, () => {
    let node: ts.Statement | ts.Statement[];
    const analyzer = ANALYZERS.get(statement.kind);
    node = analyzer
      ? analyzer(state, statement)
      : state.analyzeChildren(statement);

    return getNodeList(node);
  });
}
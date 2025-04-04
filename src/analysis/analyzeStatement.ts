import ts from "typescript";

import { catchDiagnostic } from "../utility/diagnostics";
import { getNodeList } from "../utility/functions";
import { analyzeVariableDeclaration } from "./statements/analyzeVariableDeclaration";
import { analyzeVariableDeclarationList } from "./statements/analyzeVariableDeclarationList";
import { analyzeVariableStatement } from "./statements/analyzeVariableStatement";
import type { AnalysisState } from "../classes/analysisState";

const ANALYZERS = new Map<ts.SyntaxKind, (state: AnalysisState, node: any) => any | any[]>([
  [ts.SyntaxKind.VariableDeclaration, analyzeVariableDeclaration],
  [ts.SyntaxKind.VariableDeclarationList, analyzeVariableDeclarationList],
  [ts.SyntaxKind.VariableStatement, analyzeVariableStatement],
]);

export function analyzeStatement(state: AnalysisState, statement: ts.Statement): ts.Statement | ts.Statement[] {
  return catchDiagnostic<ts.Statement | ts.Statement[]>(statement, () => {
    let node: ts.Statement | ts.Statement[];
    const analyzer = ANALYZERS.get(statement.kind);
    node = analyzer
      ? analyzer(state, statement)
      : state.analyzeChildren(statement);

    return node !== undefined ? getNodeList(node) : [];
  });
}
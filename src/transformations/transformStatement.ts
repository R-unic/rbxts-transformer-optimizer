import ts from "typescript";

import { catchDiagnostic } from "../utility/diagnostics";
import { getNodeList } from "../utility/functions";
import { TransformState } from "../classes/transformState";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSFORMERS = new Map<ts.SyntaxKind, (node: any) => ts.Statement | ts.Statement[]>([
  // [ts.SyntaxKind.ClassDeclaration, transformClassDeclaration],
]);

export function transformStatement(state: TransformState, statement: ts.Statement): ts.Statement | ts.Statement[] {
  return catchDiagnostic<ts.Statement | ts.Statement[]>(statement, () => {
    let node: ts.Statement | ts.Statement[];
    const transformer = TRANSFORMERS.get(statement.kind);
    node = transformer
      ? transformer(statement)
      : state.transformChildren(statement);

    return getNodeList(node);
  });
}
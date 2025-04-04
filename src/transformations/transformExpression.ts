import ts from "typescript";

import { catchDiagnostic } from "../utility/diagnostics";
import { transformBinaryExpression } from "./expressions/transformBinaryExpression";
import type { TransformState } from "../classes/transformState";

const TRANSFORMERS = new Map<ts.SyntaxKind, (state: TransformState, node: any) => ts.Expression>([
  [ts.SyntaxKind.BinaryExpression, transformBinaryExpression],
]);

export function transformExpression(state: TransformState, expression: ts.Expression): ts.Expression {
  return catchDiagnostic(expression, () => {
    const transformer = TRANSFORMERS.get(expression.kind);
    return transformer
      ? transformer(state, expression)
      : state.transformChildren(expression);
  });
}
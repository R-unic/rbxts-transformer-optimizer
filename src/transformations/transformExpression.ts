import ts from "typescript";

import { catchDiagnostic } from "../utility/diagnostics";
import { transformParenthesizedExpression } from "./expressions/transformParenthesizedExpression.ts";
import { transformBinaryExpression } from "./expressions/transformBinaryExpression";
import { transformPrefixUnaryExpression } from "./expressions/transformPrefixUnaryExpression";
import type { TransformState } from "../classes/transformState";

const TRANSFORMERS = new Map<ts.SyntaxKind, (state: TransformState, node: any) => ts.Expression>([
  [ts.SyntaxKind.ParenthesizedExpression, transformParenthesizedExpression],
  [ts.SyntaxKind.BinaryExpression, transformBinaryExpression],
  [ts.SyntaxKind.PrefixUnaryExpression, transformPrefixUnaryExpression],
]);

export function transformExpression(state: TransformState, expression: ts.Expression): ts.Expression {
  return catchDiagnostic(expression, () => {
    const transformer = TRANSFORMERS.get(expression.kind);
    return transformer
      ? transformer(state, expression)
      : state.transformChildren(expression);
  });
}
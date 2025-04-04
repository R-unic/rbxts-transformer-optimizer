import ts from "typescript";

import { f } from "../../utility/factory";
import { transformExpression } from "../transformExpression";
import type { TransformState } from "../../classes/transformState";

const ARITHMETIC_OPERATIONS = new Map<ts.SyntaxKind, (n: number) => number>([
  [ts.SyntaxKind.TildeToken, n => ~n],
]);

export function transformPrefixUnaryExpression(state: TransformState, node: ts.PrefixUnaryExpression): ts.Expression {
  const operand = transformExpression(state, node.operand);

  if (!f.is.validLiteral(operand))
    return state.transformChildren(node);

  if (f.is.bool(operand)) {
    const a = operand.kind === ts.SyntaxKind.TrueKeyword ? true : false;
    return node.operator === ts.SyntaxKind.ExclamationToken
      ? f.bool(!a)
      : state.transformChildren(node);
  }

  if (
    !Number.isNaN(operand.text)
    && ARITHMETIC_OPERATIONS.has(node.operator)
  ) {
    const operation = ARITHMETIC_OPERATIONS.get(node.operator)!;
    return f.number(operation(Number(operand.text)));
  }

  return state.transformChildren(node);
}
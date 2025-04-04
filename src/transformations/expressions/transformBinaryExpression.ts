import ts from "typescript";

import { f } from "../../utility/factory";
import { transformExpression } from "../transformExpression";
import type { TransformState } from "../../classes/transformState";

const ARITHMETIC_OPERATIONS = new Map<ts.SyntaxKind, (a: number, b: number) => number>([
  [ts.SyntaxKind.PlusToken, (a, b) => a + b],
  [ts.SyntaxKind.MinusToken, (a, b) => a - b],
  [ts.SyntaxKind.AsteriskToken, (a, b) => a * b],
  [ts.SyntaxKind.SlashToken, (a, b) => a / b],
  [ts.SyntaxKind.PercentToken, (a, b) => a % b],
  [ts.SyntaxKind.AsteriskAsteriskToken, (a, b) => a ** b],
  [ts.SyntaxKind.CaretToken, (a, b) => a ^ b],
  [ts.SyntaxKind.BarToken, (a, b) => a | b],
  [ts.SyntaxKind.AmpersandToken, (a, b) => a & b]
]);

export function transformBinaryExpression(state: TransformState, node: ts.BinaryExpression): ts.Expression {
  const left = transformExpression(state, node.left);
  const right = transformExpression(state, node.right);
  if (!f.is.foldableLiteral(left) || !f.is.foldableLiteral(right))
    return state.transformChildren(node);

  if (f.is.bool(left) && f.is.bool(right)) {
    const a = left.kind === ts.SyntaxKind.TrueKeyword ? true : false;
    const b = right.kind === ts.SyntaxKind.TrueKeyword ? true : false;
    const result = node.operatorToken.kind === ts.SyntaxKind.BarBarToken
      ? a || b
      : a && b;

    return f.bool(result);
  }

  if (
    f.is.number(left)
    && f.is.number(right)
    && ARITHMETIC_OPERATIONS.has(node.operatorToken.kind)
  ) {
    const operation = ARITHMETIC_OPERATIONS.get(node.operatorToken.kind)!;
    const a = Number(left.text);
    const b = Number(right.text);
    return f.number(operation(a, b));
  }

  const isConcatenation = f.is.string(left) || f.is.string(node.right);
  if (node.operatorToken.kind === ts.SyntaxKind.PlusToken && isConcatenation) {
    const a = f.literalIntoString(left);
    const b = f.literalIntoString(right);
    return f.string(a + b);
  }

  return state.transformChildren(node);
}
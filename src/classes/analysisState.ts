import ts from "typescript";

import { analyzeNode } from "../analysis/analyzeNode";
import type { TransformerConfig } from "./transformState";

export class AnalysisState {
  private readonly constExprs: Map<string, ts.Expression>[] = [new Map];
  private scopeLevel = 0;

  public constructor(
    public readonly program: ts.Program,
    public readonly context: ts.TransformationContext,
    public readonly config: TransformerConfig
  ) { }

  /**
   * Analyzes the children of the specified node.
   */
  public analyzeChildren<T extends ts.Node>(node: T): T {
    return ts.visitEachChild(node, newNode => analyzeNode(this, newNode), this.context);
  }

  public getConstExprMap(offset = 0): Map<string, ts.Expression> {
    return this.constExprs[Math.max(this.scopeLevel - offset, 0)] ?? this.getConstExprMap(offset + 1);
  }

  public beginScope(): void {
    this.scopeLevel++;
  }

  public endScope(): void {
    this.scopeLevel--;
  }
}
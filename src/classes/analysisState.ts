import ts from "typescript";

import { analyzeNode } from "../analysis/analyzeNode";
import type { TransformerConfig } from "./transformState";

export class AnalysisState {
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
}
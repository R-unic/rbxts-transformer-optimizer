import ts from "typescript";

import { transformNode } from "../transformations/transformNode";

/**
 * This is the transformer's configuration, the values are passed from the tsconfig.
 */
export interface TransformerConfig {

}

export class TransformState {
  public readonly factory: ts.NodeFactory;

  public constructor(
    public readonly program: ts.Program,
    public readonly context: ts.TransformationContext,
    public readonly config: TransformerConfig,
  ) {
    this.factory = context.factory;
  }

  /**
   * Transforms the children of the specified node.
   */
  public transformChildren<T extends ts.Node>(node: T): T {
    return ts.visitEachChild(node, newNode => transformNode(this, newNode), this.context);
  }
}
import ts from "typescript";

import { transformFile } from "./transformations/transformFile";
import { TransformState, type TransformerConfig } from "./classes/transformState";

/**
 * The transformer entry point.
 * This provides access to necessary resources and the user specified configuration.
 */
export default function (program: ts.Program, config: TransformerConfig) {
  return (transformationContext: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
    const state = new TransformState(program, transformationContext, config);
    return file => transformFile(state, file);
  };
}
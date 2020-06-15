import * as path from 'path';
import {
  CompilerOptions,
  createExportSpecifier,
  createNamedExports,
  createProgram,
  Diagnostic,
  ExportDeclaration,
  ExportSpecifier,
  formatDiagnostics,
  FormatDiagnosticsHost,
  isExportDeclaration,
  Node,
  parseJsonConfigFileContent,
  readConfigFile,
  SourceFile,
  SymbolFlags,
  SyntaxKind,
  sys,
  TransformationContext,
  TransformerFactory,
  TypeChecker,
  updateExportDeclaration,
  visitEachChild,
  visitNode,
  Visitor,
  VisitResult,
} from 'typescript';

const BUILD_TSCONFIG = 'tsconfig-lib.json';
const BUILD_ENTRY = 'src/index.ts';
const ROOT_DIR = path.resolve(__dirname, '..');

const compilerOpts = readCompilerOptions(BUILD_TSCONFIG, ROOT_DIR);
const program = createProgram([BUILD_ENTRY], compilerOpts);
const typeChecker = program.getTypeChecker();

const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, false, {
  before: [],
  after: [exportStarTransformer(typeChecker)],
});

if (emitSkipped) {
  throw Error(diagnostics.map((diagnostic) => diagnostic.messageText).join('\n'));
}

function exportStarTransformer(typeChecker: TypeChecker): TransformerFactory<SourceFile> {
  /**
   * Checks whether a node is an export declaration like `export * from './module'`
   */
  function isExportStar(node: Node) {
    return (
      isExportDeclaration(node) &&
      node.exportClause === undefined &&
      node.getChildren().some((n) => n.kind === SyntaxKind.AsteriskToken)
    );
  }

  /**
   * Gets concrete exports from an export declaration like `export * from './module'`
   */
  function getConcreteNamedExportsForExportStar(exportDeclaration: ExportDeclaration) {
    if (exportDeclaration.moduleSpecifier === undefined) {
      return [];
    }

    const moduleSpecSymbol = typeChecker.getSymbolAtLocation(exportDeclaration.moduleSpecifier);

    if (moduleSpecSymbol === undefined) {
      return [];
    }

    const localExports = typeChecker.getExportsOfModule(moduleSpecSymbol);

    return localExports.reduce<ExportSpecifier[]>((acc, s) => {
      const name = s.getName();
      let exportSymbol = typeChecker.getExportSymbolOfSymbol(s);

      // tslint:disable-next-line:strict-boolean-expressions
      if (exportSymbol.getFlags() & (SymbolFlags.Alias | SymbolFlags.TypeAlias)) {
        exportSymbol = typeChecker.getAliasedSymbol(exportSymbol);
      }

      // tslint:disable-next-line:strict-boolean-expressions
      return exportSymbol.getFlags() & SymbolFlags.Value
        ? acc.concat(createExportSpecifier(undefined, name))
        : acc;
    }, []);
  }

  function visitor(ctx: TransformationContext): Visitor {
    function nodeVisitor<T extends Node>(node: T): VisitResult<T> {
      if (isExportStar(node)) {
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const exportDeclaration = (node as Node) as ExportDeclaration;
        const exportSpecifiers = getConcreteNamedExportsForExportStar(exportDeclaration);
        const namedExports = createNamedExports(exportSpecifiers);
        // tslint:disable-next-line:no-unnecessary-type-assertion
        return (updateExportDeclaration(
          exportDeclaration,
          undefined,
          undefined,
          namedExports,
          exportDeclaration.moduleSpecifier
        ) as Node) as T;
      }

      return visitEachChild(node, nodeVisitor, ctx);
    }
    return nodeVisitor;
  }

  return (ctx: TransformationContext) => (sf: SourceFile): SourceFile =>
    visitNode(sf, visitor(ctx));
}

function formatTsDiagnostics(errors: Diagnostic[]): string {
  const defaultFormatHost: FormatDiagnosticsHost = {
    getCurrentDirectory: () => sys.getCurrentDirectory(),
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => sys.newLine,
  };

  return formatDiagnostics(errors, defaultFormatHost);
}

function readCompilerOptions(configPath: string, rootDir: string): CompilerOptions {
  const resolvedConfigPath = path.resolve(rootDir, configPath);
  const { config, error } = readConfigFile(resolvedConfigPath, sys.readFile);

  if (error !== undefined) {
    throw error;
  }

  const { errors, options } = parseJsonConfigFileContent(config, sys, path.resolve(rootDir));

  if (errors.length > 0) {
    const formattedErrors = formatTsDiagnostics(errors);
    throw new Error(
      `Error occurred while attempting to read from ${resolvedConfigPath}: ${formattedErrors}`
    );
  }

  return options;
}

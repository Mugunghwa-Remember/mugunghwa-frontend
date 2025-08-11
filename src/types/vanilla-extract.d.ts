/// <reference types="@vanilla-extract/css" />

declare module "*.css.ts" {
  const styles: Record<string, string>;
  export = styles;
}

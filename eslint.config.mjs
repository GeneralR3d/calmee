import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([...nextVitals, ...nextTs, { files: ["app/layout.tsx"], rules: { "@next/next/no-page-custom-font": "off" } }, { rules: { "@next/next/no-img-element": "off", "react-hooks/set-state-in-effect": "off" } }, globalIgnores([".next/**", "public/**", "lib/intro-animation.js", "lib/analytics.js", "calme-custom-pixel.js", "next-env.d.ts", "test-results/**", "playwright-report/**"])]);

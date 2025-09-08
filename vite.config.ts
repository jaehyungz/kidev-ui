// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import path, { resolve } from "path";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },

//   build: {
//     lib: {
//       entry: resolve(__dirname, "src/index.ts"), // 라이브러리 진입점
//       name: "MyDesignSystem", // UMD 빌드에서 사용될 전역 변수 이름
//       fileName: (format) => `kidev-ui.${format}.js`,
//     },
//     rollupOptions: {
//       // 라이브러리에 포함시키지 않고, 사용하는 쪽에서 설치하도록 할 모듈 (예: React)
//       external: ["react", "react-dom"],
//       output: {
//         // external로 지정된 모듈들의 전역 변수 이름을 지정
//         globals: {
//           react: "React",
//           "react-dom": "ReactDOM",
//         },
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
// import path from 'node:path';
// import tailwindcssPostCss from '@tailwindcss/postcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["lib"],
      insertTypesEntry: true,
      tsconfigPath: "tsconfig.app.json",
    }),
    tailwindcss(),
  ],
  // css: {
  //   postcss: {
  //     plugins: [tailwindcssPostCss()],
  //   },
  // },
  // logLevel: 'error',
  build: {
    commonjsOptions: {
      esmExternals: true,
      transformMixedEsModules: true,
    },
    sourcemap: "hidden",
    copyPublicDir: true,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
      cssFileName: "kidev-ui",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],
      treeshake: {
        preset: "recommended",
        moduleSideEffects: "no-external",
      },
      input: Object.fromEntries(
        glob
          .sync("lib/**/*.{ts,tsx}")
          .map((file) => [
            relative("lib", file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        exports: "named",
        entryFileNames: "[name].js",
        banner: (chunkInfo) => {
          if (
            ["index.ts"].find((modulePath) =>
              chunkInfo.facadeModuleId?.endsWith(modulePath)
            )
          ) {
            return `"use client"`;
          }
          return "";
        },
      },
    },
    ssr: true,
    ssrManifest: true,
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './lib'),
  //   },
  //   extensions: ['.mjs', '.mdx', '.mts', '.js', '.ts', '.jsx', '.tsx', '.d.ts'],
  // },
});

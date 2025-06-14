import {ExternalOption, GlobalsOption, RollupOptions} from "rollup";

import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import {dts} from 'rollup-plugin-dts'
import alias from "@rollup/plugin-alias";
import licence from "rollup-plugin-license"
import path from 'path'

import pkg from './package.json';


const distFolder = `dist/v${pkg.version}`;

function varConfig(input: string, filepath: string, name?: string, external?: ExternalOption, globals?: GlobalsOption): RollupOptions {
  return {
    external,
    input,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        module: "esnext",
        target: "es5",
      })
    ],
    output: [
      {
        globals,
        file: filepath,
        format: 'iife',
        name,
        plugins: [
          terser({
            format: {
              comments: false,
              beautify: true,
            },
            compress: false,
            mangle: false
          }),
          licence({
            banner: {
              commentStyle: "ignored",
              content: {
                file: path.join(__dirname, ".banner")
              }
            }
          })
        ]
      },
      {
        globals,
        file: filepath.replace(".js", ".min.js"),
        format: 'iife',
        name,
        plugins: [
          terser(),
          licence({
            banner: {
              commentStyle: "ignored",
              content: {
                file: path.join(__dirname, ".banner")
              }
            }
          })
        ]
      }
    ]
  }
}

export default [
  varConfig("src/index.ts", `${distFolder}/feeddy.js`, 'feeddy'),
  varConfig("src/polyfied.ts", `${distFolder}/feeddy.poly.js`, "feeddy"),
  {
    input: `src/typing.ts`,
    plugins: [
      alias({
        entries: [
          {
            find: '@jstls',
            replacement: path.resolve("./lib/jstls/src")
          },
          {
            find: "@feeddy",
            replacement: path.resolve("./src")
          }
        ]
      }),
      dts()
    ],
    output: {
      file: `${distFolder}/feeddy.d.ts`,
      name: 'feeddy',
      format: 'iife',
    },
  },
]

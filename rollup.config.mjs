import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import {dts} from 'rollup-plugin-dts'

import pkg from './package.json' with { type: 'json' };

const distFolder = `dist/v${pkg.version}`

function varConfig(input, path, name, external, globals) {
  return {
    external,
    input,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        module: "esnext",
        target: "es5",
        removeComments: true,
      }),
    ],
    output: [
      {
        globals,
        file: path,
        format: 'iife',
        name,
      },
      {
        globals,
        file: path.replace(".js", ".min.js"),
        format: 'iife',
        name,
        plugins: [
          terser()
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
      dts()
    ],
    output: {
      file: `${distFolder}/feeddy.d.ts`,
      name: 'feeddy',
      format: 'iife',
    },
  },
]

import typescript from '@rollup/plugin-typescript';

// to fetch all files from the test directory
import multi from '@rollup/plugin-multi-entry';

import { nodeResolve } from '@rollup/plugin-node-resolve';

// convert commonjs to es6 so they can be include in rollup bundles
// at least required by corba.js
import commonjs from '@rollup/plugin-commonjs';

// import nodeResolve from 'rollup-plugin-node-resolve';
// import globals from 'rollup-plugin-node-globals';
// import builtins from 'rollup-plugin-node-builtins';

export default {
    input: [
        '../test/ui/**/script.ts',
        '../test/ui/main.ts'
    ],
    output: {
      file: './js/unittest.js',
      name: 'unittest',
      format: 'iife', // umd, es, 
      sourcemap: true
    },
    plugins: [
        typescript({
            tsconfig: false,
            include: [
                "src/client/**/*.ts",
                "src/shared/**/*.ts",
            ],
            baseUrl: "./src",
            lib: ["es6", "es2017.object", "dom"],
            target: "es6",
            strict: true,
            allowJs: false,
            noImplicitAny: true,
            sourceMap: true 
        }),
        nodeResolve(),
        commonjs(),
        multi()
    ]
}

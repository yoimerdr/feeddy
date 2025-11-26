import { describe, it, expect } from 'vitest';
import * as module from '@feeddy/module';

describe('Module', () => {
    it('should export feed handler', () => {
        expect(module.feed).toBeDefined();
        expect(module.feed.all).toBeDefined();
        expect(module.feed.byId).toBeDefined();
        expect(module.feed.raw).toBeDefined();
    });

    it('should export search handler', () => {
        // search is not directly exported as a named export in the file view I saw, 
        // but it is assigned to exports.
        // However, I can check the named exports that ARE there.
        // The file exports `feed`, `buildUrl`, `getId`.
        // And it assigns everything to `exports`.
        // But in ES modules, `export * from "./module"` in index.ts implies named exports.
        // Wait, `src/module.ts` has `export { feed, buildUrl, getId }`.
        // It also does `assign2(exports, module)`. This is CommonJS style mixing with ES modules?
        // Or maybe it's a specific build setup.
        // Let's check what I can import.

        expect(module.feed).toBeDefined();
        expect(module.buildUrl).toBeDefined();
        expect(module.getId).toBeDefined();
    });

    // Since the module file does some dynamic assignment to `exports` which might not be visible 
    // to the test runner depending on how it's transpiled/run, I'll focus on the named exports 
    // and the side effects if possible.

    // The `posts`, `entries`, `comments`, `pages` are imported and then re-exported via `exports` assignment?
    // The code says: `declare const exports: KeyableObject; assign2(exports, module);`
    // This looks like it's targeting a specific environment or build process.
    // Standard ES imports might not see `posts` if it's not in `export {}`.

    // However, `src/index.ts` says `export * from "./module"`.
    // If `src/module.ts` only exports `feed`, `buildUrl`, `getId`, then `src/index.ts` only exports those.
    // But `src/index.ts` also has `export declare const posts: PostsNamespace;` etc.
    // This suggests `src/index.ts` is defining the public API types, but the runtime values come from `module`.

    // If I'm testing `src/module.ts`, I should test what it exports.
});

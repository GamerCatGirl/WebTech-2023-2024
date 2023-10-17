import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    test: {
        env: {
            DATABASE_URL: "test/sqlite.db",
        },
        include: ["test/**/*.ts"],
        exclude: ["test/data.ts"],
    },
});

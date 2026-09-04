import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setPublicDir("public");
Config.setEntryPoint("src/remotion/index.ts");
Config.setChromiumOpenGlRenderer("angle");

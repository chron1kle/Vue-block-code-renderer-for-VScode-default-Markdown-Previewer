const fs = require("fs");
const path = require("path");

const themes =
    JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../src/themes.json"
            ),
            "utf8"
        )
    );

const packagePath =
    path.join(
        __dirname,
        "../package.json"
    );

const packageJson =
    JSON.parse(
        fs.readFileSync(
            packagePath,
            "utf8"
        )
    );

packageJson.contributes
    .configuration
    .properties[
    "vueMarkdownPreview.fallbackTheme"
]
    .enum = themes;

fs.writeFileSync(
    packagePath,
    JSON.stringify(
        packageJson,
        null,
        2
    )
);

console.log(
    "Theme enum updated."
);
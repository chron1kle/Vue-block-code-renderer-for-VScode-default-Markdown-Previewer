import * as vscode from "vscode";
import themes from "./themes.json";

const SUPPORTED_THEMES =
	themes as string[];

function resolveTheme() {

	const config =
		vscode.workspace.getConfiguration(
			"vueMarkdownPreview"
		);

	const customTheme =
		config
			.get<string>(
				"customTheme",
				""
			)
			.trim();

	const fallbackTheme =
		config.get<string>(
			"fallbackTheme",
			"github-dark"
		);

	if (
		customTheme &&
		SUPPORTED_THEMES.includes(
			customTheme
		)
	) {
		return customTheme;
	}

	return fallbackTheme;
}

export async function activate(
	context: vscode.ExtensionContext
) {

	const { createHighlighter } =
		await import("shiki");

	const highlighter =
		await createHighlighter({
			themes: SUPPORTED_THEMES,
			langs: ["vue"]
		});

	return {

		extendMarkdownIt(md: any) {

			const defaultFence =
				md.renderer.rules.fence;

			md.renderer.rules.fence = (
				tokens,
				idx,
				options,
				env,
				self
			) => {

				const token =
					tokens[idx];

				const language =
					token.info
						.trim()
						.toLowerCase();

				if (
					language === "vue"
				) {

					try {

						return highlighter.codeToHtml(
							token.content,
							{
								lang: "vue",
								theme: resolveTheme()
							}
						);

					}
					catch {

						return highlighter.codeToHtml(
							token.content,
							{
								lang: "vue",
								theme: "github-dark"
							}
						);

					}
				}

				return defaultFence(
					tokens,
					idx,
					options,
					env,
					self
				);
			};

			return md;
		}
	};
}
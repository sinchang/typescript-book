import * as prettier from 'prettier';
import * as fs from 'fs';
import { Language, languages } from './i18n';
import { makeFilePath } from './utils';

const PRETTIER_CONFIG_FILE_PATH = './.prettierrc'

const formatCodeBlocksInMarkdownFile = async (filePath: string): Promise<void> => {
    const markdown = await fs.promises.readFile(filePath, 'utf-8');
    const codeBlockRegex = /```typescript([\s\S]*?)```/g;

    let formattedMarkdown = markdown;
    let match;
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
        const codeBlock = match[0];
        const code = match[1].trim();
        const formattedCode = prettier.format(code, {
            parser: 'typescript',
            ...(await prettier.resolveConfig(PRETTIER_CONFIG_FILE_PATH)),
        });
        formattedMarkdown = formattedMarkdown.replace(codeBlock, `\`\`\`typescript\n${formattedCode}\`\`\``);
    }

    await fs.promises.writeFile(filePath, formattedMarkdown, 'utf-8');
    console.log(`Formatted code blocks have been updated in the file: ${filePath}`);
}

for (const item of languages) {
    formatCodeBlocksInMarkdownFile(makeFilePath(item));
}

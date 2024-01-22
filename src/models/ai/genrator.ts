import fs from "fs";
import path from "path";

import { createAzureOpenAILanguageModel, createJsonTranslator } from "fira-board-typechat";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export class Generator<T extends Object> {
    gpt3Model: any;
    gpt4Model: any;

    constructor(schemaPath: string, schemaName: string) {
        const schema = fs.readFileSync(
            path.join(schemaPath),
            "utf8"
        );

        this.gpt3Model = createJsonTranslator<T>(
            createAzureOpenAILanguageModel(process.env.OPENAI_API_KEY || '', process.env.OPENAI_GPT3_MODEL || ''),
            schema,
            schemaName
        );
        this.gpt4Model = createJsonTranslator<T>(
            createAzureOpenAILanguageModel(process.env.OPENAI_API_KEY || '', process.env.OPENAI_GPT4_MODEL || ''),
            schema,
            schemaName
        );
    }

    async call(prompt: String, model: String) {
        let response;

        if (model === "GPT-4")
            response = await this.gpt4Model.translate(prompt);
        else
            response = await this.gpt3Model.translate(prompt);

        if (!response.success) {
            throw new Error(response.message);
        }

        return response;
    }
}
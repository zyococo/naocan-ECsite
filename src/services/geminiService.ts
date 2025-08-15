interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.error("Gemini API key is not configured");
    }
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    try {
      // naocanについてのコンテキストを設定
      const systemPrompt = `あなたはnaocanという花屋のチャットボットです。以下の情報を基に、親切で丁寧に回答してください：

naocanについて：
- 花屋・フラワーショップ
- 仏花、プリザーブドフラワー、ウェディングブーケ、誕生日花束、記念日花束などを取り扱い
- 予約システムで花束の注文を受け付け
- お客様のニーズに合わせた花束の提案が可能

回答の際は：
- 親切で丁寧な口調で
- 花や花言葉に関する質問には専門的な知識を活かして
- 注文や予約についての質問には適切に案内
- わからないことは正直に伝える
- 200文字以内で返答してください
- 花やnaocan以外の情報に関しては答えなくていいです

現在の会話履歴：
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

ユーザーの質問: ${message}`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Response:", errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

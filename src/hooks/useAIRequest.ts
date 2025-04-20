import { useState } from 'react';
import useAddress from './useAddress';

interface AIRequestOptions {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

const useAIRequest = () => {
    const [loading, setLoading] = useState(false);
    const { NewAPiAddress } = useAddress();

  const sendRequest = async (content: any, options: AIRequestOptions = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${NewAPiAddress}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-mw9ekhJlSj3GeGiw0hLRSHlwdkDFst8q6oBfQrW0L15QilbY'
        },
        body: JSON.stringify({
          model: options.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: options.systemPrompt || '你是一个智能助手，请根据用户输入进行分析并给出专业的见解。'
            },
            {
              role: 'user',
              content
            }
          ],
          max_tokens: options.maxTokens || 2000
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendRequest };
};

export default useAIRequest;
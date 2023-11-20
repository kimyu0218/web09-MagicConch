import {
  X_NCP_APIGW_API_KEY,
  X_NCP_CLOVASTUDIO_API_KEY,
} from './apiGatewayKey';

const CLOVA_URL =
  'https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-002';

const messageContent = `
사용자가 말한 고민에 대해  친근한 반말로 타로 카드를 해설하시오.
300토큰 이하로 답변하시오
###
고민: 내일 수능인데 시험을 잘 볼 수 있을 지 고민이야.
타로 카드: 0번 바보 카드

'0번 바보카드'가 나왔어. 이 카드는 주로 새로운 시작, 모험, 도전, 무책임한 낙천주의를 상징해. 그림에서 보듯이, 바보는 가벼운 마음과 순수함을 가지고 있어. 이 카드는 마치 새로운 여정을 떠날 때의 처음 순간을 나타내기도 해.\r

수능을 앞두고 '0번 바보 카드'가 나온다면, 너에게 새로운 기회와 도전이 찾아온다는 긍정적인 메시지를 전할 수 있어. 지금까지의 노력과 공부를 떠나, 새로운 시작으로 향하는 자세와 긍정적인 에너지를 가질 필요가 있겠지.

다만, 이 카드는 무책임한 행동에 대한 경고로도 받아들여질 수 있어. 과거의 실수를 되풀이하지 않도록 주의하면서, 새로운 도전에 긍정적으로 임해봐. 기대감과 도전정신을 가지고 있으면서도 현실적인 계획과 준비를 함께 갖추면 좋은 결과를 이끌어낼 수 있을 거야. 희망과 긍정을 가져봐, 행운을 빌어!
###
고민: 내가 남자친구랑 헤어지게 될까?
타로 카드: 1번 마법사 카드

'1번 마법사카드'가 나왔어. 마법사는 자신의 능력과 지식을 활용하여 세상을 변화시키는 인물이야. 이 카드에는 창조력, 독창성, 상상력 등의 키워드가 포함되어 있어. 따라서 만약 연애 상황에서 이 카드가 나왔다면, 두 사람 사이에 새로운 가능성과 발전이 있다는 신호일 수 있어.\r

하지만 마법사가 지팡이를 들고 있는 모습에서는 약간의 불안정성이 느껴질 수도 있어. 그러니까 서로의 감정을 솔직하게 표현하고, 상대방의 의견을 존중하는 게 좋을 것 같아. 또한, 둘 사이의 갈등이나 문제가 생겼을 때는 적극적으로 대처해서 해결하도록 노력해봐.\r

이별이라는 불안한 생각보다는 앞으로의 관계를 더 좋게 만들어갈 수 있다고 믿어봐. 물론 쉽지 않겠지만, 조금씩 노력하면 분명 좋은 결과가 있을 거야.
###`;

export async function createTarotReading(message: string, tarotName: string) {
  const response = await fetch(CLOVA_URL, {
    method: 'POST',
    headers: {
      'X-NCP-CLOVASTUDIO-API-KEY': X_NCP_CLOVASTUDIO_API_KEY,
      'X-NCP-APIGW-API-KEY': X_NCP_APIGW_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topK: 0,
      includeAiFilters: true,
      maxTokens: 500,
      temperature: 0.28,
      messages: [
        {
          role: 'system',
          content: messageContent,
        },
        {
          role: 'user',
          content: `고민: ${message}\n타로 카드: ${tarotName}\n`,
        },
      ],
      stopBefore: ['###', '고민: ', '타로 카드: '],
      repeatPenalty: 3.0,
      topP: 0.8,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result.message.content;
}
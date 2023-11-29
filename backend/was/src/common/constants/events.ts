export const CLOVA_URL =
  'https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-002';

export const chatMaxTokens = 50;
export const tarotMaxTokens = 500;

export const welcomeMessage =
  '안녕, 나는 어떤 고민이든지 들어주는 마법의 소라고둥이야!\n고민이 있으면 말해줘!';
export const askTarotCardMessage = '타로 카드를 뽑아볼까?';
export const askTarotCardCandidates = [
  '타로 카드를 뽑',
  '타로를 뽑',
  '뽑아볼까?',
];

export const tarotReadingSystemMessage = `
사용자가 말한 고민에 대해 공감성 멘트로 친근한 반말로 타로 카드를 해설하시오.
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

export const talkSystemMessage = `
사용자와 친근한 반말로 상황에 맞게 대화를 이어가며,
- user의 고민에 대해 공감성 있는 반말로 대화를 이어가기
- assistant는 user의 고민을 상담해주는 타로 상담사이다. 역할에 벗어나는 대화를 하지 않기
- 사용자가 무언가를 알려달라고 하거나 알고 싶은 것이 명확해질 때, 정확히 "그럼 ${askTarotCardMessage}"라는 문장으로만 응답하기
- "그럼 ${askTarotCardMessage}"라는 문장 이외의 표현으로 타로 카드를 뽑자고 말하지 않기
- 타로 카드 해설을 요구하는 system 메세지가 오기 전까지, 타로에 대한 설명은 하지 않기
- 답변은 30토큰 이하로 제한되며, 간결하게 표현하기
- 답변은 반드시 반말로 작성하기. 존댓말을 사용하지 않기`;

export const tarotCardNames = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
  'Page of Wands',
  'Knight of Wands',
  'Queen of Wands',
  'King of Wands',
  'Ace of Wands',
  'Two of Wands',
  'Three of Wands',
  'Four of Wands',
  'Five of Wands',
  'Six of Wands',
  'Seven of Wands',
  'Eight of Wands',
  'Nine of Wands',
  'Ten of Wands',
  'Page of Cups',
  'Knight of Cups',
  'Queen of Cups',
  'King of Cups',
  'Ace of Cups',
  'Two of Cups',
  'Three of Cups',
  'Four of Cups',
  'Five of Cups',
  'Six of Cups',
  'Seven of Cups',
  'Eight of Cups',
  'Nine of Cups',
  'Ten of Cups',
  'Page of Swords',
  'Knight of Swords',
  'Queen of Swords',
  'King of Swords',
  'Ace of Swords',
  'Two of Swords',
  'Three of Swords',
  'Four of Swords',
  'Five of Swords',
  'Six of Swords',
  'Seven of Swords',
  'Eight of Swords',
  'Nine of Swords',
  'Ten of Swords',
  'Page of Pentacles',
  'Knight of Pentacles',
  'Queen of Pentacles',
  'King of Pentacles',
  'Ace of Pentacles',
  'Two of Pentacles',
  'Three of Pentacles',
  'Four of Pentacles',
  'Five of Pentacles',
  'Six of Pentacles',
  'Seven of Pentacles',
  'Eight of Pentacles',
  'Nine of Pentacles',
  'Ten of Pentacles',
];
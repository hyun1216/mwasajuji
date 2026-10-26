export interface BurdenInfo {
  score: number;
  badgeText: string;
  description: string;
  levelTitle: string;
}

/**
 * 10만원을 기준(100%)으로 하는 '받는 사람 입장의 품앗이 부담 지수' 계산기
 * - 10만원이 넘어가면 다음 내 생일/기념일에 상대방도 그에 상응하는 10만원대를 돌려줘야 하므로
 *   금액이 높을수록 품앗이 빚(부담감)이 증가합니다.
 */
export function calculateBurden(price: number): BurdenInfo {
  const numPrice = Number(price) || 0;
  // 10만원 기준 (100,000원 = 100%)
  const rawScore = Math.round((numPrice / 100000) * 100);
  const score = Math.min(100, Math.max(5, rawScore));

  if (numPrice < 10000) {
    return {
      score,
      badgeText: `부담지수 ${score}% ☕ 가벼운 한 입 품앗이`,
      levelTitle: '커피·간식급 (안 갚아도 양심 0% 가책)',
      description: '커피 한 잔이나 가벼운 간식 정도라 받는 사람도 나중에 비싼 걸로 되갚아야 한다는 부담이 전혀 없는 평화 지대입니다.',
    };
  }

  if (numPrice < 30000) {
    return {
      score,
      badgeText: `부담지수 ${score}% 🎁 생일 국룰 안전빵 품앗이`,
      levelTitle: '생일선물 국룰급 (서로 편안한 적정선)',
      description: '치킨이나 밥 한 끼 정도의 2030 국룰 예산! 받는 사람도 다음 기념일에 2~3만원대로 기분 좋게 품앗이할 수 있는 골든존입니다.',
    };
  }

  if (numPrice < 50000) {
    return {
      score,
      badgeText: `부담지수 ${score}% 💼 성의 가득 체면 품앗이`,
      levelTitle: '스몰럭셔리급 (상대방도 예산 장전)',
      description: '정성과 성의가 듬뿍 들어간 선물. 상대방도 다음 내 생일에 3~5만원대 예산을 장전해야 해서 기분 좋은 긴장감이 생깁니다.',
    };
  }

  if (numPrice < 70000) {
    return {
      score,
      badgeText: `부담지수 ${score}% 🚨 상대방도 5만원 장전 필수`,
      levelTitle: '친밀감 검증급 (어색한 사이면 부담 폭발)',
      description: '어색한 사이면 큰일 나는 구간! 상대방도 내 생일 때 5만원 이상 지출할 각오가 되어 있어야 평화가 유지됩니다.',
    };
  }

  if (numPrice < 100000) {
    return {
      score,
      badgeText: `부담지수 ${score}% 💸 찐친 전용 지갑 털림각`,
      levelTitle: '고난도 품앗이 (다음 생일 지갑 털릴 각오)',
      description: '받고 기쁜 만큼 마음의 빚이 묵직해지는 구간! 다음 상대방 생일에 10만원권 수표급으로 돌려줘야 수지타산이 맞습니다.',
    };
  }

  return {
    score: 100,
    badgeText: `부담지수 100% 👑 본격 적금 품앗이 혈투`,
    levelTitle: '적금 품앗이급 (너 내 생일 때 기대해라)',
    description: '10만원 이상 프리미엄 플렉스! 상대방은 다음 내 생일에 적금 깨서 보답해야 하는 극한의 품앗이 빚더미 단계입니다.',
  };
}

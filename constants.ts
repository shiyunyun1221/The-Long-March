import { LevelConfig, QuizQuestion } from './types';

export const INITIAL_RESOURCES = {
  soldiers: 100, // Percentage representation
  supplies: 100,
  morale: 100
};

// Updated images with keywords that work better with grayscale/sepia filters
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "第一关：血战湘江",
    subtitle: "生存与突围",
    description: "1934年底，中央红军在湘江边与国民党军苦战五昼夜，最终从全州、兴安之间强渡湘江，突破了敌人的第四道封锁线。",
    poemLine: "红军不怕远征难，万水千山只等闲。",
    // Darker, chaotic river scenes
    backgroundUrl: "https://loremflickr.com/540/960/storm,river,dark",
    objective: "在敌军重兵围堵下，不惜一切代价掩护中央纵队过江。"
  },
  {
    id: 2,
    title: "第二关：巧渡金沙江",
    subtitle: "策略与战术",
    description: "1935年5月，红军利用7只小船，在7天7夜间将主力部队渡过金沙江，摆脱了数十万敌军的围追堵截。",
    poemLine: "金沙水拍云崖暖，大渡桥横铁索寒。",
    // Canyons and water
    backgroundUrl: "https://loremflickr.com/540/960/canyon,mist,cliff",
    objective: "运用调虎离山之计，利用有限船只完成全军渡河。"
  },
  {
    id: 3,
    title: "第三关：强渡大渡河与过雪山草地",
    subtitle: "极限意志",
    description: "1935年，红军飞夺泸定桥，随后翻越终年积雪的夹金山，穿越人迹罕至的水草地，展现了人类意志的极限。",
    poemLine: "更喜岷山千里雪，三军过后尽开颜。",
    // Snow and harsh terrain
    backgroundUrl: "https://loremflickr.com/540/960/snow,mountain,blizzard",
    objective: "在极端环境下生存，通过铁索桥并走出死亡沼泽。"
  },
  {
    id: 4,
    title: "第四关：激战腊子口",
    subtitle: "天险突围",
    description: "1935年9月，红军抵达甘南腊子口。这是长征途中最后一道天险，两侧绝壁千仞，只有一道狭窄的隘口，敌军居高临下疯狂扫射。",
    poemLine: "腊子口上降神兵，百丈悬崖当云梯。",
    backgroundUrl: "https://loremflickr.com/540/960/mountain,fortress,battle",
    objective: "躲避敌军密集的子弹和手榴弹，坚持到突击队攀上绝壁炸毁碉堡。"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "长征的出发地主要在哪里？",
    options: ["井冈山", "瑞金", "延安", "遵义"],
    correctAnswer: 1,
    explanation: "1934年10月，中央红军主力从瑞金等地出发，开始长征。"
  },
  {
    id: 2,
    question: "确立了毛泽东同志在党中央和红军的领导地位的是哪次会议？",
    options: ["古田会议", "八七会议", "遵义会议", "瓦窑堡会议"],
    correctAnswer: 2,
    explanation: "1935年1月召开的遵义会议，是党的历史上一个生死攸关的转折点。"
  },
  {
    id: 3,
    question: "红军长征行程约为多少？",
    options: ["一万里", "五万里", "二万五千里", "十万里"],
    correctAnswer: 2,
    explanation: "红军长征行程约二万五千里，故称“万里长征”。"
  },
  {
    id: 4,
    question: "“大渡桥横铁索寒”指的是哪场战役？",
    options: ["四渡赤水", "飞夺泸定桥", "强渡大渡河", "激战腊子口"],
    correctAnswer: 1,
    explanation: "指的是红军飞夺泸定桥的英勇事迹，22名勇士冒着枪林弹雨攀踏铁索攻占桥头。"
  },
  {
    id: 5,
    question: "三大主力红军在哪里会师，标志着长征胜利结束？",
    options: ["陕北吴起镇", "甘肃会宁", "四川甘孜", "贵州遵义"],
    correctAnswer: 1,
    explanation: "1936年10月，红军三大主力在甘肃会宁地区会师，标志着长征胜利结束。"
  }
];
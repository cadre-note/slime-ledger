import React from 'react';
const starPath = (cx, cy, R, r) => { let d=''; for (let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r:R; d+=(i?'L':'M')+(cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1)+' '; } return d+'Z'; };
const spk = (x,y,s) => `M ${x},${y-s} L ${x+s*0.28},${y-s*0.28} L ${x+s},${y} L ${x+s*0.28},${y+s*0.28} L ${x},${y+s} L ${x-s*0.28},${y+s*0.28} L ${x-s},${y} L ${x-s*0.28},${y-s*0.28} Z`;
export const NewFace = ({ expr, spirit, mouth }) => (
  <g>
                {expr === 'wink' && (<>
                  <path d="M 95,112 Q 105,106 115,111" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 145,108 Q 155,102 165,108" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <ellipse cx="105" cy="134" rx="8.2" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
                  <circle cx="102.5" cy="125" r="2.5" fill="#FFFFFF" />
                  <path d="M 143,136 Q 155,124 167,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 119,151 Q 130,151 141,151 Q 139,164 130,164 Q 121,164 119,151 Z" fill="#78350F" />
                  <path d="M 124,159 Q 130,155 136,159 Q 134,163 130,163 Q 126,163 124,159 Z" fill="#FB7185" />
                </>)}
                {expr === 'star' && (<>
                  <path d="M 94,106 Q 105,99 116,105" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 144,105 Q 155,99 166,106" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (
                    <path key={x} d={`M ${x},${117} L ${x + 5},${129} L ${x + 17},${130} L ${x + 8},${138} L ${x + 11},${150} L ${x},${143} L ${x - 11},${150} L ${x - 8},${138} L ${x - 17},${130} L ${x - 5},${129} Z`} fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="2.6" strokeLinejoin="round" />
                  ))}
                  <path d="M 120,154 Q 130,166 140,154 Z" fill="#78350F" />
                </>)}
                {expr === 'surprised' && (<>
                  <path d="M 94,112 Q 105,102 116,110" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 144,110 Q 155,102 166,112" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (
                    <g key={x}><circle cx={x} cy="132" r="11" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><circle cx={x} cy="133" r="4.6" fill="none" stroke={spirit.eyeRim} strokeWidth="1.8" opacity="0.7" /></g>
                  ))}
                  <ellipse cx="130" cy="158" rx="6" ry="7.5" fill="#78350F" />
                  <path d="M 72,100 l -10,-8 M 80,92 l -5,-11 M 188,100 l 10,-8 M 180,92 l 5,-11" stroke={spirit.eyeRim} strokeWidth="3" strokeLinecap="round" />
                </>)}
                {expr === 'pout' && (<>
                  {[105, 155].map((x, i) => (
                    <g key={x}>
                      <path d={`M ${x - 8.5},${130} L ${x + 8.5},${130} L ${x + 8.5},${136} A 8.5 10 0 0 1 ${x - 8.5},${136} Z`} fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinejoin="round" />
                      <path d={i === 0 ? `M ${x - 11},${121} L ${x + 9},${126}` : `M ${x + 11},${121} L ${x - 9},${126}`} stroke={spirit.eyeRim} strokeWidth="3" strokeLinecap="round" />
                    </g>
                  ))}
                  <ellipse cx="82" cy="152" rx="12" ry="7" fill="#FB7185" opacity="0.6" />
                  <ellipse cx="178" cy="152" rx="12" ry="7" fill="#FB7185" opacity="0.6" />
                  <path d="M 123,153 q 7,-8 7,0 q 0,8 7,0" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {expr === 'halflid' && (<>
                  <path d="M 95,121 L 115,123" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 145,123 L 165,121" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (
                    <g key={x}>
                      <path d={`M ${x - 9},${132} L ${x + 9},${132} A 9 11 0 0 1 ${x - 9},${132} Z`} fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinejoin="round" />
                      <path d={`M ${x - 11},${132} L ${x + 11},${132}`} stroke={spirit.eyeRim} strokeWidth="4" strokeLinecap="round" />
                    </g>
                  ))}
                  <path d="M 122,156 Q 130,153 138,156" fill="none" stroke={mouth} strokeWidth="3" strokeLinecap="round" />
                </>)}
                {expr === 'heart' && (<>
                  <path d="M 95,113 Q 105,108 115,113" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 145,113 Q 155,108 165,113" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <ellipse cx="84" cy="150" rx="11" ry="6" fill="#FB7185" opacity="0.55" />
                  <ellipse cx="176" cy="150" rx="11" ry="6" fill="#FB7185" opacity="0.55" />
                  {[105, 155].map(x => (
                    <g key={x}>
                      <path d={`M ${x},${146} C ${x - 18},${134} ${x - 14},${118} ${x - 6},${120} C ${x - 2},${121} ${x},${125} ${x},${127} C ${x},${125} ${x + 2},${121} ${x + 6},${120} C ${x + 14},${118} ${x + 18},${134} ${x},${146} Z`} fill="#FB7185" stroke={mouth} strokeWidth="2" />
                      <circle cx={x - 5} cy="125" r="2.2" fill="#FFFFFF" />
                    </g>
                  ))}
                  <path d="M 119,152 Q 130,152 141,152 Q 139,166 130,166 Q 121,166 119,152 Z" fill="#78350F" />
                  <path d="M 124,161 Q 130,156 136,161 Q 134,165 130,165 Q 126,165 124,161 Z" fill="#FB7185" />
                </>)}
                {/* ── 新增表情：沉穩 / 盯著你 / 安心閉眼（曜石）·· 斜眼 / 害羞（極光）·· 好吃（琥珀）·· 想睡 / 得意（晨風）·· 飛吻 / 淚眼（熾焰） ── */}
                {expr === 'calm' && (<>
                  <path d="M 94,113 L 116,112" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 144,112 L 166,113" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (<g key={x}><ellipse cx={x} cy="134" rx="8.2" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><circle cx={x - 2.5} cy="127" r="2.4" fill="#FFFFFF" /></g>))}
                  <path d="M 123,156 Q 130,159 137,156" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {expr === 'watch' && (<>
                  <path d="M 94,109 L 116,114" fill="none" stroke={spirit.eyeRim} strokeWidth="3.6" strokeLinecap="round" />
                  <path d="M 166,109 L 144,114" fill="none" stroke={spirit.eyeRim} strokeWidth="3.6" strokeLinecap="round" />
                  {[105, 155].map(x => (<g key={x}><ellipse cx={x} cy="135" rx="8.4" ry="16.5" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /></g>))}
                  <path d="M 122,157 L 138,157" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {expr === 'softclose' && (<>
                  <path d="M 95,120 Q 105,115 115,119" fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 145,119 Q 155,115 165,120" fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 93,132 Q 105,141 117,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M 143,132 Q 155,141 167,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M 121,155 Q 130,161 139,155" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {expr === 'sideeye' && (<>
                  <path d="M 94,114 L 116,114" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 144,109 Q 155,103 166,108" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (<g key={x}><path d={`M ${x - 8},${128} L ${x + 8},${126} L ${x + 8},${136} A 8 9 0 0 1 ${x - 8},${136} Z`} fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinejoin="round" /><path d={`M ${x - 10},${128.5} L ${x + 10},${125.5}`} stroke={spirit.eyeRim} strokeWidth="3.6" strokeLinecap="round" /></g>))}
                  <ellipse cx="86" cy="152" rx="10" ry="5.5" fill="#FB7185" opacity="0.4" /><ellipse cx="174" cy="152" rx="10" ry="5.5" fill="#FB7185" opacity="0.4" />
                  <path d="M 124,158 Q 130,155 137,158" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {expr === 'shy' && (<>
                  <path d="M 96,125 L 113,134 L 96,143" fill="none" stroke={spirit.eyeRim} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 164,125 L 147,134 L 164,143" fill="none" stroke={spirit.eyeRim} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <ellipse cx="84" cy="152" rx="13" ry="7.5" fill="#FB7185" opacity="0.7" /><ellipse cx="176" cy="152" rx="13" ry="7.5" fill="#FB7185" opacity="0.7" />
                  <path d="M 120,157 Q 125,152 130,157 Q 135,162 140,157" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {expr === 'yum' && (<>
                  <path d="M 94,117 Q 104,111 114,116" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 146,116 Q 156,111 166,117" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 92,135 Q 104,119 116,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 144,135 Q 156,119 168,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 113,150 Q 130,150 147,150 Q 145,173 130,173 Q 115,173 113,150 Z" fill="#78350F" />
                  <path d="M 120,166 Q 130,157 140,166 Q 136,172 130,172 Q 124,172 120,166 Z" fill="#FB7185" />
                </>)}
                {expr === 'sleepy' && (<>
                  <path d="M 94,122 L 116,125" fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 144,125 L 166,122" fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 94,133 Q 105,139 116,133" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M 144,133 Q 155,139 166,133" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
                  <ellipse cx="130" cy="159" rx="5.2" ry="6.8" fill="#78350F" />
                </>)}
                {expr === 'smug' && (<>
                  <path d="M 95,119 L 115,121" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 145,111 Q 155,106 165,111" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (<g key={x}><path d={`M ${x - 9},${132} L ${x + 9},${132} A 9 11 0 0 1 ${x - 9},${132} Z`} fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinejoin="round" /><path d={`M ${x - 11},${132} L ${x + 11},${132}`} stroke={spirit.eyeRim} strokeWidth="4" strokeLinecap="round" /></g>))}
                  <path d="M 120,158 Q 132,159 142,151" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {expr === 'kiss' && (<>
                  <path d="M 94,118 Q 104,112 114,117" fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 146,117 Q 156,112 166,118" fill="none" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 93,135 Q 104,121 115,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <path d="M 145,135 Q 156,121 167,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <ellipse cx="84" cy="151" rx="11" ry="6" fill="#FB7185" opacity="0.6" /><ellipse cx="176" cy="151" rx="11" ry="6" fill="#FB7185" opacity="0.6" />
                  <path d="M 130,152 C 123,152 124,162 130,162 C 136,162 137,152 130,152 Z" fill="#FB7185" />
                </>)}
                {expr === 'teary' && (<>
                  <path d="M 94,113 L 116,106" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 166,113 L 144,106" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  {[105, 155].map(x => (<g key={x}><ellipse cx={x} cy="134" rx="10" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><path d={`M ${x - 6},${140} Q ${x},${147} ${x + 6},${140}`} fill="none" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" /><path d={`M ${x - 5},${124} Q ${x - 1},${121} ${x + 3},${123}`} fill="none" stroke="#7DD3FC" strokeWidth="2.2" strokeLinecap="round" /></g>))}
                  <path d="M 97,152 Q 93,160 97,164 Q 101,160 97,152 Z" fill="#7DD3FC" opacity="0.9" />
                  <path d="M 121,159 Q 125,155 130,159 Q 135,163 139,159" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {/* ── 第二批新表情：晨風（慵懶）· 極光（冷冰冰但有情緒）· 曜石（三種風格候選） ── */}
                {expr === 'yawn' && (<>
                  <path d="M 93,128 Q 105,138 117,128" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <path d="M 143,128 Q 155,138 167,128" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <ellipse cx="130" cy="158" rx="9" ry="11" fill="#78350F" />
                  <ellipse cx="130" cy="165" rx="5.6" ry="3.6" fill="#FB7185" />
                  <ellipse cx="86" cy="150" rx="10" ry="5.5" fill="#FB7185" opacity="0.35" /><ellipse cx="174" cy="150" rx="10" ry="5.5" fill="#FB7185" opacity="0.35" />
                </>)}
                {expr === 'flop' && (<>
                  <path d="M 93,128 Q 105,138 117,128" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <path d="M 143,128 Q 155,138 167,128" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <ellipse cx="86" cy="150" rx="11" ry="6" fill="#FB7185" opacity="0.45" /><ellipse cx="174" cy="150" rx="11" ry="6" fill="#FB7185" opacity="0.45" />
                  <path d="M 120,155 Q 125,161 130,155 Q 135,161 140,155" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {expr === 'blep' && (<>
                  <g><path d="M 96,132 L 114,132 A 9 11 0 0 1 96,132 Z" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" strokeLinejoin="round" /><path d="M 94,132 L 116,132" stroke={spirit.eyeRim} strokeWidth="4" strokeLinecap="round" /></g>
                  <ellipse cx="155" cy="134" rx="8.4" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
                  <path d="M 121,155 Q 130,158 139,155" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 131,157 Q 138,157 138,163 Q 138,169 132,169 Q 126,169 126,163 Q 126,158 131,157 Z" fill="#FB7185" />
                </>)}
                {expr === 'cold' && (<>
                  <path d="M 93,134 L 117,134" fill="none" stroke={spirit.eyeRim} strokeWidth="5.6" strokeLinecap="round" />
                  <path d="M 143,134 L 167,134" fill="none" stroke={spirit.eyeRim} strokeWidth="5.6" strokeLinecap="round" />
                  <path d="M 124,158 L 136,158" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {expr === 'hmph' && (<>
                  <path d="M 93,132 L 117,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.8" strokeLinecap="round" />
                  <path d="M 143,135 L 167,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.8" strokeLinecap="round" />
                  <ellipse cx="84" cy="151" rx="13" ry="7.5" fill="#FB7185" opacity="0.7" /><ellipse cx="176" cy="151" rx="13" ry="7.5" fill="#FB7185" opacity="0.7" />
                  <path d="M 120,161 Q 130,152 140,161" fill="none" stroke={mouth} strokeWidth="3.6" strokeLinecap="round" />
                </>)}
                {expr === 'melt' && (<>
                  {[105, 155].map(x => (<g key={x}>
                    <ellipse cx={x} cy="134" rx="10" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
                    <path d={`M ${x},${124} L ${x + 2.4},${131.6} L ${x + 9},${134} L ${x + 2.4},${136.4} L ${x},${144} L ${x - 2.4},${136.4} L ${x - 9},${134} L ${x - 2.4},${131.6} Z`} fill="#7DD3FC" />
                  </g>))}
                  <ellipse cx="84" cy="152" rx="12" ry="6.5" fill="#FB7185" opacity="0.6" /><ellipse cx="176" cy="152" rx="12" ry="6.5" fill="#FB7185" opacity="0.6" />
                  <path d="M 122,158 Q 126,154 130,158 Q 134,162 138,158" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                </>)}
                {(expr === 'guard' || expr === 'nodA' || expr === 'proud') && (<>
                  <path d="M 92,110 L 118,110" fill="none" stroke={spirit.eyeRim} strokeWidth="4.8" strokeLinecap="round" />
                  <path d="M 142,110 L 168,110" fill="none" stroke={spirit.eyeRim} strokeWidth="4.8" strokeLinecap="round" />
                  {expr === 'guard' && [105, 155].map(x => (<ellipse key={x} cx={x} cy="134" rx="8.2" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
                  {expr === 'nodA' && (<><path d="M 93,132 Q 105,139 117,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" /><path d="M 143,132 Q 155,139 167,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" /></>)}
                  {expr === 'proud' && (<><path d="M 93,137 Q 105,121 117,137" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" /><path d="M 143,137 Q 155,121 167,137" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" /></>)}
                  {expr === 'proud' ? <path d="M 122,155 Q 130,160 138,155" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" /> : <path d="M 122,157 L 138,157" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />}
                </>)}
                {(expr === 'glow' || expr === 'glowclose' || expr === 'glowwink') && (<>
                  {(expr === 'glow' || expr === 'glowwink') && (<g>
                    <ellipse cx="105" cy="134" rx="9" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
                    <ellipse cx="105" cy="136" rx="5" ry="9.5" fill="#FDBA74" /><circle cx="102.5" cy="128" r="2.4" fill="#FFFFFF" />
                  </g>)}
                  {expr === 'glow' && (<g>
                    <ellipse cx="155" cy="134" rx="9" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
                    <ellipse cx="155" cy="136" rx="5" ry="9.5" fill="#FDBA74" /><circle cx="152.5" cy="128" r="2.4" fill="#FFFFFF" />
                  </g>)}
                  {expr === 'glowwink' && <path d="M 143,136 Q 155,121 167,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />}
                  {expr === 'glowclose' && (<><path d="M 93,132 Q 105,139 117,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" /><path d="M 143,132 Q 155,139 167,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" /></>)}
                  <path d="M 122,156 Q 130,161 138,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {(expr === 'still' || expr === 'lineclose' || expr === 'smileC') && (<>
                  {(expr === 'still' || expr === 'smileC') && [105, 155].map(x => (<ellipse key={x} cx={x} cy="134" rx="6" ry="16.5" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
                  {expr === 'lineclose' && (<><path d="M 94,134 L 116,134" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" /><path d="M 144,134 L 166,134" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" /></>)}
                  {expr === 'smileC' ? <path d="M 123,156 Q 130,161 137,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" /> : <path d="M 123,157 L 137,157" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />}
                </>)}
                {expr === 'smileA' && (<>
                  {[105, 155].map(x => (<ellipse key={x} cx={x} cy="134" rx="8.4" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
                  <ellipse cx="85" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.45" /><ellipse cx="175" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.45" />
                  <path d="M 122,156 Q 130,163 138,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {expr === 'smileB' && (<>
                  <path d="M 93,136 Q 105,122 117,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
                  <path d="M 143,136 Q 155,122 167,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
                  <ellipse cx="85" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.45" /><ellipse cx="175" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.45" />
                  <path d="M 122,156 Q 130,163 138,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {expr === 'doze' && (<>
                  <path d="M 93,130 Q 105,140 117,130" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <path d="M 143,130 Q 155,140 167,130" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <ellipse cx="86" cy="150" rx="10" ry="5.5" fill="#FB7185" opacity="0.4" /><ellipse cx="174" cy="150" rx="10" ry="5.5" fill="#FB7185" opacity="0.4" />
                  <path d="M 124,158 Q 130,161 136,158" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
                  <circle cx="146" cy="156" r="8.5" fill="#FFFFFF" fillOpacity="0.35" stroke={mouth} strokeWidth="2.4" /><circle cx="143" cy="153" r="2" fill="#FFFFFF" />
                </>)}
                {expr === 'daze' && (<>
                  {[105, 155].map(x => (<ellipse key={x} cx={x} cy="134" rx="8.4" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
                  <ellipse cx="130" cy="159" rx="4.4" ry="5.2" fill="none" stroke={mouth} strokeWidth="3.2" />
                </>)}
                {expr === 'cozy' && (<>
                  <path d="M 93,130 Q 105,140 117,130" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <path d="M 143,130 Q 155,140 167,130" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
                  <ellipse cx="85" cy="151" rx="12" ry="6.5" fill="#FB7185" opacity="0.55" /><ellipse cx="175" cy="151" rx="12" ry="6.5" fill="#FB7185" opacity="0.55" />
                  <path d="M 121,156 Q 130,164 139,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
                </>)}
                {expr === 'spark' && (<>
                  {[105, 155].map(x => (<g key={x}>
                    <ellipse cx={x} cy="134" rx="10" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
                    <path d={`M ${x},${123} L ${x + 2.6},${131.4} L ${x + 10},${134} L ${x + 2.6},${136.6} L ${x},${145} L ${x - 2.6},${136.6} L ${x - 10},${134} L ${x - 2.6},${131.4} Z`} fill="#FDE047" />
                  </g>))}
                  <path d="M 119,155 Q 130,168 141,155 Z" fill="#78350F" /><path d="M 124,162 Q 130,167 136,162 Z" fill="#FB7185" />
                </>)}
                {expr === 'laugh' && (<>
                  <path d="M 93,136 Q 105,120 117,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
                  <path d="M 143,136 Q 155,120 167,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
                  <ellipse cx="84" cy="151" rx="12" ry="6.5" fill="#FB7185" opacity="0.55" /><ellipse cx="176" cy="151" rx="12" ry="6.5" fill="#FB7185" opacity="0.55" />
                  <path d="M 114,153 Q 130,174 146,153 Z" fill="#78350F" /><path d="M 122,164 Q 130,171 138,164 Q 130,160 122,164 Z" fill="#FB7185" />
                </>)}
                {expr === 'awe' && (<>
                  {[105, 155].map(x => (<ellipse key={x} cx={x} cy="133" rx="9.6" ry="17" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
                  <ellipse cx="84" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.5" /><ellipse cx="176" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.5" />
                  <ellipse cx="130" cy="160" rx="6.4" ry="8" fill="#78350F" /><ellipse cx="130" cy="164" rx="3.6" ry="2.6" fill="#FB7185" />
                </>)}
                {expr === 'happy' && (<>
                  <path d="M 94,118 Q 104,112 114,117" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 146,117 Q 156,112 166,118" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 92,136 Q 104,120 116,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 144,136 Q 156,120 168,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 118,150 Q 124,159 130,150 Q 136,159 142,150" fill="none" stroke={mouth} strokeWidth="3.5" strokeLinecap="round" />
                </>)}
    {expr === 'praise' && (<>
      <path d="M 93,136 Q 105,121 117,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
      <path d="M 143,136 Q 155,121 167,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
      <ellipse cx="85" cy="151" rx="11" ry="6" fill="#FB7185" opacity="0.45" /><ellipse cx="175" cy="151" rx="11" ry="6" fill="#FB7185" opacity="0.45" />
      <path d="M 123,156 Q 130,162 137,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
      <g transform="translate(170 72) scale(1.8)"><rect x="0" y="8" width="5" height="11" rx="1.5" fill={spirit.eyeRim} /><path d="M 7,9 L 11,1 Q 14,0 14,4 L 13,8 L 18,8 Q 21,9 20,12 L 19,16 Q 18,19 15,19 L 7,19 Z" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="1.6" strokeLinejoin="round" /></g>
    </>)}
    {expr === 'excite' && (<>
      {[105,155].map(x => (<path key={x} d={starPath(x,134,13,5.6)} fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="2.8" strokeLinejoin="round" />))}
      <ellipse cx="84" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.5" /><ellipse cx="176" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.5" />
      <path d="M 113,153 Q 130,176 147,153 Z" fill="#78350F" /><path d="M 122,164 Q 130,171 138,164 Q 130,160 122,164 Z" fill="#FB7185" />
    </>)}
    {expr === 'cheer' && (<>
      <path d="M 93,137 Q 105,119 117,137" fill="none" stroke={spirit.eyeRim} strokeWidth="5" strokeLinecap="round" />
      <path d="M 143,137 Q 155,119 167,137" fill="none" stroke={spirit.eyeRim} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="83" cy="152" rx="12" ry="6.5" fill="#FB7185" opacity="0.55" /><ellipse cx="177" cy="152" rx="12" ry="6.5" fill="#FB7185" opacity="0.55" />
      <path d="M 110,151 Q 130,182 150,151 Z" fill="#78350F" /><path d="M 120,165 Q 130,174 140,165 Q 130,160 120,165 Z" fill="#FB7185" />
      <path d={spk(70,112,7)} fill="#FDE047" stroke="#F59E0B" strokeWidth="1.4" /><path d={spk(192,106,8)} fill="#FDE047" stroke="#F59E0B" strokeWidth="1.4" /><path d={spk(200,132,5)} fill="#FDE047" stroke="#F59E0B" strokeWidth="1.2" />
    </>)}
    {expr === 'sunny' && (<>
      {[105,155].map(x => (<g key={x}>
        {[-60,-30,0,30,60].map(a => { const r=a*Math.PI/180, x1=x+Math.sin(r)*21, y1=134-Math.cos(r)*21, x2=x+Math.sin(r)*27, y2=134-Math.cos(r)*27; return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={spirit.eyeRim} strokeWidth="3" strokeLinecap="round" />; })}
        <ellipse cx={x} cy="134" rx="9" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><circle cx={x-2.5} cy="127" r="2.6" fill="#FFFFFF" />
      </g>))}
      <ellipse cx="84" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.45" /><ellipse cx="176" cy="152" rx="11" ry="6" fill="#FB7185" opacity="0.45" />
      <path d="M 116,153 Q 130,170 144,153 Z" fill="#78350F" />
    </>)}
    {expr === 'relief' && (<>
      <path d="M 93,137 Q 105,124 117,137" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
      <path d="M 143,137 Q 155,124 167,137" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
      <ellipse cx="85" cy="151" rx="10" ry="5.5" fill="#FB7185" opacity="0.35" /><ellipse cx="175" cy="151" rx="10" ry="5.5" fill="#FB7185" opacity="0.35" />
      <path d="M 123,156 Q 130,161 137,156" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
    </>)}
    {expr === 'focus' && (<>
      {[105,155].map(x => (<ellipse key={x} cx={x} cy="134" rx="6.4" ry="13" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
      <path d="M 123,157 L 137,157" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
    </>)}
    {expr === 'rest' && (<>
      <path d="M 93,132 Q 105,140 117,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
      <path d="M 143,132 Q 155,140 167,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.4" strokeLinecap="round" />
      <path d="M 124,157 L 136,157" fill="none" stroke={mouth} strokeWidth="3.2" strokeLinecap="round" />
    </>)}
    {expr === 'smirk' && (<>
      {[105,155].map(x => (<ellipse key={x} cx={x} cy="135" rx="7.6" ry="12" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />))}
      <path d="M 120,159 Q 131,160 141,152" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
    </>)}
    {expr === 'shine' && (<>
      {[105,155].map(x => (<g key={x}>
        <ellipse cx={x} cy="134" rx="12" ry="17" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" />
        <path d={spk(x,134,10)} fill={spirit.eyeRim} /><path d={spk(x+7,123,4)} fill={spirit.eyeRim} />
      </g>))}
      <ellipse cx="82" cy="153" rx="11" ry="6" fill="#FB7185" opacity="0.5" /><ellipse cx="178" cy="153" rx="11" ry="6" fill="#FB7185" opacity="0.5" />
      <path d="M 118,153 Q 130,168 142,153 Z" fill="#78350F" />
    </>)}
    {expr === 'puff' && (<>
      <path d="M 93,133 L 117,133" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
      <path d="M 143,133 L 167,133" fill="none" stroke={spirit.eyeRim} strokeWidth="4.6" strokeLinecap="round" />
      <ellipse cx="84" cy="154" rx="15" ry="12" fill="#FB7185" opacity="0.4" stroke={spirit.eyeRim} strokeWidth="2.4" />
      <ellipse cx="176" cy="154" rx="15" ry="12" fill="#FB7185" opacity="0.4" stroke={spirit.eyeRim} strokeWidth="2.4" />
      <ellipse cx="130" cy="158" rx="5" ry="3.6" fill="none" stroke={mouth} strokeWidth="3.2" />
    </>)}
    {expr === 'wow' && (<>
      <path d="M 93,108 Q 105,99 117,106" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M 143,106 Q 155,99 167,108" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
      {[105,155].map(x => (<g key={x}><ellipse cx={x} cy="133" rx="11" ry="17" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><circle cx={x-3} cy="125" r="3.4" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="1.2" /></g>))}
      <ellipse cx="82" cy="153" rx="10" ry="5.5" fill="#FB7185" opacity="0.45" /><ellipse cx="178" cy="153" rx="10" ry="5.5" fill="#FB7185" opacity="0.45" />
      <ellipse cx="130" cy="160" rx="9" ry="10" fill="#78350F" /><ellipse cx="130" cy="165" rx="5" ry="3.5" fill="#FB7185" />
    </>)}
    {expr === 'huh' && (<>
      <path d="M 93,114 Q 105,110 117,114" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M 143,100 Q 155,92 167,100" fill="none" stroke={spirit.eyeRim} strokeWidth="3.4" strokeLinecap="round" />
      {[105,155].map(x => (<g key={x}><circle cx={x} cy="134" r="12.5" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><circle cx={x+3} cy="131" r="4" fill={spirit.eyeRim} opacity="0.85" /><circle cx={x+1} cy="129" r="1.6" fill="#FFFFFF" /></g>))}
      <path d="M 122,159 Q 130,153 138,159" fill="none" stroke={mouth} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M 186,92 q 6,-8 12,-2 q 5,6 -3,10 q -3,2 -2,6" fill="none" stroke={spirit.eyeRim} strokeWidth="3" strokeLinecap="round" /><circle cx="193" cy="113" r="2" fill={spirit.eyeRim} />
    </>)}
    {expr === 'eatjoy' && (<>
      <path d="M 92,132 Q 104,116 116,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 144,132 Q 156,116 168,132" fill="none" stroke={spirit.eyeRim} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="82" cy="146" rx="11" ry="6" fill="#FB7185" opacity="0.55" /><ellipse cx="178" cy="146" rx="11" ry="6" fill="#FB7185" opacity="0.55" />
      <path d="M 118,150 Q 124,159 130,150 Q 136,159 142,150" fill="none" stroke={mouth} strokeWidth="3.5" strokeLinecap="round" />
    </>)}
    {expr === 'gape' && (<>
      {[104,156].map(x => (<ellipse key={x} cx={x} cy="128" rx="9.5" ry="17" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.4" />))}
      <ellipse cx="82" cy="144" rx="10" ry="5.5" fill="#FB7185" opacity="0.48" /><ellipse cx="178" cy="144" rx="10" ry="5.5" fill="#FB7185" opacity="0.48" />
      <path d="M 112,147 Q 130,142 148,147 C 150,170 139,178 130,178 C 121,178 110,170 112,147 Z" fill="#78350F" />
      <path d="M 118,164 Q 130,156 142,164 C 140,173 135,177 130,177 C 125,177 120,173 118,164 Z" fill="#FB7185" />
    </>)}
    {expr === 'sleepz' && (<>
      <path d="M 93,136 Q 105,146 117,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 143,136 Q 155,146 167,136" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
      <ellipse cx="130" cy="157" rx="3.4" ry="2.8" fill={mouth} />
      <text x="176" y="104" fontSize="20" fontWeight="800" fill={spirit.eyeRim} className="animate-zz">z</text>
      <text x="190" y="86" fontSize="14" fontWeight="800" fill={spirit.eyeRim} className="animate-zz" style={{ animationDelay: '.7s' }}>z</text>
    </>)}
    {expr === 'hungry' && (<>
      {[105,155].map(x => (<g key={x}><ellipse cx={x} cy="136" rx="8.5" ry="15" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><circle cx={x+2} cy="142" r="2.4" fill="#38BDF8" opacity="0.85" /></g>))}
      <path d="M 94,114 Q 104,110 112,116" fill="none" stroke={spirit.eyeRim} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M 166,114 Q 156,110 148,116" fill="none" stroke={spirit.eyeRim} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M 121,158 Q 130,151 139,158" fill="none" stroke={mouth} strokeWidth="3" strokeLinecap="round" />
    </>)}
    {expr === 'blink' && (<>
      <path d="M 95,135 Q 105,139 115,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 145,135 Q 155,139 165,135" fill="none" stroke={spirit.eyeRim} strokeWidth="4.2" strokeLinecap="round" />
      <ellipse cx="84" cy="147" rx="9.5" ry="4.8" fill="#FB7185" opacity="0.34" /><ellipse cx="176" cy="147" rx="9.5" ry="4.8" fill="#FB7185" opacity="0.34" />
    </>)}
    {!expr && (<g>
      {[105,155].map(x => (<g key={x}><ellipse cx={x} cy="134" rx="8.4" ry="16" fill="#FFFFFF" stroke={spirit.eyeRim} strokeWidth="3.2" /><ellipse cx={x} cy="134" rx="4.8" ry="11" fill="#FFFFFF" /><circle cx={x-2.5} cy="125" r="2.5" fill="#FFFFFF" /></g>))}
      <ellipse cx="84" cy="147" rx="9.5" ry="4.8" fill="#FB7185" opacity="0.34" /><ellipse cx="176" cy="147" rx="9.5" ry="4.8" fill="#FB7185" opacity="0.34" />
    </g>)}
  </g>
);

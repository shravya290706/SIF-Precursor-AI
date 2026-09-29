export const lifeSavingRules=[
  {id:'bypassing',name:'Bypassing Safety Controls',terms:['bypass','bypassed','override','interlock','guard']},
  {id:'confined',name:'Confined Space',terms:['confined space','tank','vessel','manhole','oxygen deficient']},
  {id:'driving',name:'Driving',terms:['driving','vehicle','truck','forklift','backing','seat belt']},
  {id:'energy',name:'Energy Isolation',terms:['lockout','tagout','isolat','de-energ','pressure','stored energy','bleed']},
  {id:'hot-work',name:'Hot Work',terms:['hot work','welding','weld','cutting torch','ignition','flammable','fire','explosion']},
  {id:'line-of-fire',name:'Line of Fire',terms:['caught','pinch','struck','between','line of fire','suspended','falling object']},
  {id:'lifting',name:'Mechanical Lifting',terms:['crane','hoist','lifting','sling','load','rigging','dropped']},
  {id:'height',name:'Work at Height',terms:['height','ladder','scaffold','derrick','roof','elevated','fall']},
  {id:'well-operations',name:'Well Operations',terms:['well','drilling','casing','wellhead','blowout','tubing']},
]
export function mapLifeSavingRules(narrative){const text=narrative.toLowerCase();return lifeSavingRules.filter((rule)=>rule.terms.some((term)=>text.includes(term)))}